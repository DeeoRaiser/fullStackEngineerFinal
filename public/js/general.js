let articlePrice = 0 //Variable para calcular los precios del modal

//Funcion que envia el token para validar el usuario logueado
async function callApiPrivate(api, vervo, obj = {}, file = false) {

    let token = localStorage.getItem('tkn')
    let user = JSON.parse(localStorage.getItem('user'))

    if (token && user) {
        try {
            let header = { Authorization: token }

            let respuesta = ""
            if (vervo == 'put') {
                respuesta = await axios.put(api, obj, { headers: header, user: user._id })
            } else if (vervo === 'get') {
                respuesta = await axios.get(api, { headers: header, user: user._id, params: obj })
            } else if (vervo === 'post') {
                respuesta = await axios.post(api, obj, { headers: header, user: user._id })
            } else if (vervo === 'delete') {
                respuesta = await axios.delete(api, { headers: header, user: user._id })
            }
            return respuesta.data

        } catch (error) {
            return error
        }
    } else {
        window.location.href = "/login"
    }
}


function viewDetail(id) {
    let detail = document.getElementById(`artsOrder${id}`)
    let btn = document.getElementById(`viewDetail${id}`)

    if (detail.style.display === 'none') {
        detail.style.display = 'flex'
        btn.innerHTML = "Ocultar Detalle"
    } else {
        detail.style.display = 'none'
        btn.innerHTML = "Ver Detalle"
    }
}

//Funcion para dar formato currency a el precio de los articulos
function formatCurrency(num) {
    const options = { style: "currency", currency: "usd", minimumFractionDigits: 2 };
    const numFormat = num.toLocaleString("en-US", options);
    return numFormat
}

