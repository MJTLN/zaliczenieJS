//Przepraszam za bałagan 

let clientId = "ed0421edb85f40e0a71d2bca6bb67e57";
let clientSecret = "4904fad0918442dc82e02f631170d32f";

// Spotify Api: Autoryzacja, Pobranie tokenow

const authorizeUrl = "https://accounts.spotify.com/authorize"
const tokenUrl = "https://accounts.spotify.com/api/token"
const searchUrl = "https://api.spotify.com/v1/search"
const redirectUri = "http://127.0.0.1:5500/index.html"
const artistAlbumsUrl = "https://api.spotify.com/v1/artists/"
const albumByIdUrl = "https://api.spotify.com/v1/albums/"
const saveToDatabaseUrl = "http://127.0.0.1:8080/api/post"
const getAllUrl = "http://127.0.0.1:8080/api/getAll"
const deleteUrl =  "http://127.0.0.1:8080/api/delete"

let foundArtistsArr = [];
let foundAlbumsArr = [];
let collection = [];

//Funkcja uywana przy zapytaniach GET
function callGetApi(url,handler) {
    let request = new XMLHttpRequest();
    request.open("GET",url,true)
    request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem("access_token"))
    request.send()
    request.onload = handler;
}

//Najpierw Po naciśnięciu przycisku dokonywana jest wstępna autoryzacja.
// Api przekierowuje z powrotem na adres naszej aplikacji, w przekierwoaniu zawiera kod autoryzacji

function requestAuth() {
    let url = authorizeUrl;
    url += "?client_id=" + clientId;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirectUri);
    url += "&show_dialog=true";
    sessionStorage.setItem("wasAuthorized","true")
    window.location.href = url;
}

//Po przekierowaniu zczytujemy kod autoryzajci.Następnie za jego pomocą pobierane i zapisywane są access i refresh tokeny. 

function onPageLoad() {
    if ( window.location.search.length > 0) {
        handleRedirct()
    }
}

function handleRedirct() {
    let code = parseAuthorizationCode();
    fetchAccessToken(code);
    window.history.pushState("","",redirectUri)
}

function parseAuthorizationCode() {
    let code = null;
    const queryString = window.location.search;
    if( queryString.length > 0 ) {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;
}

function fetchAccessToken(code) {
    let body = "grant_type=authorization_code"
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirectUri);
    body += "&client_id=" + clientId;
    body += "&client_secret=" + clientSecret;
    callAuthorizationApi(body);
}

