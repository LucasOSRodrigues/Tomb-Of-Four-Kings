const TORCHES = document.querySelector(".torches")
const HAND = document.querySelector(".hand")
const DELVE = document.querySelector(".delve")
const RETREAT = document.querySelector(".retreat")
const DECK = document.querySelector(".deck")
const ROOMS_LEFT = document.querySelector("#roomsLeft")
const TREASURE = document.querySelector(".treasure")
const ACTION = document.querySelector(".action")
const HP = document.querySelector(".HP")
const time = 800

function swap(x, y) {
  ;[deck[x], deck[y]] = [deck[y], deck[x]]
  return deck
}

let [collectedTreasure, uncollectedTreasure] = [[], []]
let lane = DELVE
let [retreatTurn, actualMainCard] = [null, null]
let [
  turn,
  unusedDivinity,
  torchCounter,
  actionHand,
  collectedGold,
  lastDamageInstance,
] = [0, 0, 0, 0, 0, 0, 0]

let hp = 9 - lastDamageInstance
let [lockAction, hasScroll, hasKey, hadLastChance] = [
  false,
  false,
  false,
  false,
]
let retreatable = true

drawHP()
createGhost()

//todo inicializar as funções de Fim de Jogo
//todo Agrupar reis se houver mais de 1

const deck = []
for (let suit of ["door", "monster", "trap", "heart"]) {
  deck.push({ type: "treasure", suit: suit })
  deck.push({ type: "treasure", suit: "king" })
  deck.push({ type: "auto", suit: "divinity" })
  deck.push({ type: "auto", suit: "torch" })
}
for (let index = 2; index <= 10; index++) {
  deck.push({ type: "encounter", suit: "door", value: index })
  deck.push({ type: "encounter", suit: "monster", value: index })
  deck.push({ type: "encounter", suit: "trap", value: index })
}
deck.push({ type: "treasure", suit: "scroll" })

let randomNum = Math.round(Math.random() * 44)
for (let scrambler = 0; scrambler < randomNum; scrambler++) {
  deck.sort(() => (Math.random() > 0.5 ? 1 : -1))
}
console.log(deck, randomNum)

for (let cardAmount = 0; cardAmount < deck.length; cardAmount++) {
  setTimeout(() => {
    ROOMS_LEFT.innerText = cardAmount + 1
  }, (cardAmount * 1000) / deck.length)
}

function drawHP() {
  for (let S2 = 0; S2 < hp; S2++)
    setTimeout(() => {
      HP.innerHTML += heart
    }, (S2 * 1000) / hp)
}

function createGhost() {
  if (turn !== retreatTurn * 2 - 1) {
    lockAction = false
    const GHOST = document.createElement("div")
    GHOST.className = "ghost"

    const GO_BTN = document.createElement("div")
    GO_BTN.id = "go_btn"
    GO_BTN.onclick = delveDungeon
    GO_BTN.innerHTML = plus
    GHOST.append(GO_BTN)

    if (lane === DELVE && turn > 1 && retreatable) {
      const RETURN_BTN = document.createElement("div")
      RETURN_BTN.onclick = retreatDungeon
      RETURN_BTN.innerHTML = retreat
      RETURN_BTN.id = "return_btn"
      GHOST.append(RETURN_BTN)
    }
    lane.append(GHOST)
  } else {
    retreatEnd()
  }
}

function deleteGhost() {
  lane.removeChild(document.querySelector(".ghost"))
}

function delveDungeon() {
  if (!lockAction) {
    lockAction = true
    deleteGhost()
    flipLastCard()
    if (dealMainCard(nextRoom())) {
      createGhost()
    }
  }
}

function retreatDungeon() {
  retreatTurn = turn

  showRetreatCard()
  deleteGhost()
  flipLastCard()
  lane = RETREAT
  showRetreatLane()

  for (; deck[0].type !== "encounter"; ) dealMainCard(nextRoom())
  dealMainCard(nextRoom())
}

function showRetreatLane() {
  RETREAT.style.height = "var(--cardHeight)"
  RETREAT.style.visibility = "visible"
}
function showRetreatCard() {
  const retreatCard = document.createElement("div")
  retreatCard.innerHTML = retreat
  retreatCard.className = "retreatCard"
  RETREAT.append(retreatCard)
}