//Funcion que recibe el codigo de pais y retorna el Nombre del mismo
function countryName(value) {

    const countries = [
        { value: "AF", name: "Afghanistan" },
        { value: "AX", name: "Åland Islands" },
        { value: "AL", name: "Albania" },
        { value: "DZ", name: "Algeria" },
        { value: "AS", name: "American Samoa" },
        { value: "AD", name: "Andorra" },
        { value: "AO", name: "Angola" },
        { value: "AI", name: "Anguilla" },
        { value: "AQ", name: "Antarctica" },
        { value: "AG", name: "Antigua and Barbuda" },
        { value: "AR", name: "Argentina" },
        { value: "AM", name: "Armenia" },
        { value: "AW", name: "Aruba" },
        { value: "AU", name: "Australia" },
        { value: "AT", name: "Austria" },
        { value: "AZ", name: "Azerbaijan" },
        { value: "BS", name: "Bahamas" },
        { value: "BH", name: "Bahrain" },
        { value: "BD", name: "Bangladesh" },
        { value: "BB", name: "Barbados" },
        { value: "BY", name: "Belarus" },
        { value: "BE", name: "Belgium" },
        { value: "BZ", name: "Belize" },
        { value: "BJ", name: "Benin" },
        { value: "BM", name: "Bermuda" },
        { value: "BT", name: "Bhutan" },
        { value: "BO", name: "Bolivia, Plurinational State of" },
        { value: "BQ", name: "Bonaire, Sint Eustatius and Saba" },
        { value: "BA", name: "Bosnia and Herzegovina" },
        { value: "BW", name: "Botswana" },
        { value: "BV", name: "Bouvet Island" },
        { value: "BR", name: "Brazil" },
        { value: "IO", name: "British Indian Ocean Territory" },
        { value: "BN", name: "Brunei Darussalam" },
        { value: "BG", name: "Bulgaria" },
        { value: "BF", name: "Burkina Faso" },
        { value: "BI", name: "Burundi" },
        { value: "KH", name: "Cambodia" },
        { value: "CM", name: "Cameroon" },
        { value: "CA", name: "Canada" },
        { value: "CV", name: "Cape Verde" },
        { value: "KY", name: "Cayman Islands" },
        { value: "CF", name: "Central African Republic" },
        { value: "TD", name: "Chad" },
        { value: "CL", name: "Chile" },
        { value: "CN", name: "China" },
        { value: "CX", name: "Christmas Island" },
        { value: "CC", name: "Cocos (Keeling) Islands" },
        { value: "CO", name: "Colombia" },
        { value: "KM", name: "Comoros" },
        { value: "CG", name: "Congo" },
        { value: "CD", name: "Congo, the Democratic Republic of the" },
        { value: "CK", name: "Cook Islands" },
        { value: "CR", name: "Costa Rica" },
        { value: "CI", name: "Côte d'Ivoire" },
        { value: "HR", name: "Croatia" },
        { value: "CU", name: "Cuba" },
        { value: "CW", name: "Curaçao" },
        { value: "CY", name: "Cyprus" },
        { value: "CZ", name: "Czech Republic" },
        { value: "DK", name: "Denmark" },
        { value: "DJ", name: "Djibouti" },
        { value: "DM", name: "Dominica" },
        { value: "DO", name: "Dominican Republic" },
        { value: "EC", name: "Ecuador" },
        { value: "EG", name: "Egypt" },
        { value: "SV", name: "El Salvador" },
        { value: "GQ", name: "Equatorial Guinea" },
        { value: "ER", name: "Eritrea" },
        { value: "EE", name: "Estonia" },
        { value: "ET", name: "Ethiopia" },
        { value: "FK", name: "Falkland Islands (Malvinas)" },
        { value: "FO", name: "Faroe Islands" },
        { value: "FJ", name: "Fiji" },
        { value: "FI", name: "Finland" },
        { value: "FR", name: "France" },
        { value: "GF", name: "French Guiana" },
        { value: "PF", name: "French Polynesia" },
        { value: "TF", name: "French Southern Territories" },
        { value: "GA", name: "Gabon" },
        { value: "GM", name: "Gambia" },
        { value: "GE", name: "Georgia" },
        { value: "DE", name: "Germany" },
        { value: "GH", name: "Ghana" },
        { value: "GI", name: "Gibraltar" },
        { value: "GR", name: "Greece" },
        { value: "GL", name: "Greenland" },
        { value: "GD", name: "Grenada" },
        { value: "GP", name: "Guadeloupe" },
        { value: "GU", name: "Guam" },
        { value: "GT", name: "Guatemala" },
        { value: "GG", name: "Guernsey" },
        { value: "GN", name: "Guinea" },
        { value: "GW", name: "Guinea-Bissau" },
        { value: "GY", name: "Guyana" },
        { value: "HT", name: "Haiti" },
        { value: "HM", name: "Heard Island and McDonald Islands" },
        { value: "VA", name: "Holy See (Vatican City State)" },
        { value: "HN", name: "Honduras" },
        { value: "HK", name: "Hong Kong" },
        { value: "HU", name: "Hungary" },
        { value: "IS", name: "Iceland" },
        { value: "IN", name: "India" },
        { value: "ID", name: "Indonesia" },
        { value: "IR", name: "Iran, Islamic Republic of" },
        { value: "IQ", name: "Iraq" },
        { value: "IE", name: "Ireland" },
        { value: "IM", name: "Isle of Man" },
        { value: "IL", name: "Israel" },
        { value: "IT", name: "Italy" },
        { value: "JM", name: "Jamaica" },
        { value: "JP", name: "Japan" },
        { value: "JE", name: "Jersey" },
        { value: "JO", name: "Jordan" },
        { value: "KZ", name: "Kazakhstan" },
        { value: "KE", name: "Kenya" },
        { value: "KI", name: "Kiribati" },
        { value: "KP", name: "Korea, Democratic People's Republic of" },
        { value: "KR", name: "Korea, Republic of" },
        { value: "KW", name: "Kuwait" },
        { value: "KG", name: "Kyrgyzstan" },
        { value: "LA", name: "Lao People's Democratic Republic" },
        { value: "LV", name: "Latvia" },
        { value: "LB", name: "Lebanon" },
        { value: "LS", name: "Lesotho" },
        { value: "LR", name: "Liberia" },
        { value: "LY", name: "Libya" },
        { value: "LI", name: "Liechtenstein" },
        { value: "LT", name: "Lithuania" },
        { value: "LU", name: "Luxembourg" },
        { value: "MO", name: "Macao" },
        { value: "MK", name: "Macedonia, the former Yugoslav Republic of" },
        { value: "MG", name: "Madagascar" },
        { value: "MW", name: "Malawi" },
        { value: "MY", name: "Malaysia" },
        { value: "MV", name: "Maldives" },
        { value: "ML", name: "Mali" },
        { value: "MT", name: "Malta" },
        { value: "MH", name: "Marshall Islands" },
        { value: "MQ", name: "Martinique" },
        { value: "MR", name: "Mauritania" },
        { value: "MU", name: "Mauritius" },
        { value: "YT", name: "Mayotte" },
        { value: "MX", name: "Mexico" },
        { value: "FM", name: "Micronesia, Federated States of" },
        { value: "MD", name: "Moldova, Republic of" },
        { value: "MC", name: "Monaco" },
        { value: "MN", name: "Mongolia" },
        { value: "ME", name: "Montenegro" },
        { value: "MS", name: "Montserrat" },
        { value: "MA", name: "Morocco" },
        { value: "MZ", name: "Mozambique" },
        { value: "MM", name: "Myanmar" },
        { value: "NA", name: "Namibia" },
        { value: "NR", name: "Nauru" },
        { value: "NP", name: "Nepal" },
        { value: "NL", name: "Netherlands" },
        { value: "NC", name: "New Caledonia" },
        { value: "NZ", name: "New Zealand" },
        { value: "NI", name: "Nicaragua" },
        { value: "NE", name: "Niger" },
        { value: "NG", name: "Nigeria" },
        { value: "NU", name: "Niue" },
        { value: "NF", name: "Norfolk Island" },
        { value: "MP", name: "Northern Mariana Islands" },
        { value: "NO", name: "Norway" },
        { value: "OM", name: "Oman" },
        { value: "PK", name: "Pakistan" },
        { value: "PW", name: "Palau" },
        { value: "PS", name: "Palestinian Territory, Occupied" },
        { value: "PA", name: "Panama" },
        { value: "PG", name: "Papua New Guinea" },
        { value: "PY", name: "Paraguay" },
        { value: "PE", name: "Peru" },
        { value: "PH", name: "Philippines" },
        { value: "PN", name: "Pitcairn" },
        { value: "PL", name: "Poland" },
        { value: "PT", name: "Portugal" },
        { value: "PR", name: "Puerto Rico" },
        { value: "QA", name: "Qatar" },
        { value: "RE", name: "Réunion" },
        { value: 'RO', name: 'Romania' },
        { value: 'RU', name: 'Russian Federation' },
        { value: 'RW', name: 'Rwanda' },
        { value: 'BL', name: 'Saint Barthélemy' },
        { value: 'SH', name: 'Saint Helena, Ascension and Tristan da Cunha' },
        { value: 'KN', name: 'Saint Kitts and Nevis' },
        { value: 'LC', name: 'Saint Lucia' },
        { value: 'MF', name: 'Saint Martin (French part)' },
        { value: 'PM', name: 'Saint Pierre and Miquelon' },
        { value: 'VC', name: 'Saint Vincent and the Grenadines' },
        { value: 'WS', name: 'Samoa' },
        { value: 'SM', name: 'San Marino' },
        { value: 'ST', name: 'Sao Tome and Principe' },
        { value: 'SA', name: 'Saudi Arabia' },
        { value: 'SN', name: 'Senegal' },
        { value: 'RS', name: 'Serbia' },
        { value: 'SC', name: 'Seychelles' },
        { value: 'SL', name: 'Sierra Leone' },
        { value: 'SG', name: 'Singapore' },
        { value: 'SX', name: 'Sint Maarten (Dutch part)' },
        { value: 'SK', name: 'Slovakia' },
        { value: 'SI', name: 'Slovenia' },
        { value: 'SB', name: 'Solomon Islands' },
        { value: 'SO', name: 'Somalia' },
        { value: 'ZA', name: 'South Africa' },
        { value: 'GS', name: 'South Georgia and the South Sandwich Islands' },
        { value: 'SS', name: 'South Sudan' },
        { value: 'ES', name: 'Spain' },
        { value: 'LK', name: 'Sri Lanka' },
        { value: 'SD', name: 'Sudan' },
        { value: 'SR', name: 'Suriname' },
        { value: 'SJ', name: 'Svalbard and Jan Mayen' },
        { value: 'SZ', name: 'Swaziland' },
        { value: 'SE', name: 'Sweden' },
        { value: 'CH', name: 'Switzerland' },
        { value: 'SY', name: 'Syrian Arab Republic' },
        { value: 'TW', name: 'Taiwan, Province of China' },
        { value: 'TJ', name: 'Tajikistan' },
        { value: 'TZ', name: 'Tanzania, United Republic of' },
        { value: 'TH', name: 'Thailand' },
        { value: 'TL', name: 'Timor-Leste' },
        { value: 'TG', name: 'Togo' },
        { value: 'TK', name: 'Tokelau' },
        { value: 'TO', name: 'Tonga' },
        { value: 'TT', name: 'Trinidad and Tobago' },
        { value: 'TN', name: 'Tunisia' },
        { value: 'TR', name: 'Turkey' },
        { value: 'TM', name: 'Turkmenistan' },
        { value: 'TC', name: 'Turks and Caicos Islands' },
        { value: 'TV', name: 'Tuvalu' },
        { value: 'UG', name: 'Uganda' },
        { value: 'UA', name: 'Ukraine' },
        { value: 'AE', name: 'United Arab Emirates' },
        { value: 'GB', name: 'United Kingdom' },
        { value: 'US', name: 'United States' },
        { value: 'UM', name: 'United States Minor Outlying Islands' },
        { value: 'UY', name: 'Uruguay' },
        { value: 'UZ', name: 'Uzbekistan' },
        { value: 'VU', name: 'Vanuatu' },
        { value: 'VE', name: 'Venezuela, Bolivarian Republic of' },
        { value: 'VN', name: 'Viet Nam' },
        { value: 'VG', name: 'Virgin Islands, British' },
        { value: 'VI', name: 'Virgin Islands, U.S.' },
        { value: 'WF', name: 'Wallis and Futuna' },
        { value: 'EH', name: 'Western Sahara' },
        { value: 'YE', name: 'Yemen' },
        { value: 'ZM', name: 'Zambia' },
        { value: 'ZW', name: 'Zimbabwe' }
    ]

    for (let i = 0; i < countries.length; i++) {
        if (countries[i].value === value) {
            return countries[i].name;
        }
    }
}

