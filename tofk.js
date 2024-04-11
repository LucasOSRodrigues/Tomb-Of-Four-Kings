//* HTML content.
const TORCHES = document.querySelector(".torches")
const DIVINITY = document.querySelector("divinity")
const DECK = document.querySelector(".deck")
const ROOMS_LEFT = document.querySelector("#roomsLeft")
const DELVE = document.querySelector(".delve")
const RETREAT = document.querySelector(".retreat")
const HAND = document.querySelector(".hand")
const HP = document.querySelector(".HP")

let hp = 9
let lane = DELVE
let turn = 0
let retreatTurn = null
let TempTreasure = []
drawHP()
createGhost()

//* Gerador de baralho.
const deck = []
for (let index = 2; index <= 10; index++) {
  deck.push({ type: "encounter", suit: "door", value: index })
  deck.push({ type: "encounter", suit: "monster", value: index })
  deck.push({ type: "encounter", suit: "trap", value: index })
}
for (let suit of ["door", "monster", "trap", "hearts"]) {
  deck.push({ type: "treasure", suit: suit })
  deck.push({ type: "treasure", suit: "king" })
  deck.push({ type: "auto", suit: "divinity" })
  deck.push({ type: "auto", suit: "torch" })
}
deck.push({ type: "treasure", suit: "scroll" })
deck.sort(() => (Math.random() > 0.5 ? 1 : -1))
console.log(deck)

function drawHP() {
  HP.innerHTML = ""
  for (let S2 = 0; S2 < hp; S2++)
    setTimeout(() => {
      HP.innerHTML += heart
    }, S2 * 80)
}

function createGhost() {
  const GHOST = document.createElement("div")
  GHOST.className = "ghost"

  const GO_BTN = document.createElement("div")
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

function dealMainCard() {
  let shiftedCard = deck.shift()

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

      lane.append(card)

      break
    case "treasure":
      TempTreasure.push(shiftedCard)

      dealMainCard()
      break
    case "auto":
      const autoCard = document.createElement("div")
      autoCard.className = "card front"
      autoCard.innerHTML = handleSVG(shiftedCard)
      if (shiftedCard.suit === "torch") {
        TORCHES.append(autoCard)
      } else {
        DIVINITY.append(autoCard)
      }
  }
}

function addCardOn(encounterCard) {
  let shiftedCard = deck.shift()
}

function handleValue(card) {
  if (card.value) return card.value
  return handleSVG(card)
}

function delveDungeon() {
  turn++
  deleteGhost()
  flipLastCard()
  dealMainCard()
  // if (turn !== retreatTurn * 2 - 1) {
  //   createGhost()
  // }
}

function flipLastCard() {
  let lastCard = lane.lastChild
  if (lastCard) {
    lastCard.innerHTML = ""
    lastCard.className = "card back"
  }
}

function retreatDungeon() {
  retreatTurn = turn
  turn++

  showRetreatCard()
  deleteGhost()
  flipLastCard()
  lane = RETREAT
  showRetreatLane()
  dealMainCard()

  if (turn > 2) {
    if (turn !== retreatTurn * 2 - 1) {
      createGhost()
    }
  } else {
    flipLastCard()
  }
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