function flipLastCard() {
  const lastCard = lane.lastChild
  if (lastCard) {
    lastCard.innerHTML = ""
    lastCard.onclick = ""
    lastCard.className = "card back"
    actualMainCard = null
    retreatable = true
  }
}

function dealMainCard(shiftedCard) {
  undrawCard()
  switch (shiftedCard.type) {
    case "encounter":
      const card = document.createElement("div")
      const plusDiv = document.createElement("div")
      card.className = "card front"
      card.cardsuit = shiftedCard.suit
      card.innerHTML = handleSVG(shiftedCard)
      plusDiv.innerHTML = plus
      card.append(plusDiv)
      card.onclick = () => addCardOn(shiftedCard)
      card.innerHTML += handleValue(shiftedCard)

      lockAction = false
      turn++
      actualMainCard = shiftedCard
      lane.append(card)

      if (actionHand === 11) {
        setTimeout(() => {
          addCardOn(shiftedCard)
        }, time)
      }
      return false

    case "treasure":
      const treasureCard = document.createElement("div")
      treasureCard.className = "flexCard front"
      treasureCard.cardsuit = shiftedCard.suit
      treasureCard.innerHTML = handleSVG(shiftedCard)
      uncollectedTreasure.push(treasureCard)

      lockAction = false
      retreatable = false
      TREASURE.append(treasureCard)
      return true
    case "auto":
      retreatable = false
      lockAction = false

      const autoCard = document.createElement("div")
      autoCard.innerHTML = handleSVG(shiftedCard)
      if (shiftedCard.suit === "torch") {
        autoCard.className = "quarterCard front"
        torchCounter++

        if (torchCounter === 4) {
          if (hasScroll) {
            setTimeout(() => {
              burnScroll()
            }, 500)
          } else {
            setTimeout(() => {
              torchesOver()
            }, 500)
          }
        }

        TORCHES.append(autoCard)
      } else {
        if (actionHand === 11) {
          unusedDivinity++
          ACTION.innerHTML = ""
        }

        autoCard.className = "card front"
        actionHand = 11

        if (actualMainCard) {
          lockAction = true
          setTimeout(() => {
            lockAction = false
            addCardOn(actualMainCard)
          }, time)
        }
        ACTION.append(autoCard)
      }
      return true
  }
}

function handleValue(card) {
  if (card.value) return card.value
  return handleSVG(card)
}

function addCardOn(encounterCard) {
  if (!lockAction) {
    lockAction = true
    if (actionHand === 11) {
      flipLastCard()
      handleDivinity(encounterCard)
    } else if (hasKey && encounterCard.suit === "door" && hadLastChance) {
      TREASURE.innerHTML = ""
      uncollectedTreasure = []
      hadLastChance = false
      let roomsLost = encounterCard.value
      for (let cardsLost = 0; cardsLost < roomsLost; cardsLost++) {
        setTimeout(() => {
          nextRoom()
          undrawCard()
        }, cardsLost * (800 / roomsLost))
      }
      flipLastCard()
      createGhost()
    } else if (deck[0].type === "encounter") {
      let shiftedCard = nextRoom()
      undrawCard()
      actionHand = shiftedCard.value
      const Card = document.createElement("div")
      Card.innerHTML = handleSVG(shiftedCard)
      Card.innerHTML += handleValue(shiftedCard)
      Card.className = "card front"
      ACTION.append(Card)
      handleEncounter(encounterCard, actionHand)
    } else {
      dealMainCard(nextRoom())
    }
  }
}

function handleDivinity(encounterCard) {
  const divinityCard = ACTION.innerHTML
  ACTION.innerHTML = ""

  if (unusedDivinity) {
    unusedDivinity--
    setTimeout(() => {
      ACTION.innerHTML = divinityCard
      lockAction = false
    }, time)
  } else {
    ACTION.innerHTML = ""
    actionHand = 0
  }

  collectTreasure()
  if (encounterCard.suit === "trap") {
    collectGold(encounterCard.value)
  }

  setTimeout(() => {
    if (turn !== retreatTurn * 2 - 1) createGhost()
  }, time * 0.75)
}

