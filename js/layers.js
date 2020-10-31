addLayer("p", {
        name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
            unlocked: true,
			points: new Decimal(0),
        }},
        color: "#4BDC13",
        requires: new Decimal(0.25), // Can be a function that takes requirement increases into account
        resource: "prestige points", // Name of prestige currency
        baseResource: "incrementali", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        upgrades: {
            rows: 3,
            cols: 3,
            11: {
                description: "Incrementali boost is 10% more effective.",
                cost: new Decimal(1),
                unlocked() { return true},
            },
            12: {
                description: "Incrementali boost is 10% more effective.",
                cost: new Decimal(1),
                unlocked() { return hasUpgrade(this.layer, 11)},
            },
            13: {
                description: "Double incrementy gain.",
                cost: new Decimal(1),
                unlocked() { return hasUpgrade(this.layer, 12)},
            },
            21: {
                description: "Multiply incrementali gain based on prestige points.",
                cost: new Decimal(1),
                unlocked() { return hasUpgrade(this.layer, 13)},
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player[this.layer].points.add(1).log10().add(1)
                    if (hasUpgrade(this.layer, 31)) ret = ret.pow(1.3)
                    if (hasUpgrade(this.layer, 33)) ret = ret.pow(1.6)
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
            22: {
                description: "Triple incrementy gain.",
                cost: new Decimal(2),
                unlocked() { return hasUpgrade(this.layer, 21)},
            },
            23: {
                description: "Incrementali boost is 15% more effective.",
                cost: new Decimal(6),
                unlocked() { return hasUpgrade(this.layer, 22)},
            },
            31: {
                description: "The 4th prestige upgrade is 30% stronger.",
                cost: new Decimal(15),
                unlocked() { return hasUpgrade(this.layer, 23)},
            },
            32: {
                description: "Quadruple incrementy gain.",
                cost: new Decimal(22),
                unlocked() { return hasUpgrade(this.layer, 31)},
            },
            33: {
                description: "The 4th prestige upgrade is 60% stronger.",
                cost: new Decimal(45),
                unlocked() { return hasUpgrade(this.layer, 32)},
            },
        },
        hotkeys: [
            {key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return true},
})

addLayer("q", {
        name: "quark", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "Q", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
            unlocked: true,
	      		points: new Decimal(0),
            goals: [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)
                   ,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)
                   ,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)]
        }},
        color: "#00BFBF",
        requires: new Decimal(0.25), // Can be a function that takes requirement increases into account
        resource: "quarks", // Name of prestige currency
        type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        row: "side", // Row the layer is in on the tree (0 is the first row)
        layerShown(){return true},

        bars: {
            pointsBar: {
                fillStyle: {'background-color' : "#FFFFFF"},
                baseStyle: {'background-color' : "#696969"},
                textStyle: {'color': '#04e050'},

                borderStyle() {return {}},
                direction: RIGHT,
                width: 400,
                height: 40,
                goal() {
                    return Decimal.pow(6, player[this.layer].goals[0].pow(1.25).add(2))
                },
                progress() {
                    if (player.points.log(10).div(this.goal().log10()).gt(1)) {
                      player[this.layer].goals[0] = player[this.layer].goals[0].add(1)
                      player[this.layer].points = player[this.layer].points.add(1)
                    }
                    return (player.points.log(10).div(this.goal().log10())).toNumber()
                },
                display() {
                    return "Next quark at \n"+format(player.points) + " / "+format(this.goal())+" incrementali"
                },
                unlocked: true,

            },
        },
        buyables: {
            rows: 1,
            cols: 12,
            showRespec: true,
            respec() { // Optional, reset things and give back your currency. Having this function makes a respec button appear
                player[this.layer].points = player[this.layer].points.add(player[this.layer].spentOnBuyables) // A built-in thing to keep track of this but only keeps a single value
                resetBuyables(this.layer)
                doReset(this.layer, true) // Force a reset
            },
            respecText: "Respec Thingies", // Text on Respec button, optional
            11: {
                title: "Increment Rune", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if (x.gte(25)) x = x.pow(2).div(25)
                    let cost = Decimal.mul(3, Decimal.pow(1.5, x))
                    return cost.floor()
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = Decimal.div(x, 4).add(1).sqrt()
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " quarks\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Boosts the incrementali effect by " + format(data.effect.sub(1).mul(100), 0) + "%"
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
        },

    midsection: [
        ["bar", "pointsBar"]
    ],
})