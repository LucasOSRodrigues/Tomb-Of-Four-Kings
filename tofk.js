//* HTML content.
const TORCHES = document.querySelector(".torches")
const HAND = document.querySelector(".hand")
const DELVE = document.querySelector(".delve")
const RETREAT = document.querySelector(".retreat")
const DECK = document.querySelector(".deck")
const ROOMS_LEFT = document.querySelector("#roomsLeft")
const TREASURE = document.querySelector(".treasure")
const ACTION = document.querySelector(".action")
const HP = document.querySelector(".HP")

const uncollectedTreasure = []

ROOMS_LEFT.onclick = () => {
  for (let i = 0; i < 16; i++) {
    dealMainCard(deck.shift())
  }
}

let hp = 9
let lane = DELVE
let turn = 0
let retreatTurn = null
let unusedDivinity = 0
let torchCounter = 0
let actionHand = 0
let collectedGold = 0
drawHP()
createGhost()

//* Gerador de baralho.
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
// deck.sort(() => (Math.random() > 0.5 ? 1 : -1))
console.log(deck)

for (let cardAmount = 0; cardAmount < deck.length; cardAmount++) {
  setTimeout(() => {
    ROOMS_LEFT.innerText = cardAmount + 1
  }, (cardAmount * 1000) / deck.length)
}
function drawHP() {
  HP.innerHTML = ""
  for (let S2 = 0; S2 < hp; S2++)
    setTimeout(() => {
      HP.innerHTML += heart
    }, (S2 * 1000) / hp)
}

function createGhost() {
  const GHOST = document.createElement("div")
  GHOST.className = "ghost"

  const GO_BTN = document.createElement("div")
  GO_BTN.id = "go_btn"
  GO_BTN.onclick = delveDungeon
  GO_BTN.innerHTML = plus
  GHOST.append(GO_BTN)

  if (lane === DELVE && turn > 1) {
    const RETURN_BTN = document.createElement("div")
    RETURN_BTN.onclick = retreatDungeon
    RETURN_BTN.innerHTML = retreat
    RETURN_BTN.id = "return_btn"
    GHOST.append(RETURN_BTN)
  }
  lane.append(GHOST)
}

function deleteGhost() {
  lane.removeChild(document.querySelector(".ghost"))
}

function delveDungeon() {
  deleteGhost()
  flipLastCard()
  if (dealMainCard(deck.shift())) {
    if (turn !== retreatTurn * 2 - 1) {
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
  dealMainCard(deck.shift())
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
  }
}

function dealMainCard(shiftedCard) {
  switch (shiftedCard.type) {
    case "encounter":
      const card = document.createElement("div")
      const plusDiv = document.createElement("div")
      card.className = "card front"
      card.innerHTML = handleSVG(shiftedCard)
      plusDiv.innerHTML = plus
      card.append(plusDiv)
      card.onclick = () => addCardOn(shiftedCard)
      card.innerHTML += handleValue(shiftedCard)

      turn++
      lane.append(card)
      return false

    case "treasure":
      const treasureCard = document.createElement("div")
      treasureCard.className = "flexCard front"
      treasureCard.cardSuit = shiftedCard.suit
      treasureCard.innerHTML = handleSVG(shiftedCard)
      uncollectedTreasure.push(treasureCard)

      TREASURE.append(treasureCard)
      return true
    case "auto":
      const autoCard = document.createElement("div")
      autoCard.innerHTML = handleSVG(shiftedCard)
      if (shiftedCard.suit === "torch") {
        autoCard.className = "flexCard front"
        torchCounter++
        TORCHES.append(autoCard)
      } else {
        if (actionHand === 11) {
          unusedDivinity++
          ACTION.innerHTML = ""
        }
        autoCard.className = "card front"
        actionHand = 11
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
  if (actionHand === 11) {
    flipLastCard()
    const divinityCard = ACTION.innerHTML
    ACTION.innerHTML = ""

    setTimeout(() => {
      if (unusedDivinity) {
      }
    }, 250)
    ACTION.innerHTML = divinityCard
    if (turn !== retreatTurn * 2 - 1) createGhost()

    if (!unusedDivinity--) {
      ACTION.innerHTML = ""
      actionHand = 0
    }

    collectTreasure()
    collectGold(encounterCard)
  } else {
    if (deck[0].type === "encounter") {
      let shiftedCard = deck.shift()
      actionHand = shiftedCard.value
      const Card = document.createElement("div")
      Card.innerHTML = handleSVG(shiftedCard)
      Card.innerHTML += handleValue(shiftedCard)
      Card.className = "card front"
      ACTION.append(Card)
      handleEncounter(encounterCard, actionHand)
    } else {
      dealMainCard(deck.shift())
    }
  }
}

function handleEncounter(encounterCard, actionValue) {
  setTimeout(() => {
    if (encounterCard.value > actionValue) {
    } else {
      ACTION.innerHTML = ""
      flipLastCard()
      if (turn !== retreatTurn * 2 - 1) {
        createGhost()
      }
      collectTreasure()
      collectGold(encounterCard)
    }
  }, 900)
}

function collectGold(trapCard) {
  if (trapCard.suit === "trap") {
    if (document.querySelector("#GOLD")) {
      HAND.removeChild(document.querySelector("#GOLD"))
    }
    const coin = document.createElement("div")
    coin.id = "GOLD"
    coin.className = "flexCard front"
    collectedGold += trapCard.value
    coin.innerHTML = `${gold} ${collectedGold}`
    HAND.insertAdjacentElement("beforeend", coin)
  }
}

function collectTreasure() {
  if (TREASURE.innerHTML) {
    for (let treasure of uncollectedTreasure) {
      if (treasure.cardSuit !== "king") {
        treasure.onclick = () => {
          console.log(treasure)
        }
        HAND.append(treasure)
      }
    }
    TREASURE.innerHTML = ""
  }
}
