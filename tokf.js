//* HTML content.
const torches = document.querySelector(".torches")
const rooms = document.querySelector(".rooms")
const delve = document.querySelector(".delve")
const retreat = document.querySelector(".retreat")
const buttons = document.querySelector(".buttons")
const hand = document.querySelector(".hand")
const HP = document.querySelector(".HP")

//* Code var's.
const deck = []
let hp = 9

//? Gerador de baralho.
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



