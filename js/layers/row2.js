addLayer("s", {
        name: "singularity", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
          unlocked: false,
			    points: new Decimal(0),
          power: new Decimal(0)
        }},
        color: "#4BDC13",
        requires: new Decimal(500), // Can be a function that takes requirement increases into account
        resource: "singularity levels", // Name of prestige currency
        baseResource: "prestige points", // Name of resource prestige is based on
        baseAmount() {return player.p.points}, // Get the current amount of baseResource
        type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 1, // Prestige currency exponent
        base: 1.04,
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        update(diff) {
          
        },
        hotkeys: [
            {key: "s", description: "S: Reset for singularity levels", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.p.points.gt(100)},
})