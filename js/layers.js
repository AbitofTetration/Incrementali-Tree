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
                fillStyle: {'background-color' : "#379911"},
                baseStyle: {'background-color' : "#333333"},
                textStyle: {'color': '#04e050'},

                borderStyle() {return {}},
                direction: RIGHT,
                width: 400,
                height: 40,
                goal() {
                    return Decimal.pow(5, player[this.layer].goals[0].pow(1.25).add(1))
                },
                progress() {
                  if (player.points.add(1).log(10).div(this.goal().log10()).gt(1)) {
                    player[this.layer].goals[0] = player[this.layer].goals[0].add(1)
                    player[this.layer].points = player[this.layer].points.add(1)
                  }
                  if (player.points.add(1).log(10).gt(6) {
                        return (player.points.add(1).log(10).div(this.goal().log10())).toNumber()
                  } else {
              
                  }
                },
                display() {
                    return "Next quark at \n"+format(player.points) + " / "+format(this.goal())+" incrementali"
                },
                unlocked: true,
            },
            singularityBar: {
                fillStyle: {'background-color' : "#888888"},
                baseStyle: {'background-color' : "#333333"},
                textStyle: {'color': '#DDDDDD'},

                borderStyle() {return {}},
                direction: RIGHT,
                width: 400,
                height: 40,
                goal() {
                    return Decimal.pow(2.5, player[this.layer].goals[1].pow(1.125).add(1))
                },
                progress() {
                    if (player.s.power.add(1).log(10).div(this.goal().log10()).gt(1)) {
                      player[this.layer].goals[1] = player[this.layer].goals[1].add(1)
                      player[this.layer].points = player[this.layer].points.add(1)
                    }
                    return (player.s.power.add(1).log(10).div(this.goal().log10())).toNumber()
                },
                display() {
                    return "Next quark at \n"+format(player.s.power) + " / "+format(this.goal())+" singularity power"
                },
                unlocked() {
                  return player.s.unlocked
                },
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
            respecText: "Respec Runes", // Text on Respec button, optional
            11: {
                title: "Increment Rune", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if (x.gte(25)) x = x.pow(2).div(25)
                    let cost = Decimal.mul(1, Decimal.pow(1.5, x))
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
            12: {
                title: "Gravity Rune", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if (x.gte(5)) x = x.pow(2).div(5)
                    let cost = Decimal.mul(1, Decimal.pow(1.5, x))
                    return cost.floor()
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = Decimal.div(x, 3).add(1).pow(5)
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " quarks\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Multiplies singularity power gain by " + format(data.effect) + "x"
                },
                unlocked() { return hasUpgrade("s", 13) }, 
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
        ["bar", "pointsBar"], ["bar", "singularityBar"]
    ],
})