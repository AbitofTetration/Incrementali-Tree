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
        },
        hotkeys: [
            {key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return true},
})