var row = document.getElementsByClassName('row-cart-detail')
var user = JSON.parse(localStorage.getItem("user")) || []
var total = 0


findCart()

//Obtengo el carrito del usuario de la base de datos
async function findCart() {
    user = JSON.parse(localStorage.getItem("user")) || []

    const art = await callApiPrivate(`/api/cart`,"post", user.cart)
    

    console.log(art)
    addCardCart(art.Arts)
    //regenero el carrito en caso de que no haya un id valido en el localstorage lo omito
    let userData = JSON.parse(localStorage.getItem('user'))
    userData.cart = art.Arts
    localStorage.setItem("user", JSON.stringify(userData))

    renderUserMenu()
}

//guardo el carrito en la base de datos, para poder verlo de cualquier dispositivo
async function saveCart() {
    user = JSON.parse(localStorage.getItem("user"))||null
    if(user){art = await callApiPrivate(`/api/save-cart`,"post", user.cart)}
}

//Funcion que dibuja las card en el DOM, parametro Array de todos los Articulos 
function addCardCart(arts) {

    const lista = document.getElementById('row-cart-detail')
    lista.innerHTML = ""

    total = 0
    const divCartDetail = document.getElementById('row-cart-detail')


    arts.forEach(art => {

        const divRow = document.createElement('div')
        divRow.className = 'row'

        const divPic = document.createElement('div')
        divPic.className = 'row__pic'

        const trashIcon = document.createElement('i')
        trashIcon.className = 'fa-solid fa-trash'
        trashIcon.id = 'deleteart'
        trashIcon.setAttribute('onclick', `delArtCart('${art._id}')`)

        const img = document.createElement('img')
        img.src = `assets/img/store/${art.img}`

        const divDesc = document.createElement('div')
        divDesc.className = 'row__description'
        divDesc.innerHTML = art.title

        const quantityContainer = document.createElement('div')
        quantityContainer.classList.add('quantity-container')

        const delContainer = document.createElement('div')
        delContainer.classList.add('cart-containter__del')
        delContainer.setAttribute('onclick', `resCart('${art._id}')`)

        const delIcon = document.createElement('i')
        delIcon.classList.add('fa-solid', 'fa-minus')
        delContainer.appendChild(delIcon)

        quantityContainer.appendChild(delContainer)

        const quantityInput = document.createElement('input')
        quantityInput.classList.add('cart-containter__qnty')
        quantityInput.setAttribute('id', `id-${art._id}`)
        quantityInput.setAttribute('value', art.quantity)
        quantityInput.setAttribute('readonly', true)
        quantityInput.setAttribute('min', '1')
        quantityInput.setAttribute('max', '100')
        quantityInput.setAttribute('type', 'number')
        quantityInput.setAttribute('name', 'quantity')

        quantityContainer.appendChild(quantityInput)

        const addContainer = document.createElement('div')
        addContainer.classList.add('cart-containter__add')
        addContainer.setAttribute('onclick', `sumCart('${art._id}')`)

        const addIcon = document.createElement('i')
        addIcon.classList.add('fa-solid', 'fa-plus')
        addContainer.appendChild(addIcon)

        quantityContainer.appendChild(addContainer)

        const divPartialAmount = document.createElement('div')
        divPartialAmount.className = 'row__partial-amount'
        divPartialAmount.innerHTML = formatCurrency(art.quantity * art.price)

        total += (art.quantity * art.price)

        divPic.appendChild(trashIcon)
        divPic.appendChild(img)
        divRow.appendChild(divPic)
        divRow.appendChild(divDesc)
        divRow.appendChild(quantityContainer)
        divRow.appendChild(divPartialAmount)
        divCartDetail.appendChild(divRow)


    })

    //ROW TOTAL
    const divRowTot = document.createElement('div')
    divRowTot.className = 'total-row'

    const divTitle = document.createElement('div')
    divTitle.className = 'total-row__title'
    divTitle.innerHTML = `TOTAL: ${formatCurrency(total)}`

    divRowTot.appendChild(divTitle)
    divCartDetail.appendChild(divRowTot)


    var button = document.createElement('button')
    button.id = 'save-cart'
    button.className = 'button__ok save-cart__button'

    var icon = document.createElement('i')
    icon.className = 'fas fa-shopping-cart'

    button.appendChild(icon)
    button.onclick = saveCart
    button.textContent = 'Guardar Carrito'

    const divSaveCart = document.createElement('div')
    divSaveCart.className = 'total-row'
    divSaveCart.appendChild(button)

    divRowTot.appendChild(divSaveCart)

    if (arts == 0) {

        const title = document.getElementById('title-h1')
        title.innerHTML = 'TU CARRITO ESTA VACIO'
        const saveCart = document.getElementById('save-cart')
        saveCart.style.display = 'none'

        const orderButton = document.getElementById("order-buy")
        orderButton.style.display = "none"
    } else {
        const orderButton = document.getElementById("order-buy")
        orderButton.style.display = "flex"
    }

}

//Funcion para eliminar un articulo del carrito
function delArtCart(id) {

    let user = JSON.parse(localStorage.getItem("user")) || []
    let cart = user.cart || []

    const index = cart.findIndex((item) => item._id === id)
    if (index !== -1) {
        cart.splice(index, 1)
        user.cart = cart
        localStorage.setItem("user", JSON.stringify(user))
    }

    addCardCart(cart)
    renderUserMenu()
}

//funcion que suma cantidad de articulos
function sumCart(id) {
    let quantityInput = document.getElementById(`id-${id}`)
    let quantity = parseInt(quantityInput.value)

    if (quantity < 99) {
        quantity = quantity + 1
    }
    quantityInput.value = quantity

    modifiCart(id, parseInt(quantity))
}

function modifiCart(id, qty) {
    user = JSON.parse(localStorage.getItem("user")) || []
    let cart = user.cart
    const find = cart.find((item) => item._id === id)

    if (find) {
        let index = cart.indexOf(cart.find(ar => ar._id === id))

        cart[index].quantity = qty
        user.cart = cart

        localStorage.setItem("user", JSON.stringify(user))
    }

    addCardCart(cart)
    renderUserMenu()
}

//funcion que resta cantaidad de articulos
function resCart(id) {

    let quantityInput = document.getElementById(`id-${id}`)
    let quantity = parseInt(quantityInput.value)

    if (quantity > 1) {
        quantity = quantity - 1
    }
    quantityInput.value = quantity
    modifiCart(id, parseInt(quantity))
}

const genOrder = document.getElementById("generate-order")
genOrder.addEventListener("click", (evt) => {
    user = JSON.parse(localStorage.getItem("user"))
    generateOrder(user.cart)
})


//funcion que genera la orden, y limpia el carrito del usuario
async function generateOrder(orderDetail) {
    user = JSON.parse(localStorage.getItem("user"))

    try {
        data = await callApiPrivate(`/api/generate-order/${user._id}`,"post", orderDetail)

        console.log(data)
    } catch (error) {
        console.log(error)
    }


    user.cart = []
    localStorage.setItem("user", JSON.stringify(user))
    addCardCart(user.cart)
    renderUserMenu()
    showAlert("Orden Creada", "Puedes segirla desde tu panel de usuario.", "sus")
}



