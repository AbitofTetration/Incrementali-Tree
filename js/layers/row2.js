addLayer("s", {
        name: "singularity", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
          unlocked: false,
			    points: new Decimal(0),
          power: new Decimal(0)
        }},
        color: "#888888",
        requires: new Decimal(500), // Can be a function that takes requirement increases into account
        resource: "singularity levels", // Name of prestige currency
        baseResource: "prestige points", // Name of resource prestige is based on
        baseAmount() {return player.p.points}, // Get the current amount of baseResource
        type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.85, // Prestige currency exponent
        base: 3,
        effect() {
          let eff = Decimal.pow(1.5, player[this.layer].points).sub(1)
          if (hasUpgrade(this.layer, 12)) eff = eff.mul(upgradeEffect(this.layer, 12))
          if (hasUpgrade(this.layer, 21)) eff = eff.mul(upgradeEffect(this.layer, 21))
          if (player.q.unlocked) eff = eff.mul(buyableEffect("q", 12))
          if(eff.gt(1e7)) eff = eff.sqrt().mul(Decimal.sqrt(1e7))
          return eff
        },
        effectDescription() {
          let eff = this.effect()
          return "giving "+format(eff)+" singularity power per second"
        },
        singularityPowerBoost() {
          let base = player[this.layer].power.add(1)
          
          let eff = Decimal.pow(base, 0.25)
          
          return eff
        },
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            if (player[this.layer].points.gt(26)) mult = mult.div(100)
            if (player[this.layer].points.gt(30)) mult = mult.div(100)
            if (player[this.layer].points.gt(33)) mult = mult.div(1e8)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            let exp = new Decimal(1)
            if (player[this.layer].points.gt(26)) exp = exp.div(1.25)
            if (player[this.layer].points.gt(30)) exp = exp.div(1.25)
            if (player[this.layer].points.gt(33)) exp = exp.div(1.5)
            return exp
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        milestones: {
            0: {requirementDescription: "6 Singularity Levels",
                done() {return player[this.layer].points.gte(6)}, // Used to determine when to give the milestone
                effectDescription: "You keep prestige upgrades on reset.",
            },
            1: {requirementDescription: "19 Singularity Levels",
                unlocked() {return player.i.unlocked},
                done() {return player[this.layer].points.gte(19)}, // Used to determine when to give the milestone
                effectDescription: "You gain 10% of prestige points on reset per second.",
            },
        },
        upgrades: {
            rows: 2,
            cols: 3,
            11: {
                description: "Incrementali boost is 2% more effective.",
                cost: new Decimal(5),
                currencyDisplayName: "singularity power", // Use if using a nonstandard currency
                currencyLocation() {return player[this.layer]}, // The object in player data that the currency is contained in
                currencyInternalName: "power", // Use if using a nonstandard currency
                unlocked() { return true},
            },
            12: {
                description: "Singularity power gain is multiplied by incrementali.",
                cost: new Decimal(75),
                currencyDisplayName: "singularity power", // Use if using a nonstandard currency
                currencyLocation() {return player[this.layer]}, // The object in player data that the currency is contained in
                currencyInternalName: "power", // Use if using a nonstandard currency
                unlocked() { return hasUpgrade(this.layer, 11)},
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player.points.add(1).log10().add(1).log10().add(1)
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
            13: {
                description: "Permanently unlock a Singularity Rune.",
                cost: new Decimal(500),
                currencyDisplayName: "singularity power", // Use if using a nonstandard currency
                currencyLocation() {return player[this.layer]}, // The object in player data that the currency is contained in
                currencyInternalName: "power", // Use if using a nonstandard currency
                unlocked() { return hasUpgrade(this.layer, 12)},
            },
            21: {
                description: "Singularity power gain is multiplied by singularity power.",
                cost: new Decimal(10000),
                currencyDisplayName: "singularity power", // Use if using a nonstandard currency
                currencyLocation() {return player[this.layer]}, // The object in player data that the currency is contained in
                currencyInternalName: "power", // Use if using a nonstandard currency
                unlocked() { return hasUpgrade(this.layer, 13)},
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player[this.layer].power.add(1).log10().add(1).sqrt()
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
            22: {
                description: "Prestige point gain is multiplied by singularity power.",
                cost: new Decimal(90000),
                currencyDisplayName: "singularity power", // Use if using a nonstandard currency
                currencyLocation() {return player[this.layer]}, // The object in player data that the currency is contained in
                currencyInternalName: "power", // Use if using a nonstandard currency
                unlocked() { return hasUpgrade(this.layer, 21)},
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player[this.layer].power.add(1).log10().add(1)
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
        },
        update(diff) {
          if (player.s.unlocked) player[this.layer].power = player[this.layer].power.add(layers.s.effect().mul(diff))
        },
        hotkeys: [
            {key: "s", description: "S: Reset for singularity levels", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        midsection: [
            ["display-text", function() {return "You have "+format(player.s.power)+" singularity power, multiplying incrementali gain by "+format(layers.s.singularityPowerBoost())+"x"}],
        ],
        layerShown(){return player.p.points.gt(45) || player.s.unlocked},
        branches: ["p"], // When this layer appears, a branch will appear from this layer to any layers here. Each entry can be a pair consisting of a layer id and a color.
})

addLayer("i", {
        name: "galaxy", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
          unlocked: false,
			    points: new Decimal(0)
        }},
        color: "#bfbf00",
        requires: new Decimal(2e8), // Can be a function that takes requirement increases into account
        resource: "incrementali galaxies", // Name of prestige currency
        baseResource: "incrementali", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.75, // Prestige currency exponent
        base: 10,
        effect() {
          let eff = {
            incrementMult: new Decimal.pow(5, player[this.layer].points.sqrt()),
            incrementBuff: new Decimal.pow(1.05, player[this.layer].points.sqrt())
          }
            let set = {
              incrementMult: new Decimal(25),
              incrementBuff: new Decimal(1.1),
            }
          for (var i in eff) {
            if (eff[i].gt(set[i])) {
              eff[i] = eff[i].sqrt().mul(set[i].sqrt())
            }
          }
          return eff
        },
        effectDescription() {
          let eff = this.effect()
          return "multiplying incrementali gain by "+format(eff.incrementMult)+"x and increasing the exponent of the self-boost by "+format(eff.incrementBuff.sub(1).mul(100))+"%"
        },
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        buyables: {
            rows: 1,
            cols: 12,
            showRespec: true,
            respec() { // Optional, reset things and give back your currency. Having this function makes a respec button appear
                resetBuyables(this.layer)
                doReset(this.layer, true) // Force a reset
            },
            respecText: "Respec Upgrades", // Text on Respec button, optional
            11: {
                title: "Increment Upgrade", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let base = new Decimal(1e9)
                    let mult = Decimal.pow(10,x)
                    if (mult.gt(1e6)) mult = mult.pow(2).div(1e6)
                    return base.mul(mult)
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = Decimal.div(x, 5).add(1).sqrt()
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " incrementali\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Boosts the incrementali effect by " + format(data.effect.sub(1).mul(100), 0) + "%"
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.points = player.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "Prestige Upgrade", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let base = new Decimal(1e10)
                    let mult = Decimal.pow(100,x)
                    if (mult.gt(1e9)) mult = mult.pow(2).div(1e9)
                    return base.mul(mult)
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = Decimal.div(x, 6).add(1).pow(12)
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " incrementali\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Multiplies prestige point gain by " + format(data.effect) + "x"
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.points = player.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        milestones: {
            0: {requirementDescription: "4 Incrementali Galaxies",
                done() {return player[this.layer].points.gte(4)}, // Used to determine when to give the milestone
                effectDescription: "You keep prestige upgrades on reset.",
            },
        },
        hotkeys: [
            {key: "i", description: "I: Reset for incrementali galaxies", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.s.points.gt(6) || player.i.unlocked},
        branches: ["p"], // When this layer appears, a branch will appear from this layer to any layers here. Each entry can be a pair consisting of a layer id and a color.
})