var cards = document.getElementsByClassName('cards-container')
var arts = []
obtenerTodosLosArticulos()

async function obtenerTodosLosArticulos() {
    try {
        const response = await axios.get('/api/page/1')
        const datos = response.data
        arts = datos.registros
        addCards(arts)
    } catch (error) {
        //console.error(error)
    }
}

var user = JSON.parse(localStorage.getItem("user")) || []

let iconAZ = document.getElementById("a-z")
let iconZA = document.getElementById("z-a")
let icon19 = document.getElementById("menor-mayor")
let icon91 = document.getElementById("mayor-menor")

var artSearchFilter = [] //Array donde se gurdan los articulos del termino de busqueda




//Llamo a la funcion para renderizar todos los articulos Arts ordenados de A-Z
artSearchFilter = arts
addCards(orderBy(artSearchFilter, "Descripción A-Z"))


//Oculto los iconos de la forma de ordenamiento 
hideIcons()



//Funcion para cargar segun criterio de busqueda.
let searchButton = document.getElementById("search-button")
searchButton.addEventListener("click", async (evt) => {
    //recargo los articulos del LocalStorage
    let response = await axios.get('/api/page/1')
    arts = response.data.registros

    artSearchFilter.splice(0) //elimino todos los elementos del array
    let searchInput = document.getElementById("search-input").value.toLowerCase()
    let cardContainer = document.getElementById("cards-container")
    cardContainer.innerHTML = "" //Elimino los artiulos en la vista
    searchTerm = searchInput
    arts.forEach((art) => {
        if (art.title.toLowerCase().includes(searchInput)) {
            artSearchFilter.push(art)
        }
    })

    let counter = document.getElementById("count-result")
    counter.innerHTML = `Se encontraron ${artSearchFilter.length} resultados`
    let title = document.getElementById("search-title")
    title.value = searchInput

    addCards(artSearchFilter)
})


let selectOrder = document.getElementById("order-by")
selectOrder.addEventListener("change", (evt) => {
    addCards(orderBy(arts, selectOrder.value))
})





//Funcion que agrega o elimina el articulo de la lista de deseos
function addDelWish(idArt) {
    user = JSON.parse(localStorage.getItem("user")) || []
    if (user.length !== 0) {
        let searchWish = user.wish.includes(idArt) //Busco si el articulo ya esta en la lista

        if (searchWish) {                 //si esta lo elimino
            let index = user.wish.indexOf(idArt)
            user.wish.splice(index, 1)
            showAlert("FAVORIO ELIMINADO !", "Se elimino el articulo de tus favoritos")
        } else {
            user.wish.push(idArt)       //si no esta lo agrego
            showAlert("NUEVO FAVORIO !", "Se agrego el articulo a tu lista defavoritos")
        }

        //actualizo las clases del DOM para pintar los corazones
        let h = document.getElementById(`heart_${idArt}`)
        if (h.classList.contains("card__heartWishOn")) {
            h.classList.remove("card__heartWishOn")
        } else {
            h.classList.add("card__heartWishOn")
        }


        localStorage.setItem("user", JSON.stringify(user))
        document.getElementById("title" + idArt)
        renderUserMenu()

    } else {
        showAlert("Crea una cuenta e inicia sesion", "para poder armar tu lista de deseos", "err")
    }

}










