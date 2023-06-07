var user = []
var total = 0


findWish()

//Funcion que trae el carrito del usuario
async function findWish() {
    user = JSON.parse(localStorage.getItem("user"))
    art = await callApiPrivate(`/api/wish/${user._id}`,"get", user.wish)
    addCards(art.Arts)
    renderUserMenu()
}

//Funcion que dibuja las card en el DOM, parametro Array de Articulos
function addCards(arts) {
    //user = JSON.parse(localStorage.getItem("user")) || []
    const lista = document.getElementById('cards-container')
    lista.innerHTML = ""

    if (arts == 0) {
        const title = document.getElementById('title-h1')
        title.innerHTML = 'TUS FAVORITOS ESTA VACIO'
    }
    arts.forEach(art => {
        
        const articleCard = document.createElement("article")
        articleCard.classList.add("card")

        const headerDiv = document.createElement("div")
        headerDiv.classList.add("card__header")

        const heartDiv = document.createElement("div")

        heartDiv.classList.add("card__heart")
        heartDiv.setAttribute("id", `heart_${art._id}`)


        heartDiv.classList.add("card__heartWishOn")

        const heartIcon = document.createElement("i")
        heartIcon.classList.add("fa-solid", "fa-heart")
        heartIcon.setAttribute("onclick", `addDelWish('${art._id}')`)

        heartDiv.appendChild(heartIcon)
        headerDiv.appendChild(heartDiv)

        const img = document.createElement("img")
        img.src = `/assets/img/store/${art.img}`
        img.alt = `Imagen de producto ${art.title}`
        img.classList.add("card__img")

        headerDiv.appendChild(img)
        articleCard.appendChild(headerDiv)

        const bodyDiv = document.createElement("div")
        bodyDiv.classList.add("card__body")

        const titleDiv = document.createElement("div")
        titleDiv.classList.add("card__title")
        titleDiv.setAttribute("id", `title${art._id}`)
        titleDiv.textContent = art.title

        const descriptionP = document.createElement("p")
        descriptionP.classList.add("card__description")
        descriptionP.textContent = art.description

        const dateDiv = document.createElement("div")
        dateDiv.classList.add("card__date")
        dateDiv.textContent = art.date

        const priceDiv = document.createElement("div")
        priceDiv.classList.add("card__price")
        priceDiv.textContent = formatCurrency(parseFloat(art.price))

        bodyDiv.appendChild(titleDiv)
        bodyDiv.appendChild(descriptionP)
        bodyDiv.appendChild(dateDiv)
        bodyDiv.appendChild(priceDiv)

        articleCard.appendChild(bodyDiv)

        const footerDiv = document.createElement("div")
        footerDiv.classList.add("card__footer")

        const detailBtnContainer = document.createElement("div")
        detailBtnContainer.classList.add("card__btn-container")

        const detailBtn = document.createElement("a")
        detailBtn.classList.add("card__btn")
        detailBtn.setAttribute("onclick", `detailArt('${art._id}')`)

        const detailText = document.createElement("p")
        detailText.classList.add("card__btnTextDet")
        detailText.textContent = "Detalle"

        const infoIcon = document.createElement("i");
        infoIcon.classList.add("fa-solid", "fa-circle-info")

        detailBtn.appendChild(detailText)
        detailBtn.appendChild(infoIcon)
        detailBtnContainer.appendChild(detailBtn)

        const cartBtnContainer = document.createElement("div")
        cartBtnContainer.classList.add("card__btn-container")

        const cartBtn = document.createElement("a")
        cartBtn.classList.add("card__btn-cart")
        cartBtn.setAttribute("onclick", `addCart('${art._id}')`)

        const cartIcon = document.createElement("i")
        cartIcon.classList.add("fa-solid", "fa-cart-shopping")

        const cartText = document.createElement("p")
        cartText.classList.add("card__btnTextCart")

        cartText.textContent = "Agregar"

        cartBtn.appendChild(cartIcon)
        cartBtn.appendChild(cartText)
        cartBtnContainer.appendChild(cartBtn)

        footerDiv.appendChild(detailBtnContainer)
        footerDiv.appendChild(cartBtnContainer)

        articleCard.appendChild(footerDiv)

        const cardsContainer = document.getElementById("cards-container")
        cardsContainer.appendChild(articleCard)


    })
}

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
            user.wish.push(idArt)    //si no esta lo agrego
            showAlert("NUEVO FAVORIO !", "Se agrego el articulo a tu lista defavoritos")
        }
        localStorage.setItem('user', JSON.stringify(user))
        //actualizo las clases del DOM para pintar los corazones
        let h = document.getElementById(`heart_${idArt}`)
        if (h.classList.contains("card__heartWishOn")) {
            h.classList.remove("card__heartWishOn")
        } else {
            h.classList.add("card__heartWishOn")
        }
        findWish()
    }

}