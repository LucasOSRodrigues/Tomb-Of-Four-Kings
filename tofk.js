//* HTML content.
const TORCHES = document.querySelector(".torches")
const DECK = document.querySelector(".deck")
const ROOMS_LEFT = document.querySelector("#roomsLeft")
const DELVE = document.querySelector(".delve")
const RETREAT = document.querySelector(".retreat")
const HAND = document.querySelector(".hand")
const HP = document.querySelector(".HP")

let hp = 9
let lane = DELVE
let turn = 0
let retreatTurn
drawHP()
createGhost()

//? Gerador de baralho.
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

function dealCards() {
  let shiftedCard = deck.shift()
  const card = document.createElement("div")
  const plusDiv = document.createElement("div")
  card.className = "card front"
  card.innerHTML = handleSVG(shiftedCard)
  card.append(plusDiv)
  lane.append(card)
}

function delveDungeon() {
  turn++
  deleteGhost()
  flipLastCard()
  dealCards()
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
  dealCards()

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