//funcion que carga la informacion del articulo en el modal
function artDetail(article) {
    const title = document.getElementById("art-Title")
    title.innerHTML = article.title

    const photo = document.getElementById("article-photo")
    photo.src = `/assets/img/store/${article.img}`

    const desc = document.getElementById("article-description")
    desc.innerHTML = article.description

    const price = document.getElementById("article-price")
    price.innerHTML = formatCurrency(parseFloat(article.price))
    articlePrice = article.price
}

//Funcion que agrega articulos al carrito de compras, parametro ID articulo y Cantidad
function addCart(idArt, quan = 1) {

    user = JSON.parse(localStorage.getItem("user")) || []
    if (user.length !== 0) {
        let cart = user.cart
        const searchCart = cart.find(cart => cart._id === idArt) || [] //BUSCO EL ARTICULO EN EL CARRITO

        if (searchCart.length === 0) {   //si el array esta vacio (no esta ese articulo en el carrito) lo creo
            let addArt = {
                _id: idArt,
                quantity: quan
            }
            cart.push(addArt)
        } else {                          //si este articulo ya esta en el carrito incremento la cantidad
            searchCart.quantity += quan
        }

        user.cart = cart
        localStorage.setItem("user", JSON.stringify(user))
        const nombre = document.getElementById("title" + idArt) || document.getElementById("art-Title")
        showAlert(`${quan} ${nombre.innerHTML}`, "Se agrego a tu carrito")

        renderUserMenu()

    } else {
        showAlert("Crea una cuenta e inicia sesion", "para poder armar tu carrito", "err")
    }
}

