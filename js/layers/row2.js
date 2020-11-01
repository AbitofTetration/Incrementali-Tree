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
        requires: new Decimal(2500), // Can be a function that takes requirement increases into account
        resource: "singularity levels", // Name of prestige currency
        baseResource: "prestige points", // Name of resource prestige is based on
        baseAmount() {return player.p.points}, // Get the current amount of baseResource
        type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 1, // Prestige currency exponent
        base: 2.50,
        effect() {
          let eff = Decimal.pow(1.5, player[this.layer].points).sub(1)
          return eff
        },
        effectDescription() {
          let eff = this.effect()
          return "giving "+format(eff)+" singularity power per second"
        },
        singularityPowerBoost() {
          let base = player[this.layer].power
          
          let eff = Decimal.pow(1.25, base.sqrt())
          
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
        update(diff) {
          if (player.s.unlocked) player[this.layer].power = player[this.layer].power.add(layers.s.effect().mul(diff))
        },
        hotkeys: [
            {key: "s", description: "S: Reset for singularity levels", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        midsection: [
            ["display-text", function() {return "You have "+format(player.s.power)+" singularity power, multiplying incrementy gain by "+format(layers.s.singularityPowerBoost())+"x"}],
        ],
        layerShown(){return player.p.points.gt(100) || player.s.unlocked},
})