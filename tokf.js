//* HTML content.
const torches = document.querySelector(".torches")
const rooms = document.querySelector(".rooms")
const roomsLeft = document.querySelector("#roomsLeft")
const delve = document.querySelector(".delve")
const retreat = document.querySelector(".retreat")
const hand = document.querySelector(".hand")
const HP = document.querySelector(".HP")

let hp = 9
drawHP()
moveGhost()

//? Gerador de baralho.
const deck = []
for (let index = 2; index <= 10; index++) {
  deck.push({ type: "encounter", suit: "door", value: index })
  deck.push({ type: "encounter", suit: "monster", value: index })
  deck.push({ type: "encounter", suit: "trap", value: index })
}
for (let suit of ["door", "monster", "trap", "hearts"]) {
  deck.push({ type: "treasure", suit: suit, value: "skill" })
  deck.push({ type: "treasure", suit: suit, value: "king" })
  deck.push({ type: "divinity", suit: suit, value: "divinity" })
  deck.push({ type: "torch", suit: suit, value: "torch" })
}
deck.push({ type: "treasure", suit: "joker", value: "scroll" })
deck.sort(() => (Math.random() > 0.5 ? 1 : -1))

function drawHP() {
  HP.innerHTML = ""
  for (let S2 = 0; S2 < hp; S2++) HP.innerHTML += heart
}
function moveGhost() {
  const ghost = document.createElement("div")
  ghost.className = "ghost"
  ghost.innerHTML = plus
  ghost.onclick = () => {}
  delve.append(ghost)
}
function del() {
  delve.removeChild(document.querySelector(".ghost"))
}
