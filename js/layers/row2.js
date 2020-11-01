function scaleStaticCost(gain, row) {
	if (gain.gte(1225)) gain = gain.pow(10).div(Decimal.pow(1225, 9));
	if (gain.gte(12) && row<4) gain = gain.pow(2).div(12);
	return gain;
}

function softcapStaticGain(gain, row) {
	if (gain.gte(12) && row<4) gain = gain.times(12).sqrt();
	if (gain.gte(1225)) gain = gain.times(Decimal.pow(1225, 9)).root(10);
	return gain;
}

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
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        milestones: {
            0: {requirementDescription: "6 Singularity Power",
                done() {return player[this.layer].points.gte(6)}, // Used to determine when to give the milestone
                effectDescription: "You keep prestige upgrades on reset.",
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
            ["display-text", function() {return "You have "+format(player.s.power)+" singularity power, multiplying incrementy gain by "+format(layers.s.singularityPowerBoost())+"x"}],
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
        color: "#888888",
        requires: new Decimal(2e8), // Can be a function that takes requirement increases into account
        resource: "incrementali galaxies", // Name of prestige currency
        baseResource: "incrementali", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        base: 10,
        effect() {
          let eff = {
            incrementMult: new Decimal.pow(2, player[this.layer].points.sqrt()),
            incrementBuff: new Decimal.pow(1.05, player[this.layer].points.sqrt()).sub(1)
          }
          return eff
        },
        effectDescription() {
          let eff = this.effect()
          return "multiplying incrementali gain by "+format(eff.incrementMult)+"x and multiplying the exponent of the self-boost by "+format(eff.incrementBuff)+""
        },
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        milestones: {
            0: {requirementDescription: "3 Incrementali Galaxies",
                done() {return player[this.layer].points.gte(3)}, // Used to determine when to give the milestone
                effectDescription: "You keep prestige upgrades on reset.",
            },
        },
        hotkeys: [
            {key: "i", description: "I: Reset for incrementali galaxies", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.s.points.gt(6) || player.i.unlocked},
        branches: ["p"], // When this layer appears, a branch will appear from this layer to any layers here. Each entry can be a pair consisting of a layer id and a color.
})