function handleEncounter(encounterCard, actionValue) {
  setTimeout(() => {
    if (encounterCard.value > actionValue) {
      ACTION.innerHTML = ""
      actionHand = 0

      if (
        encounterCard.suit === "trap" ||
        (encounterCard.suit === "door" && !hasKey)
      ) {
        uncollectedTreasure = []
        TREASURE.innerHTML = ""
      }
      if (encounterCard.suit !== "door") {
        lastDamageInstance = encounterCard.value - actionValue
        undrawHP(encounterCard, lastDamageInstance)
      }
      uptadeEncounterCard(encounterCard, actionValue)
    } else {
      ACTION.innerHTML = ""
      flipLastCard()
      createGhost()

      collectTreasure()
      if (encounterCard.suit === "trap") {
        collectGold(encounterCard.value)
      }
    }
  }, time)
}

function undrawHP(encounterCard, damage) {
  if (encounterCard.suit === "monster" || encounterCard.suit === "trap")
    for (let lostS2 = 0; lostS2 < damage; lostS2++) {
      setTimeout(() => {
        try {
          HP.firstChild.remove(HP.firstChild.lastChild)
          --hp === 0 ? lifeOver() : false
        } catch (e) {}
      }, (lostS2 * 1000) / damage)
    }
}
function uptadeEncounterCard(encounterCard, damage) {
  if (encounterCard.suit === "monster") {
    lane.removeChild(lane.lastChild)

    encounterCard.value -= damage
    const card = document.createElement("div")
    const plusDiv = document.createElement("div")
    card.className = "card front"
    card.innerHTML = handleSVG(encounterCard)
    plusDiv.innerHTML = plus
    card.append(plusDiv)
    card.onclick = () => addCardOn(encounterCard)
    card.innerHTML += handleValue(encounterCard)

    lockAction ? (lockAction = false) : false
    actualMainCard = encounterCard
    lane.append(card)
  } else if (encounterCard.suit === "trap") {
    flipLastCard()
    createGhost()
  } else {
    if (hasKey) {
      lane.removeChild(lane.lastChild)

      encounterCard.value -= damage
      const card = document.createElement("div")
      const plusDiv = document.createElement("div")
      card.className = "card front"
      card.innerHTML = handleSVG(encounterCard)
      plusDiv.innerHTML = plus
      card.append(plusDiv)
      card.onclick = () => addCardOn(encounterCard)
      card.innerHTML += handleValue(encounterCard)

      lockAction ? (lockAction = false) : false
      actualMainCard = encounterCard
      hadLastChance = true
      lane.append(card)
    }
    let roomsLost = encounterCard.value - damage
    for (let cardsLost = 0; cardsLost < roomsLost; cardsLost++) {
      setTimeout(() => {
        nextRoom()
        undrawCard()
      }, cardsLost * (800 / damage))
    }
    if (!hasKey) {
      flipLastCard()
      createGhost()
    }
  }
}

function nextRoom() {
  if (deck[0]) {
    return deck.shift()
  } else {
    cardsOver()
  }
}

function undrawCard() {
  ROOMS_LEFT.innerHTML = deck.length
}

function collectGold(value) {
  if (document.querySelector("#GOLD")) {
    HAND.removeChild(document.querySelector("#GOLD"))
  }
  const coin = document.createElement("div")
  coin.id = "GOLD"
  coin.className = "flexCard front"
  collectedGold += value
  coin.innerHTML = `${gold} ${collectedGold}`
  coin.onclick = () => {
    distractMonsters(collectedGold)
  }
  collectedGold > 0 ? HAND.insertAdjacentElement("beforeend", coin) : false
}

