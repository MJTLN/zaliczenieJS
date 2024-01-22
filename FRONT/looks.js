// Skrypt odpowiadający za działanie interfejsu

//  Wiem, że dodawanie tylu klas zamiast zrobic klasy np.’button-clicked' 'button-unclicked' wyglada
// nieczytelnie natomiast chciałem ograniczyć pisanie css do minimum więc uywam klas z tailwinda


//Elementy

const searchBtn = document.getElementById("searchBtn")
const kolekcjaBtn = document.getElementById("kolekcjaBtn")
const listyBtn = document.getElementById("listyBtn")
const aboutBtn = document.getElementById("aboutBtn")

const searchPanel = document.getElementById("searchPanel")
const collectionPanel = document.getElementById("collectionPanel")

//Funkcje

function buttonUnclicked(button) {
    button.classList.remove("bg-gray-900","text-white","rounded-md","px-3","py-2","text-sm","font-medium")
    button.classList.add("text-gray-300","hover:bg-gray-700","hover:text-white","rounded-md", "px-3","py-2","text-sm","font-medium")
}

function changeButtons(e) {
    buttonUnclicked(searchBtn);
    buttonUnclicked(kolekcjaBtn);
    buttonUnclicked(listyBtn)
    buttonUnclicked(aboutBtn)
    e.target.classList.add("bg-gray-900","text-white","rounded-md","px-3","py-2","text-sm","font-medium")
}

function hidePanel(panel) {
    panel.classList.add("hidden")
}

function showPanel(panel) {
    panel.classList.remove("hidden")
}

//Event Listenery

searchBtn.addEventListener("click",(e) => {
    changeButtons(e)
    showPanel(searchPanel)
    hidePanel(collectionPanel)
})

kolekcjaBtn.addEventListener("click",(e) => {
    changeButtons(e)
    showPanel(collectionPanel)
    hidePanel(searchPanel)
})

listyBtn.addEventListener("click",(e) => {
    changeButtons(e)
})

aboutBtn.addEventListener("click",(e) => {
    changeButtons(e)
})