function callAuthorizationApi(body) {
    let request = new XMLHttpRequest();
    request.open("POST", tokenUrl, true);
    request.setRequestHeader('content-type','application/x-www-form-urlencoded');
    request.send(body)
    request.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse() {
    if( this.status == 200)  {
        let data = JSON.parse(this.responseText)
        console.log(data)
        if (data.access_token != undefined) {
            access_token = data.access_token
            sessionStorage.setItem("access_token", access_token)
        }
        if(data.refresh_token != undefined ) {
            refresh_token = data.refresh_token
            sessionStorage.setItem("refresh_token", refresh_token)
        }
        onPageLoad()
    } else {
        console.log(this.responseText)
    }
}

//Kod odpowiadający za zniknięcie przycisku od autoryzacji

const authBtn = document.getElementById("authorizeBtn")

if(sessionStorage.getItem("wasAuthorized") === null) {
    authBtn.classList.remove("hidden")
} else {
    authBtn.classList.add("hidden")
}

authBtn.addEventListener('click',requestAuth)

//niedokoczone:

function refreshAccessToken() {
    const refresh_token = sessionStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token" + refresh_token;
    body += "&client_id=" + clientId;
    callAuthorizationApi(body);
}

//Przycisk Search

const searchInput = document.getElementById("search");

function SearchHandler() {
    let inputedString = searchInput.value;
    callSearchApi(inputedString)
}

document.getElementById("searchbtn").addEventListener("click",SearchHandler);

//Wyszukiwanie Albumu
function callSearchApi(inputedString) {
    let url = searchUrl + "?q=" + inputedString +"&type=" + "artist"
    callGetApi(url,handleSearchResponse)
}

function handleSearchResponse() {
    let data = JSON.parse(this.responseText)
    console.log(data)
    if( this.status == 200)  {
        foundArtistsArr = data.artists.items;
        displayArtists(foundArtistsArr)
    } else if( this.status == 401) {
        refreshAccessToken()
    }
}

//Przycisk Zobacz wydawnictwa

function seeAlbums(event) {
    const artistId =  event.target.id
    callAlbumsApi(artistId)
}

//Wyszukiwanie Albumu wybranego artysty

function callAlbumsApi(artistId) {
    let url = artistAlbumsUrl + artistId + "/albums"
    callGetApi(url,handleAlbumsResponse)
}

function handleAlbumsResponse() {
    let data = JSON.parse(this.responseText);
    console.log(data);
    if(this.status == 200) {
        foundAlbumsArr = data.items;
    }
    displayAlbums(albumsTbdody);
}

//Dodawanie do bazy danych

function addToColection(event) {
    let url = albumByIdUrl + event.target.id;
    callGetApi(url,addToCollectioResponseHandler);
}

function addToCollectioResponseHandler() {
    let data = JSON.parse(this.responseText);
    let albumDto = {
        id : data.id,
        name : data.name,
        artist : data.artists[0].name,
        img : data.images[0].url,
        type : data.type,
        release : data.release_date
    };
    console.log(albumDto)
    save(albumDto);
}


function saveToDatabaseResponseHandler() {
    console.log(this.status)
}

function save(album) {
    let body = JSON.stringify(album);
    console.log(body)
    let request = new XMLHttpRequest()
    request.open("POST",saveToDatabaseUrl,true)
    request.setRequestHeader("Content-Type","application/json")
    request.send(body)
    request.onload = function() {
        console.log(this.response)
    }
}

//Pobranie danych z bazy i wyświetlenie w tabeli
kolekcjaBtn.addEventListener("click", (e) => {
    callGetApi(getAllUrl,getAllHandler)
})

function getAllHandler() {
    collection = JSON.parse(this.responseText)
    displayCollection(collection)
}

//Wyświetlanie Kolekcji

function createCollectionElementTr(album) {
    let collectionTr = document.createElement("tr");
    collectionTr.classList.add("bg-white","border-b","dark:bg-gray-800","dark:border-gray-700","hover:bg-gray-50","dark:hover:bg-gray-600");

    let imgTd = document.createElement("td");
    imgTd.classList.add("w-4","p-4");

    let imgDiv = document.createElement("div");
    imgDiv.classList.add("ax-h-28","max-w-xs");

    let img = document.createElement("img");
    img.classList.add("max-h-28","max-w-xs");
    img.setAttribute("src",album.img);

    imgDiv.appendChild(img);
    imgTd.appendChild(imgDiv);

    let th = document.createElement("th");
    th.setAttribute("scope","row");
    th.classList.add("px-6", "py-4", "font-medium", "text-gray-900", "whitespace-nowrap", "dark:text-white")
    th.innerText=album.name;

    let artistTd = document.createElement("td");
    artistTd.classList.add("px-6","py-4");
    artistTd.innerText = album.artist;

    let typeTd = document.createElement("td");
    typeTd.classList.add("px-6","py-4");
    typeTd.innerText = album.type;
    
    let releaseTd = document.createElement("td");
    releaseTd.classList.add("px-6","py-4");
    releaseTd.innerText = album.release;
    
    let actionTd = document.createElement("td");
    actionTd.classList.add("px-6","py-4");
    
    let a1 = document.createElement("a");
    a1.classList.add("font-medium","text-blue-600","dark:text-blue-500","hover:underline")
    a1.innerText = "Usuń "
    a1.id = album.id;

    let br = document.createElement("br");
    let a2 = document.createElement("a");
    a2.classList.add("font-medium","text-blue-600","dark:text-blue-500","hover:underline")
    a2.innerText = "Dodaj do listy"

    let actionDiv = document.createElement("div")

    actionDiv.appendChild(a1)
    actionDiv.appendChild(br)
    actionDiv.appendChild(a2)

    actionTd.appendChild(actionDiv)
    
    collectionTr.appendChild(imgTd)
    collectionTr.appendChild(th)
    collectionTr.appendChild(artistTd)
    collectionTr.appendChild(typeTd)
    collectionTr.appendChild(releaseTd)
    collectionTr.appendChild(actionTd)

    a1.addEventListener("click",(e) =>{
        deleteFromCollection(e)
    })

    return collectionTr

}

const collectionTbody = document.getElementById("collectionTbody");

function displayCollection(collection) {
    clearTable(collectionTbody)
    collection.forEach(album => {
        let tr = createCollectionElementTr(album);
        collectionTbody.appendChild(tr);
    });
}

//Usuwanie albumu
function deleteFromCollection(event) {
    console.log(event.target.id)
    let request = new XMLHttpRequest();
    request.open("DELETE",deleteUrl + "/" + event.target.id ,true)
    request.send()
    request.onload = () => {
        callGetApi(getAllUrl,getAllHandler);
        displayCollection(collection)
    }
}

//Alfabetycznie
const alfabetycznie = document.getElementById("alfabet");

alfabetycznie.addEventListener("click", (e) => {
    clearTable(collectionTbody);
    collection.sort((a,b) => {
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
    });
    displayCollection(collection);
})

//Najnowsze
const najnowsze = document.getElementById("najnowsze");
najnowsze.addEventListener("click", (e) => {
    clearTable(collectionTbody)
    collection.sort((a,b) => {
        if(a.release > b.release) { return -1; }
        if(a.release < b.release) { return 1; }
        return 0;
    })
    displayCollection(collection)
})

//Artysta
const artysci = document.getElementById("artysta")
artysci.addEventListener("click", (e) => {
    clearTable(collectionTbody)
    collection.sort((a,b) => {
        if(a.artist < b.artist) { return -1; }
        if(a.artist > b.artist) { return 1; }
        return 0;
    })
    displayCollection(collection)
})



// Wyświetlanie wyników wyszukiwania 
const artistsTbody = document.getElementById("artistsTbody");
const artistsDiv = document.getElementById("artistsDiv");
const albumsTbdody = document.getElementById("albumsTbody");
const albumsDiv = document.getElementById("albumsDiv");


function crateArtistTr(name,genere,image,id) {
    let artistTr = document.createElement("tr");
    artistTr.classList.add("dd:bg-white","odd:dark:bg-gray-900","even:bg-gray-50","even:dark:bg-gray-800","border-b","dark:border-gray-700")

    let imgTh = document.createElement("th");
    imgTh.classList.add("px-6","py-4","font-medium","text-gray-900","whitespace-nowrap","dark:text-white");
    let img = document.createElement("img");
    img.classList.add("max-h-28","max-w-xs");
    img.setAttribute("src",image);
    imgTh.appendChild(img);

    let nameTd = document.createElement("td");
    nameTd.classList.add("px-6","py-4")
    nameTd.innerText = name;

    let genereTd = document.createElement("td");
    genereTd.classList.add("px-6","py-4");
    if(genere != undefined) genereTd.textContent = genere;
    
    let emptyTd = document.createElement("td")
    emptyTd.classList.add("px-6","py-4");

    let lastTd = document.createElement("td");
    lastTd.classList.add("px-6","py-4");
    let a = document.createElement("a");
    a.classList.add("font-medium","text-blue-600","dark:text-blue-500","hover:underline")
    a.innerText= "Zobacz wydawnictwa"
    a.id= id
    lastTd.appendChild(a)

    artistTr.appendChild(imgTh);
    artistTr.appendChild(nameTd)
    artistTr.appendChild(genereTd)
    artistTr.appendChild(emptyTd)
    artistTr.appendChild(lastTd)

    a.addEventListener("click",function(event) {
        seeAlbums(event)
    })

    return artistTr;
}

function createAlbumTr(name, realese, type, image, id){
    let artistTr = document.createElement("tr");
    artistTr.classList.add("dd:bg-white","odd:dark:bg-gray-900","even:bg-gray-50","even:dark:bg-gray-800","border-b","dark:border-gray-700")

    let imgTh = document.createElement("th");
    imgTh.classList.add("px-6","py-4","font-medium","text-gray-900","whitespace-nowrap","dark:text-white");
    let img = document.createElement("img");
    img.classList.add("max-h-28","max-w-xs");
    img.setAttribute("src",image);
    imgTh.appendChild(img);

    let nameTd = document.createElement("td");
    nameTd.classList.add("px-6","py-4")
    nameTd.innerText = name;

    let realeseTd = document.createElement("td");
    realeseTd.classList.add("px-6","py-4");
    if(realese != undefined) realeseTd.textContent = realese.split("-")[0];
    
    let typeTd = document.createElement("td")
    typeTd.classList.add("px-6","py-4");
    typeTd.textContent = type;


    let lastTd = document.createElement("td");
    lastTd.classList.add("px-6","py-4");
    let a = document.createElement("a");
    a.classList.add("font-medium","text-blue-600","dark:text-blue-500","hover:underline")
    a.innerText= "Dodaj"
    a.id= id
    lastTd.appendChild(a)

    artistTr.appendChild(imgTh);
    artistTr.appendChild(nameTd)
    artistTr.appendChild(realeseTd)
    artistTr.appendChild(typeTd)
    artistTr.appendChild(lastTd)

    a.addEventListener("click",function(event) {
        addToColection(event)
    })

    return artistTr;
}

function clearTable(tableBody) {
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild)
    }
}

function hideTable(tableDiv) {
    tableDiv.classList.add("hidden")
}

function showTable(tableDiv) {
    tableDiv.classList.remove("hidden")
}


function displayArtists(foundArtistsArr) {
    hideTable(albumsDiv)
    showTable(artistsDiv)
    clearTable(artistsTbody)
    for(i = 0; i <10; i++) {
        const artist = foundArtistsArr[i];
        const element = crateArtistTr(artist.name,artist.genres[0],artist.images[0].url,artist.id);
        artistsTbody.appendChild(element)
    }
}

function displayAlbums() {
    hideTable(artistsDiv)
    showTable(albumsDiv)
    clearTable(albumsTbdody)
    for(i = 0; i < foundAlbumsArr.length; i++) {
        const album = foundAlbumsArr[i]
        const element = createAlbumTr(album.name,album.release_date,album.album_type,album.images[0].url,album.id)
        albumsTbdody.appendChild(element)
    }
}