function collectTreasure() {
  if (TREASURE.innerHTML) {
    for (let treasure of uncollectedTreasure) {
      switch (treasure.cardsuit) {
        case "king":
          collectedKing++
          treasure.onclick = dropKing
          treasure.id = "king"
          break
        case "scroll":
          treasure.onclick = dropScroll
          treasure.id = "scroll"
          hasScroll = true
          break
        case "door":
          hasKey = true
          collectedSkills.push("Master Key")
          TotalSkills++
          treasure.onclick = useMasterKey
          treasure.id = "masterKey"
          break
        case "monster":
          collectedSkills.push("Go Berserk")
          TotalSkills++
          treasure.onclick = goBerserk
          treasure.id = "berserk"
          break
        case "trap":
          collectedSkills.push("Disarm mechanism")
          TotalSkills++
          treasure.onclick = disarmMechanism
          treasure.id = "disarm"
          break
        case "heart":
          collectedSkills.push("Health Potion")
          TotalSkills++
          treasure.onclick = usePotion
          treasure.id = "potion"
      }
      collectedTreasure.push(treasure)
    }
    uncollectedTreasure = []
    TREASURE.innerHTML = ""
    sortHand()
  }
}

function distractMonsters(goldAmount) {
  if (
    !lockAction &&
    actualMainCard?.suit === "monster" &&
    goldAmount >= actualMainCard.value
  ) {
    collectGold(-actualMainCard.value)
    flipLastCard()
    createGhost()

    uncollectedTreasure = []
    TREASURE.innerHTML = ""
  }
}

let collectedKing = 0
let TotalSkills = 0
let collectedSkills = []

function sortHand() {
  let sortedHand = []
  for (let skills of collectedTreasure) {
    if (["door", "monster", "trap", "heart"].includes(skills.cardsuit)) {
      sortedHand.push(skills)
    }
  }
  for (let kings of collectedTreasure) {
    if (kings.cardsuit === "king") {
      sortedHand.push(kings)
    }
  }
  for (let scroll of collectedTreasure) {
    if (scroll.cardsuit === "scroll") {
      sortedHand.push(scroll)
    }
  }

  for (let treasure of sortedHand) {
    HAND.append(treasure)
  }
  collectGold(0)
}

function lifeOver() {
  let body = document.querySelector("body")
  if (body.firstChild?.firstChild) {
    body.firstChild.firstChild.remove()
  } else if (body.firstChild) {
    body.firstChild.remove()
  }
  if (body.innerHTML === "") {
    let title = document.createElement("h1")
    let text = document.createElement("div")
    body.className = "box"
    text.className = "finalTxt"
    title.innerText = "You crawl in your own blood, until you can no longer."
    title.className = "title"
    body.append(title)
    text.innerText += `${estatistics("Dead")}`

    body.append(text)
    return "Dead"
  }
  setTimeout(() => {
    return lifeOver()
  }, 50)
}
function retreatEnd() {
  let body = document.querySelector("body")
  if (body.firstChild?.firstChild) {
    body.firstChild.firstChild.remove()
  } else if (body.firstChild) {
    body.firstChild.remove()
  }
  if (body.innerHTML === "") {
    let title = document.createElement("h1")
    let text = document.createElement("div")
    body.className = "box"
    text.className = "finalTxt"
    title.innerText =
      turn >= 15
        ? `You fought like a real warrior.
         Congratulations, everyone will hear you name!`
        : turn >= 9
        ?`You survived the tomb, not everyone does.
         Congratulations.`
        : `Not so deep, just like most adventurers.
         At least you're alive.`
    title.className = "title"
    body.append(title)
    text.innerText += `${estatistics("Alive")}`

    body.append(text)
    return "Alive"
  }
  setTimeout(() => {
    return retreatEnd()
  }, 50)
}
function cardsOver() {
  let body = document.querySelector("body")
  if (body.firstChild?.firstChild) {
    body.firstChild.firstChild.remove()
  } else if (body.firstChild) {
    body.firstChild.remove()
  }
  if (body.innerHTML === "") {
    let title = document.createElement("h1")
    let text = document.createElement("div")
    body.className = "box"
    text.className = "finalTxt"
    title.innerText = "The only way out... locked... Forever."
    title.className = "title"
    body.append(title)
    text.innerText += `${estatistics("Stuck")}`

    body.append(text)
    return "Stuck"
  }
  setTimeout(() => {
    return cardsOver()
  }, 50)
}
function torchesOver() {
  let body = document.querySelector("body")

  if (body.firstChild?.firstChild) {
    body.firstChild.firstChild.remove()
  } else if (body.firstChild) {
    body.firstChild.remove()
  }
  if (body.innerHTML === "") {
    let title = document.createElement("h1")
    let text = document.createElement("div")
    body.className = "box"
    text.className = "finalTxt"
    title.innerText = "The fire slowly extinguishes... Forever"
    title.className = "title"
    body.append(title)
    text.innerText += `${estatistics("Lost")}`

    body.append(text)
    return "Lost"
  }
  setTimeout(() => {
    return torchesOver()
  }, 50)
}