//Funcion que muestra el modal, carga los datos el articulo y escucha los eventos
async function detailArt(id) {

    let Art = await axios.get(`/product/${id}`)
    artDetail(Art.data.product)

    var modal = document.getElementById("modal")
    modal.style.display = "flex"
    modal.style.animation = "drop-modal 0.3s ease-out forwards"

    /* -------------------------------------------------------EVENTOS MODAL------------------------------------------------------- */
    /* EVENTO BOTON + EN MODAL */
    var add = document.getElementById("add")
    add.addEventListener('click', (event) => {
        let campo = document.getElementById("quantity")

        if (parseInt(campo.value) < 99) {
            campo.value = parseInt(campo.value) + 1
            let price = document.getElementById("article-price")
            price.innerHTML = formatCurrency(parseFloat(articlePrice) * (parseInt(campo.value)))
        }
    })

    /* EVENTO BOTON - EN MODAL */
    var del = document.getElementById("del")
    del.addEventListener('click', (event) => {
        let campo = document.getElementById("quantity")
        if (parseInt(campo.value) > 1) {
            campo.value = parseInt(campo.value) - 1
            let price = document.getElementById("article-price")
            price.innerHTML = formatCurrency(parseFloat(articlePrice) * (parseInt(campo.value)))
        }
    })

    /* EVENTO BOTON X EN MODAL */
    var close = document.getElementById("close")
    close.addEventListener('click', (event) => {
        var modal = document.getElementById("modal")
        setTimeout(() => {
            modal.style.display = "none"
        }, 300)
        modal.style.animation = "hide-modal 0.3s ease-out forwards"
    })

    //Agregar funcion al boton de agregar al carrito
    var addC = document.getElementById("modalAddCart")
    addC.addEventListener('click', (event) => {
        let quantity = parseInt(document.getElementById("quantity").value)
        addCart(Art.data.product._id, quantity)
    })

    //agregar funcion al boton de wishlist
    var addW = document.getElementById("modalWishAdd")
    addW.addEventListener('click', (event) => {
        addDelWish(id)
    })
}

