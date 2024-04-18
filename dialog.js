let totalFortune = (collectedGold + collectedKing * 10 + (hasScroll ? 6 : 0)) * 100)

function estatistics(state) {
  switch (state) {
    case "Dead":
      return `Rooms visited: ${turn}.
    Kings Left Behind: ${collectedKing}.
    gold left behind: ${collectedGold}.
    Total fortune left hebind: ${totalFortune} coins.
    Skills collected: ${TotalSkills}${orderSkills(collectedSkills)}.
    Torches burnt: ${torchCounter}.`
    case "Alive":
      return `Rooms visited: ${turn}.
        Kings collected: ${collectedKing}.
        gold collected: ${collectedGold}.
        Total fortune collected: ${totalFortune} coins.
        Skills collected: ${TotalSkills}${orderSkills(collectedSkills)}.
        Torches burnt: ${torchCounter}.
        score: ${collectedKing}/${
        collectedKing * 10 + collectedGold + (hasScroll ? 6 : 0)
      }`
    case "Stuck":
      return `Rooms visited: All of them.
        Kings remained: ${collectedKing}.
        gold remained: ${collectedGold}.
        Total fortune remained: ${totalFortune} coins.
        Skills collected: ${TotalSkills}${orderSkills(collectedSkills)}.
        Torches burnt: ${torchCounter}.`
    case "Lost":
      return `Rooms visited: ${turn}.
        Kings lost: ${collectedKing}.
        gold lost: ${collectedGold}.
        Total fortune lost: ${totalFortune} coins.
        Skills collected: ${TotalSkills}${orderSkills(collectedSkills)}.
        Torches burnt: All of them.`
  }
}

function dialog(state) {
  let dialog = ""
  switch (state) {
    case "Alive":
      if (turn >= 15) {
        dialog += `You fought like a real warrior.`
      } else if (turn > 11) {
        dialog += `Few adventures did that like you did.`
      } else if (turn >= 7) {
        dialog += `You went further than most adventurers.`
      } else {
        dialog += `Not so deep, just like most adventurers.`
      }
    case "Dead":
      dialog += `You crawl in your own blood, until you can no longer.`
    case "Stuck":
      if (retreatTurn && turn >= retreatTurn * 2 - 4) {
        dialog += `The way out... so close...
      } else if (!retreatTurn){
      dialog += Math.round(Math.random()) ? `You should've retreated earlier.` : `Were you trying to find another exit?`
      } else {
      dialog += `The only way out... locked... Forever.`
      }
    case "Lost":
      dialog += `The fire slowly extinguishes... Forever.`
  }
}

function orderSkills(skills) {
  if (skills.length) {
    let orderedSkills = ""
    let skillsLength = skills.length
    for (let skill in skills) {
      if (skill == skillsLength - 2) {
        orderedSkills += `${skills[skill]}${skillsLength > 2 ? "," : ""} and `
        continue
      }
      if (skill == skillsLength - 1) {
        orderedSkills += `${skills[skill]}`
        continue
      }
      orderedSkills += `${skills[skill]}, `
    }
    return " - " + orderedSkills
  }
  return ""
}
