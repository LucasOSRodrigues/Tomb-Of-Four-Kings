function estatistics(state) {
  let totalFortune =
    (collectedGold + collectedKing * 10 + (hasScroll ? 6 : 0)) * 100
  switch (state) {
    case "Dead":
      return `Rooms visited: ${turn}.
    Crowns Left Behind: ${collectedKing}.
    gold left behind: ${collectedGold}.
    Total fortune left hebind: ${totalFortune} coins.
    Skills collected: ${TotalSkills}${orderSkills(collectedSkills)}.
    Torches burnt: ${torchCounter}.`
    case "Alive":
      return `Rooms visited: ${turn}.
        Crowns collected: ${collectedKing}.
        gold collected: ${collectedGold}.
        Total fortune collected: ${totalFortune} coins.
        Skills collected: ${TotalSkills}${orderSkills(collectedSkills)}.
        Torches burnt: ${torchCounter}.
        score: ${collectedKing}/${totalFortune / 100}.`
    case "Stuck":
      return `Rooms visited: All of them.
        Crowns remained: ${collectedKing}.
        gold remained: ${collectedGold}.
        Total fortune remained: ${totalFortune} coins.
        Skills collected: ${TotalSkills}${orderSkills(collectedSkills)}.
        Torches burnt: ${torchCounter}.`
    case "Lost":
      return `Rooms visited: ${turn}.
        Crowns lost: ${collectedKing}.
        gold lost: ${collectedGold}.
        Total fortune lost: ${totalFortune} coins.
        Skills collected: ${TotalSkills}${orderSkills(collectedSkills)}.
        Torches burnt: All of them.`
  }
}

function dialog(state) {
  let dialog = ""
  let totalFortune =
    (collectedGold + collectedKing * 10 + (hasScroll ? 6 : 0)) * 100
  switch (state) {
    case "Alive":
      if (collectedKing === 4) {
        dialog +=
          "You became a Legend, a Hero. The One Who Brought The Four Crowns."
        dialog += " Congratulations!"
      } else if (turn >= 15) {
        dialog += `You fought like a real warrior.`
        dialog +=
          totalFortune > 5000
            ? "Even the emperor envy your crowns!"
            : "Everyone will hear your name!"
      } else if (turn > 11) {
        dialog += `Few adventures did that like you did,`
        dialog +=
          totalFortune > 3500
            ? "even fewer got so many treasures!"
            : "all your family is proud of you!"
      } else if (turn >= 7) {
        dialog += `You went further than most adventurers`
        dialog +=
          totalFortune > 4000 ? "... And richer as well." : ". Congratulations."
      } else {
        dialog += `Not so deep, just like most adventurers.`
        dialog +=
          totalFortune > 3000
            ? "But you've got some coins in it."
            : "Perhaps you'll try again some day..."
      }
      break
    case "Dead":
      if (collectedKing > 3) {
        dialog += "Imagine if you could escape with all those crowns..."
      } else if (turn === retreatTurn * 2 - 1) {
        dialog +=
          "The last thing you saw was the exit light, and then... only blood."
      } else if (usedPotion) {
        dialog += "That health potion really gave you hope..."
      } else if (turn < 7) {
        dialog += "And you didn't even went that far..."
      } else {
        dialog += `You crawl in your own blood, until you can no longer.`
      }
      break
    case "Stuck":
      if (collectedKing > 3) {
        dialog +=
          "You behold all those crowns... while slowly driving into madness."
      } else if (retreatTurn && turn >= retreatTurn * 2 - 4) {
        dialog += `The way out... so close...`
      } else if (!retreatTurn) {
        dialog += Math.round(Math.random())
          ? "You should've retreated earlier."
          : "Were you trying to find another exit?"
      } else if (retreatTurn && turn === retreatTurn * 2 - 1) {
        dialog +=
          "You regonize the tomb's main door, slowly locking you inside..."
      } else {
        dialog += `The only way out... locked... Forever.`
      }
      break
    case "Lost":
      if (collectedKing > 3) {
        dialog += Math.round(Math.random())
          ? "The last thing you see is those shiny crowns... all drowning in darkness with you."
          : "All that effort, vainly..."
      }
      if (turn === retreatTurn * 2 - 1) {
        dialog += "how unfortunate. I can even feel your pain."
      } else if (usedScroll) {
        dialog += "Even after burning the scroll of light..."
      } else {
        dialog += "The fire slowly extinguishes... Forever."
      }
      break
  }
  return dialog
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