function dropKing() {
  if (!lockAction && actualMainCard?.suit === "monster") {
    flipLastCard()
    createGhost()

    HAND.removeChild(document.querySelector("#king"))
    uncollectedTreasure = []
    TREASURE.innerHTML = ""
  }
}

function dropScroll() {
  if (
    !lockAction &&
    actualMainCard?.suit === "monster" &&
    6 >= actualMainCard.value
  ) {
    hasScroll = false
    flipLastCard()
    createGhost()

    HAND.removeChild(Document.querySelector("#scroll"))
    uncollectedTreasure = []
    TREASURE.innerHTML = ""
  }
}

function useMasterKey() {
  if (!lockAction && actualMainCard?.suit === "door") {
    collectTreasure()
    flipLastCard()
    createGhost()
    hasKey = false
    HAND.removeChild(document.querySelector("#masterKey"))
  }
}
function goBerserk() {
  if (!lockAction && actualMainCard?.suit === "monster") {
    collectTreasure()
    flipLastCard()
    createGhost()
    HAND.removeChild(document.querySelector("#berserk"))
  }
}
function usePotion() {
  if (!lockAction && lastDamageInstance) {
    let lastHp = hp
    hp = lastDamageInstance
    drawHP()
    hp = lastHp + lastDamageInstance
    HAND.removeChild(document.querySelector("#potion"))
  }
}
function disarmMechanism() {
  if (!lockAction && actualMainCard?.suit === "trap") {
    collectGold(actualMainCard.value)
    collectTreasure()
    flipLastCard()
    createGhost()
    HAND.removeChild(document.querySelector("disarm"))
  }
}

function burnScroll() {
  TORCHES.removeChild(TREASURE.lastChild)
  TREASURE.removeChild(document.querySelector("#scroll"))
  torchCounter--
  deck.push({ type: "auto", suit: "torch" })
}

function estatistics(state) {
  switch (state) {
    case "Dead":
      return `Rooms visited: ${turn}.
  Kings Left Behind: ${collectedKing}.
  gold left behind: ${collectedGold}.
  Total fortune left hebind: ${
    (collectedGold + collectedKing * 10 + hasScroll ? 6 : 0) * 100
  } coins.
  Skills collected: ${TotalSkills}.
  Torches burnt: ${torchCounter}.`
    case "Alive":
      return `Rooms visited: ${turn}.
      Kings collected: ${collectedKing}.
      gold collected: ${collectedGold}.
      Total fortune collected: ${
        (collectedGold + collectedKing * 10 + hasScroll ? 6 : 0) * 100
      } coins.
      Skills collected: ${TotalSkills}.
      Torches burnt: ${torchCounter}.`
    case "Stuck":
      return `Rooms visited: All of them.
      Kings remained: ${collectedKing}.
      gold remained: ${collectedGold}.
      Total fortune remained: ${
        (collectedGold + (collectedKing * 10) + hasScroll ? 6 : 0) * 100
      } coins.
      Skills collected: ${TotalSkills}.
      Torches burnt: ${torchCounter}.`
    case "Lost":
      return `Rooms visited: ${turn}.
      Kings lost: ${collectedKing}.
      gold lost: ${collectedGold}.
      Total fortune lost: ${
        (collectedGold + collectedKing * 10 + hasScroll ? 6 : 0) * 100
      } coins.
      Skills collected: ${TotalSkills}.
      Torches burnt: ${torchCounter}.`
  }
}
