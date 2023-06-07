flotantIcons()
renderUserMenu()

//funcion que agrega los botones flotantes de whatsapp y swipeUp
function flotantIcons() {

    const whatsappContainer = document.createElement('div')
    whatsappContainer.className = 'whatsapp-container'

    const whatsappLink = document.createElement('a')
    whatsappLink.className = 'whatsapp-container__link'
    whatsappLink.href = 'https://wa.me/543512531103?text=Hola%20Ranson%20and%20Wilder%20'

    const whatsappImg = document.createElement('img')
    whatsappImg.src = '/assets/img/icons/whatsapp.png'
    whatsappImg.alt = 'Whatsapp contact link'
    whatsappImg.className = 'whatsapp-container__img'

    whatsappLink.appendChild(whatsappImg)

    whatsappContainer.appendChild(whatsappLink)

    const swipeUpContainer = document.createElement('div')
    swipeUpContainer.className = 'swipe-up'

    const swipeUpLink = document.createElement('a')
    swipeUpLink.className = 'swipe-up-container__link'
    swipeUpLink.href = '#'

    const swipeUpImg = document.createElement('img')
    swipeUpImg.src = '/assets/img/icons/swipe-up.png'
    swipeUpImg.alt = 'Subir Arriba'
    swipeUpImg.className = 'swipe-up__img'

    swipeUpLink.appendChild(swipeUpImg)

    swipeUpContainer.appendChild(swipeUpLink)

    const body = document.getElementsByTagName('body')[0]

    body.appendChild(whatsappContainer)
    body.appendChild(swipeUpContainer)

}

//Creamos el menu de usuario o renderizamos el menu de register y login
function renderUserMenu() {
    let user = JSON.parse(localStorage.getItem("user"))

    if (user) {
        const userNavbar = document.getElementById("user-navbar")
        const userNavbar2 = document.getElementById("user-navbar2")

        userNavbar.innerHTML = ""

        const cartLink = document.createElement("a")
        cartLink.href = "/cart"
        const cartIconContainer = document.createElement("div")
        cartIconContainer.classList.add("user-navbar__icon-container")
        cartIconContainer.id = "btn-cart"
        const cartIcon = document.createElement("i")
        cartIcon.classList.add("fas", "fa-shopping-cart")
        const cartCounter = document.createElement("div")
        cartCounter.classList.add("user-navbar__cart-counter")
        cartCounter.id = "user-cart-counter2"
        cartCounter.textContent = user.cart.reduce((acum, obj) => { //muestro el acumulado de la cantidad de productos en el carrito
            return acum + parseInt(obj.quantity)
        }, 0)
        cartIconContainer.appendChild(cartIcon)
        cartIconContainer.appendChild(cartCounter)
        cartLink.appendChild(cartIconContainer)

        const wishLink = document.createElement("a")
        wishLink.href = "/wishlist"
        const wishIconContainer = document.createElement("div")
        wishIconContainer.classList.add("user-navbar__icon-container")
        wishIconContainer.id = "btn-wish"
        const wishIcon = document.createElement("i")
        wishIcon.classList.add("fa-solid", "fa-heart")
        const wishCounter = document.createElement("div")
        wishCounter.classList.add("user-navbar__cart-counter")
        wishCounter.id = "user-wish-counter2"
        wishCounter.textContent = user.wish.length
        wishIconContainer.appendChild(wishIcon)
        wishIconContainer.appendChild(wishCounter)
        wishLink.appendChild(wishIconContainer)

        const menuDropDown = document.createElement("div")
        menuDropDown.id = "menuDropDown"
        menuDropDown.classList.add("dropdown")

        const userAvatarContainer = document.createElement("div")
        userAvatarContainer.classList.add("user-navbar__user-avatar")
        userAvatarContainer.id = "btn-avatar"
        const userAvatar = document.createElement("img")
        userAvatar.onerror = loadAvatarError
        userAvatar.src = `/assets/img/avatar/${user.img}`
        userAvatar.classList.add("user-navbar__user-avatar")
        userAvatar.alt = "Imagen de usuario"
        const userName = document.createElement("div")
        userName.classList.add("user-name", "user-navbar__user-name")
        userName.textContent = user.name.split(" ")[0]
        userAvatarContainer.appendChild(userAvatar)
        userAvatarContainer.appendChild(userName)

        const dropdownContent = document.createElement("div")
        dropdownContent.classList.add("dropdown-content")

        const profileLink = document.createElement("a")
        profileLink.href = "/profile"
        const profileIcon = document.createElement("i")
        profileIcon.classList.add("fa-solid", "fa-user")
        profileLink.appendChild(profileIcon);
        profileLink.appendChild(document.createTextNode(" Perfil"))

        const orderLink = document.createElement("a")
        orderLink.href = "/orders"
        const orderIcon = document.createElement("i")
        orderIcon.classList.add("fa-solid", "fa-box")
        orderLink.appendChild(orderIcon);
        orderLink.appendChild(document.createTextNode(" Ordenes"))


        const adminLink = document.createElement("a")
        adminLink.rel = "noopener"
        adminLink.href = "/admin"
        const adminIcon = document.createElement("i")
        adminIcon.classList.add("fa-solid", "fa-screwdriver-wrench")
        adminLink.appendChild(adminIcon)
        adminLink.appendChild(document.createTextNode(" Admin"))
        

        dropdownContent.appendChild(profileLink)
        dropdownContent.appendChild(orderLink)
        
        if (user.role === "ADMIN_ROLE") {
            dropdownContent.appendChild(adminLink)
        }

        const salirLink = document.createElement("a")
        salirLink.rel = "noopener"
        salirLink.target = ""
        salirLink.href = "/login"
        const salirIcon = document.createElement("i")
        salirIcon.classList.add("fa-solid", "fa-arrow-right-from-bracket")
        salirLink.appendChild(salirIcon)
        salirLink.appendChild(document.createTextNode(" Salir"))

        dropdownContent.appendChild(salirLink)

        menuDropDown.appendChild(userAvatarContainer)
        menuDropDown.appendChild(dropdownContent)

        userNavbar.appendChild(cartLink)
        userNavbar.appendChild(wishLink)
        userNavbar.appendChild(menuDropDown)

        userNavbar2.innerHTML = userNavbar.innerHTML
    }else{
        renderMenuLoginRegister()
    }
}
//carga el link de registro y login
function renderMenuLoginRegister() {
    
    const registerNavItem = document.createElement("li")
    registerNavItem.setAttribute("id", "nav-registro")
    registerNavItem.classList.add("navbar__nav-item")

    const registerNavLink = document.createElement("a")
    registerNavLink.setAttribute("href", "/register")
    registerNavLink.classList.add("navbar__nav-link")
    registerNavLink.textContent = "Registro"

    registerNavItem.appendChild(registerNavLink)

    const loginNavItem = document.createElement("li")
    loginNavItem.setAttribute("id", "nav-login")
    loginNavItem.classList.add("navbar__nav-item")

    const loginNavLink = document.createElement("a")
    loginNavLink.setAttribute("href", "/login")
    loginNavLink.classList.add("navbar__nav-link")
    loginNavLink.textContent = "Login"

    loginNavItem.appendChild(loginNavLink)

    const navLinksContainer = document.querySelector(".navbar__nav-links-container")
    navLinksContainer.appendChild(registerNavItem)
    navLinksContainer.appendChild(loginNavItem)

}

//Funcion para cargar imagen por defecto ante error en avatar
function loadAvatarError() {
    var IMG = document.querySelector('div.user-navbar__user-avatar img');
    IMG.src = '/assets/img/avatar/avatar-default.png';
}
