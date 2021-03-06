let modInfo = {
	name: "The Incrementali Tree",
	id: "incrementalitree",
	author: "nobody",
	pointsName: "incrementali",
	discordName: "Remilia Gaming",
	discordLink: "https://discord.gg/uGNAsBKg4t",
	changelogLink: "https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md",
    offlineLimit: 10/3600,  // In hours
    initialStartPoints: new Decimal (0) // Used for hard resets and new players
}

// Set your version in num and name
let VERSION = {
	num: "0.1.1",
	name: "Religion Update",
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

function getIncrementaliEff() {
  let eff = new Decimal(2)
  if (hasUpgrade("p", 11)) eff = eff.mul(1.1)
  if (hasUpgrade("p", 12)) eff = eff.mul(1.1)
  if (hasUpgrade("p", 23)) eff = eff.mul(1.15)
  if (hasUpgrade("s", 11)) eff = eff.mul(1.02)
  if (hasUpgrade("t", 12)) eff = eff.mul(1.1)
  if (player.q.unlocked) eff = eff.mul(buyableEffect("q", 11))
  if (player.i.unlocked) eff = eff.mul(layers.i.effect().incrementBuff)
  if (player.i.unlocked) eff = eff.mul(buyableEffect("i", 11))
  if (!inChallenge("e", 12) && player.sh.unlocked) eff = eff.mul(buyableEffect("sh", 32))
  if (inChallenge("e", 11)) eff = eff.div(25)
  return eff
}

function getIncrementaliSelfBoost() {
  let boost = player.points.add(3).log10().add(1).pow(getIncrementaliEff()).sub(1)
  if (boost.gt(1e6)) boost = boost.sqrt().mul(1e3)
  return boost
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0.01)
  gain = gain.mul(getIncrementaliSelfBoost())
  if (hasUpgrade("p", 13)) gain = gain.mul(2)
  if (hasUpgrade("p", 21)) gain = gain.mul(upgradeEffect("p", 21))
  if (hasUpgrade("p", 22)) gain = gain.mul(3)
  if (hasUpgrade("p", 32)) gain = gain.mul(4)
  if (hasUpgrade("t", 11)) gain = gain.mul(upgradeEffect("t", 11))
  if (player.s.unlocked) gain = gain.mul(layers.s.singularityPowerBoost())
  if (player.i.unlocked) gain = gain.mul(layers.i.effect().incrementMult)
  //if (player.c.unlocked) gain = gain.mul(buyableEffect("c", 11))
  if (!inChallenge("e", 12) && player.sh.unlocked) gain = gain.mul(buyableEffect("sh", 22))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
  function() {return `Incrementali self-boost is ${format(getIncrementaliSelfBoost())}x`},
  function() {return `Self-boost base formula is log10(incrementali+3)^${format(getIncrementaliEff())}`}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600000) // Default is 1 hour which is just arbitrarily large
}