//Funcion ocultar los iconos de la forma de ordenamiento
function hideIcons() {
    iconAZ.style.display = "none"
    iconZA.style.display = "none"
    icon19.style.display = "none"
    icon91.style.display = "none"
}

//Funcion para ordenar un array antes de dibujarlo
function orderBy(array, ordBy) {
    hideIcons()
    if (ordBy === "Descripción A-Z") {
        iconAZ.style.display = "inline"
        array.sort((a, b) => {
            if (a.title < b.title) {
                return -1
            } else {
                return 1
            }
        })

    } else if (ordBy === "Descripción Z-A") {
        iconZA.style.display = "inline"
        array.sort((a, b) => {
            if (a.title > b.title) {
                return -1
            } else {
                return 1
            }
        })

    } else if (ordBy === "Precio mayor primero") {
        icon91.style.display = "inline"
        array.sort((a, b) => {
            if (a.price > b.price) {
                return -1
            } else {
                return 1
            }
        })

    } else if (ordBy === "Precio menor primero") {
        icon19.style.display = "inline"
        array.sort((a, b) => {
            if (a.price < b.price) {
                return -1
            } else {
                return 1
            }
        })
    }
    return array
}

//Funcion para ordenar un array antes de dibujarlo
function orderByUsers(array, ordBy) {

    hideIcons()
    if (ordBy === "Nombre A-Z") {
        iconAZUsr.style.display = "inline"
        array.sort((a, b) => {
            if (a.name < b.name) {
                return -1
            } else {
                return 1
            }
        })

    } else if (ordBy === "Nombre Z-A") {
        iconZAUsr.style.display = "inline"
        array.sort((a, b) => {
            if (a.name > b.name) {
                return -1
            } else {
                return 1
            }
        })

    } else if (ordBy === "Mail A-Z") {
        icon91Usr.style.display = "inline"
        array.sort((a, b) => {
            if (a.mail > b.mail) {
                return -1
            } else {
                return 1
            }
        })

    } else if (ordBy === "Mail Z-A") {
        icon19Usr.style.display = "inline"
        array.sort((a, b) => {
            if (a.mail < b.mail) {
                return -1
            } else {
                return 1
            }
        })
    }

    return array
}

//Funcion que dibuja las card en el DOM, parametro Array de Articulos
//Dibuja las card del index y las del WishCart
function addCards(arts) {

    let cc = document.getElementById("cards-container")
    cc.innerHTML = ""

    arts.forEach(art => {

        const articleCard = document.createElement("article")
        articleCard.classList.add("card")

        const headerDiv = document.createElement("div")
        headerDiv.classList.add("card__header")

        const heartDiv = document.createElement("div")

        heartDiv.classList.add("card__heart")
        heartDiv.setAttribute("id", `heart_${art._id}`)
        heartDiv.setAttribute("onclick", `addDelWish('${art._id}')`)

        if (user.length !== 0) {
            let exist = user.wish.includes(art._id)

            if (exist) {
                heartDiv.classList.add("card__heartWishOn")
            }
        }

        const heartIcon = document.createElement("i")
        heartIcon.classList.add("fa-solid", "fa-heart")
        heartIcon.setAttribute("onclick", `addDelWish(${art._id})`)

        heartDiv.appendChild(heartIcon)
        headerDiv.appendChild(heartDiv)

        const img = document.createElement("img")
        img.src = `assets/img/store/${art.img}`
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
        dateDiv.textContent = unixDate(parseInt(art.date))


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
    });

}


function unixDate(unix) {
    const fecha = new Date(unix * 1000);
    const day = fecha.getDate().toString().padStart(2, '0');
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const year = fecha.getFullYear().toString();
    return `${day}/${month}/${year}`;
}


//Funcion que dibuja las card en el DOM de las ordenes
