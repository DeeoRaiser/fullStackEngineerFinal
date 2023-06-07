hideBody()
adminPanel()

let arts = []
let orders = []
let users = []

var editArticulo = false
var editArticuloID = ""
var editUser = false
artSearchFilter = arts

var artSearchFilter = [] //Array donde se gurdan los articulos del termino de busqueda
var usrSearchFilter = [] //Array donde se gurdan los usuarios del termino de busqueda


//Obtiene todos los articulos de la base de datos
async function obtenerTodosLosArticulos() {
  try {
    const response = await axios.get(`/api/page/1`)
    const datos = response.data
    arts = datos.registros
    addArticles(orderBy(arts, "Descripción A-Z"))
  } catch (error) {
    console.error(error)
  }
}

//Verifico si el usuario logueado es admin....
async function adminPanel() {
  let access = await callApiPrivate(`/user/admin`, "post")
  if (await access.msg === "AdminUser") {
    obtenerTodosLosArticulos()
    obtenerTodosLosUsers()
    getAllOrders()
    showBody()
  } else {
    let body = document.getElementsByClassName('body')
    body[0].innerHTML = access.msg
  }
}

//Obtengo todos los usuarios siempre que sea un admin
async function obtenerTodosLosUsers() {
  const users = await callApiPrivate('/users', "post")

  if (users.users) {
    addUsers(users.users)
  } else {

  }
}


//Obtengo todos las ordenes de los usuarios
async function getAllOrders() {
  let allOrders = await callApiPrivate('/api/get-orders', 'get')
  if (allOrders) {

    renderOrders(allOrders.orders)
  } else {
    console.log("error all order")
  }
  console.log(allOrders.orders)
}

function renderOrders(orders) {
  let user = JSON.parse(localStorage.getItem('user'))

  const orderSection = document.getElementById('row-order-detail')
  orderSection.innerHTML = ""
  if (!orders) {
    orderSection.innerHTML = "<h1>No hay ordenes cargadas</h1>"
  }


  orders.forEach(order => {
    const orderContainer = document.createElement('div')
    orderContainer.className = 'order-container'

    // Header, idOrder y estado
    const orderHeader = document.createElement('div')
    orderHeader.className = 'order-container__order-header'

    const orderStatus = document.createElement('p')
    orderStatus.className = 'order-container__state'
    orderStatus.innerHTML = `Estado: ${order.status}`

    const orderID = document.createElement('div')
    orderID.className = 'order-container__order-id'
    orderID.innerHTML = `Orden: ${order._id}`

    orderHeader.appendChild(orderID)
    orderHeader.appendChild(orderStatus)


    // OrderStatusAmoun Cambiar Estado y precio de la orden
    const orderStatusAmount = document.createElement('div')
    orderStatusAmount.className = 'order-container__statusAmount'

    const orderUser = document.createElement('div')
    orderUser.className = 'order-container__order-user'
    orderUser.innerHTML = `User: ${order.userEmail}`

    const orderAmount = document.createElement('p')
    orderAmount.className = 'order-container__amount'
    orderAmount.innerHTML = `Total: ${formatCurrency(order.amount)}`

    orderStatusAmount.appendChild(orderUser)
    orderStatusAmount.appendChild(orderAmount)



    orderContainer.appendChild(orderHeader)
    orderContainer.appendChild(orderStatusAmount)
    if (user.role === "ADMIN_ROLE") {
      const editButton = document.createElement('div')
      editButton.className = 'button__ok orderButton'
      editButton.innerHTML = "Cambiar Estado"
      editButton.setAttribute('onclick', `editOrder('${order._id}')`)
      orderContainer.appendChild(editButton)
    }

    const viewDetail = document.createElement('div')
    viewDetail.className = 'button__ok orderButton'
    viewDetail.innerHTML = "Ver Detalle"
    viewDetail.setAttribute('onclick', `viewDetail('${order._id}')`)
    viewDetail.setAttribute("id", `viewDetail${order._id}`)
    orderContainer.appendChild(viewDetail)


    const artsContainer = document.createElement('div')
    artsContainer.setAttribute("id", `artsOrder${order._id}`)
    artsContainer.className = 'arts-container'
    artsContainer.style.display = "none"

    order.arts.forEach(art => {
      const divRow = document.createElement('div')
      divRow.className = 'row'

      const divPic = document.createElement('div')
      divPic.className = 'row__pic'

      const img = document.createElement('img')
      img.src = art.img

      const divDesc = document.createElement('div')
      divDesc.className = 'row__description'
      divDesc.innerHTML = art.title

      const quantityContainer = document.createElement('div')
      quantityContainer.classList.add('quantity-container')

      const quantityInput = document.createElement('input')
      quantityInput.classList.add('cart-containter__qnty')
      quantityInput.setAttribute('value', art.quantity)
      quantityInput.setAttribute('readonly', true)

      quantityContainer.appendChild(quantityInput)

      const divPartialAmount = document.createElement('div')
      divPartialAmount.className = 'row__partial-amount'
      divPartialAmount.innerHTML = formatCurrency(art.quantity * art.price)

      divPic.appendChild(img)
      divRow.appendChild(divPic)
      divRow.appendChild(divDesc)
      divRow.appendChild(quantityContainer)
      divRow.appendChild(divPartialAmount)

      artsContainer.appendChild(divRow)
    })

    orderContainer.appendChild(artsContainer)
    orderSection.appendChild(orderContainer)
  })
}

let image = document.getElementById("routeImageArt")
image.addEventListener("change", (evt) => {
  let artPic = document.getElementById("artPic")
  const urlFile = URL.createObjectURL(evt.target.files[0])
  artPic.src = urlFile
})


/* CODIGO DE PARA MANEJAR LA TAB ARTICULOS */
//#region ARTICULOS TAB1

const modalArt = document.getElementById("modalArt")
const modalUsers = document.getElementById("modalUser")
const modalOrder = document.getElementById("modalOrder")

//ORDER DE ARTICULOS
let iconAZ = document.getElementById("a-z")
let iconZA = document.getElementById("z-a")
let icon19 = document.getElementById("menor-mayor")
let icon91 = document.getElementById("mayor-menor")

//ORDER DE USUARIO
//let iconAZUsr = document.getElementById("a-z-usr")
//let iconZAUsr = document.getElementById("z-a-usr")
//let icon19Usr = document.getElementById("menor-mayor-usr")
//let icon91Usr = document.getElementById("mayor-menor-usr")



hideOrderIcons() //Oculto los iconos de la forma de ordenamiento


var i, tabcontent;
tabcontent = document.getElementsByClassName("tabcontent")

for (i = 0; i < tabcontent.length; i++) {
  tabcontent[i].style.display = "none"
}

function hideBody() {
  const b = document.getElementsByTagName('body')
  b[0].style.display = "none"
}

function showBody() {
  const b = document.getElementsByTagName('body')
  b[0].style.display = ""
}


//Funcion Cargar los articulos al DOM
function addArticles(array) {
  const t1 = document.getElementById("listArt")
  t1.innerHTML = ""

  array.forEach(art => {

    const divRow = document.createElement('div')
    divRow.className = 'fullRow'

    const divPic = document.createElement('div')
    divPic.className = 'fullRow__pic'

    const img = document.createElement('img')
    img.src = `/assets/img/store/${art.img}`

    const divTitle = document.createElement('div')
    divTitle.className = 'fullRow__title'
    divTitle.innerHTML = art.title

    const divDesc = document.createElement('div')
    divDesc.className = 'fullRow__description'
    divDesc.innerHTML = art.description

    const divPrice = document.createElement('div')
    divPrice.className = 'fullRow__price'
    divPrice.innerHTML = formatCurrency(parseFloat(art.price))

    const buttonsContainer = document.createElement('div')
    buttonsContainer.classList.add('buttons-containter')

    const deleteContainer = document.createElement('div')
    deleteContainer.classList.add('cart-containter__delete')

    const editButton = document.createElement('button')
    editButton.classList.add('btn', 'buttons-containter__edit')
    editButton.innerHTML = '<i class="fa-solid fa-pen"></i>Editar'
    editButton.setAttribute('onclick', `editArt('${art._id}')`)

    const deleteButton = document.createElement('button')
    deleteButton.classList.add('btn', 'buttons-containter__delete')
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>Borrar'
    deleteButton.setAttribute('onclick', `deleteArt('${art._id}')`)

    buttonsContainer.appendChild(editButton)
    buttonsContainer.appendChild(deleteButton)

    divPic.appendChild(img)

    divRow.appendChild(divPic)
    divRow.appendChild(divTitle)
    divRow.appendChild(divDesc)
    divRow.appendChild(divPrice)
    divRow.appendChild(buttonsContainer)
    divRow.appendChild(deleteContainer)
    t1.appendChild(divRow)

  })
}

//funcion para cargar renderisar articulos segun termino de busqueda
let searchButton = document.getElementById("search-button-art")
searchButton.addEventListener("click", (evt) => {
  //recargo los articulos del LocalStorage
  artSearchFilter.splice(0) //elimino todos los elementos del array
  let searchInput = document.getElementById("search-input-art").value.toLowerCase()

  arts.forEach((art) => {
    if (art.title.toLowerCase().includes(searchInput)) {
      artSearchFilter.push(art)
    }
  })

  addArticles(artSearchFilter)
})

//Funcion para mostrar las tabs segun el boton
function openTab(evt, tabName) {
  var i, tabcontent;
  tabcontent = document.getElementsByClassName("tabcontent")

  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none"
  }
  document.getElementById(tabName).style.display = "flex"
}


//Funcion para editar un articulo, llamada desde el boton editar del DOM
async function editArt(id) {
  cleanArtForm()
  try {
    const button = document.getElementById("art-submit")
    button.value = "Editar"
    editArticuloID = id
    const art = await axios.get(`/product/${id}`)
    editingArt(true)
    modalArt.style.display = "flex"
    cargarDatosArticulo(art.data.product)
  } catch (error) {
    console.log(error)
  }
}

//Funcion que recibe como parametro un objeto Articulo, carga los datos enviados en el DOM, para editar o visualizar
function cargarDatosArticulo(art) {
  modalArt.style.display = "flex"
  modalArt.style.animation = "drop-modal 0.3s ease-out forwards"

  let artID = document.getElementsByName("artID")[0]
  let title = document.getElementsByName("title")[0]
  let img = document.getElementById("artPic")
  let artDescription = document.getElementsByName("description")[0]
  let price = document.getElementsByName("price")[0]
  let artDate = document.getElementsByName("date")[0]

  title.value = art.title
  artID.value = art.id
  img.src = `/assets/img/store/${art.img}`
  artDescription.innerText = art.img
  price.value = art.price
  artDescription.value = art.description
  const fecha = new Date(art.date * 1000)
  artDate.value = fecha.toISOString().substring(0, 10)
}

function cleanArtForm() {
  let artID = document.getElementsByName("artID")[0]
  let title = document.getElementsByName("title")[0]
  let img = document.getElementById("artPic")
  let imgFile = document.getElementById("routeImageArt")
  let artDescription = document.getElementsByName("description")[0]
  let price = document.getElementsByName("price")[0]
  let artDate = document.getElementsByName("date")[0]

  title.value = ""
  artID.value = ""
  imgFile.value = null
  img.src = `/assets/img/store/default-product-image.png`
  artDescription.innerText = ""
  price.value = ""
  artDescription.value = ""
  artDate.value = ""
}

//cancelar el editado y/o carga de un articulo y esconde el modal
let buttonCancel = document.getElementById("art-cancel")
buttonCancel.addEventListener("click", (event) => {
  editingArt(false)
  hideModalArt()
})

//boton para cerrar el modal articulo la X de arriba a la izquierda

//Modal Articulo
let closeModal0 = document.getElementById("close0")
closeModal0.addEventListener("click", (event) => {
  editingArt(false)
  hideModalArt()
})
//Modal Order
let closeModal1 = document.getElementById("close1")
closeModal1.addEventListener("click", (event) => {
  hideModalOrder()
})



//Cierra el modal ARTICULOS
function hideModalArt() {
  setTimeout(() => {
    modalArt.style = ""
    modalArt.style.display = "none"
  }, 300)
  modalArt.style.animation = "hide-modal 0.3s ease-out forwards"
}

//Formulario para cargar Articulo
let form = document.getElementById("article-form")
form.addEventListener("submit", async (event) => {
  event.preventDefault()
  const formData = new FormData(event.target)

  console.log(formData)
  try {
    if (editArticulo === true) {
      const editProd = await callApiPrivate(`/product/${editArticuloID}`, "put", formData)
      showAlert("Editar Articulo", `${editProd.msg}`, "sus")
    } else {
      const newProd = await callApiPrivate("/product/upload/image", "post", formData)
      showAlert("Nuevo Articulo", `${newProd.msg}`, "sus")
    }
  } catch (error) {
    console.log(error)
    showAlert("Error", `${error.response}`, "err")
  }
  hideModalArt()
  obtenerTodosLosArticulos()
})

//Modal donde esta el formulario para cargar articulos
let newArticle = document.getElementById("newArt")
newArticle.addEventListener("click", (event) => {
  cleanArtForm()
  const button = document.getElementById("art-submit")
  button.value = "Cargar"
  editingArt(false)
  modalArt.style.display = "flex"
})

//Cargo los el id del articulo a editar y quito el required del image del form
function editingArt(bool) {
  const image = document.getElementById("routeImageArt")
  editArticulo = bool
  if (bool) {
    image.required = false
  } else {
    image.required = true
  }

}


//#endregion MODAL ARTICULO


//funcion para ordenar los articulos
let selectOrder = document.getElementById("order-by")
selectOrder.addEventListener("change", (evt) => {
  hideOrderIcons()
  addArticles(orderBy(arts, selectOrder.value))
})


//Eliminar Articulos.
function deleteArt(id) {
  let arti = arts.find(art => art._id === id)
  let borrar = arts.findIndex(art => art._id === id)

  showQuestion("Quiere borrar el articulo", `${arti.title} `, async () => {
    if (borrar !== -1) {
      try {
        const delProd = await callApiPrivate(`/product/${id}`, "delete")
        if (delProd.status === 200) {
          showAlert(`${arti.title}`, delProd.response.data, "sus")
          obtenerTodosLosArticulos()
        }
      } catch (error) {
        console.log(error)
        showAlert("Articulo Eliminado", `${error.response.data}`, "err")
      }
      obtenerTodosLosArticulos()
    }
  }, () => {
  })


}





//#endregion ARTICULOS TAB1

/* END CODIGO MANEJAR LA TAB ARTICULOS */



/*  ===================================================================================================================================  */



/* CODIGO MANEJAR LA TAB2 USUARIOS */

//#region USUARIOS TAB2

//CARGAR LISTADO DE USUARIOS


usrSearchFilter = users

//Cargar listado de usuarios
function addUsers(users) {
  const t2 = document.getElementById("listUsr")
  t2.innerHTML = ""

  users.forEach(usr => {

    const divRow = document.createElement('div')
    divRow.className = 'fullRow'

    const divPic = document.createElement('div')
    divPic.className = 'fullRow__user-pic'

    const img = document.createElement('img')
    img.src = `/assets/img/avatar/${usr.img}`
    const divDesc = document.createElement('div')
    divDesc.className = 'fullRow__description'
    divDesc.innerHTML = usr.name

    const divMail = document.createElement('div')
    divMail.className = 'fullRow__email'
    divMail.innerHTML = usr.mail

    const divRole = document.createElement('div')
    divRole.className = 'fullRow__role'
    divRole.innerHTML = usr.role

    const buttonsContainer = document.createElement('div')
    buttonsContainer.classList.add('buttons-containter')

    const editButton = document.createElement('button')
    editButton.classList.add('btn', 'buttons-containter__edit')
    editButton.innerHTML = '<i class="fa-solid fa-pen"></i> Editar'
    editButton.setAttribute('onclick', `editUser(${usr._id})`)

    const deleteButton = document.createElement('button')
    deleteButton.classList.add('btn', 'buttons-containter__delete')
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i> Borrar'
    deleteButton.setAttribute('onclick', `deleteUser("${usr._id}")`)

    /* const wishButton = document.createElement('button')
    wishButton.classList.add('btn', 'buttons-containter__wishlist')
    wishButton.innerHTML = '<i class="fa-solid fa-heart"></i> Wish List'
    wishButton.setAttribute('onclick', `wishlist(${usr._id})`) */

    /* const cartButton = document.createElement('button')
    cartButton.classList.add('btn', 'buttons-containter__cart')
    cartButton.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> Cart'
    cartButton.setAttribute('onclick', `cart(${usr._id})`) */

    const ordersButton = document.createElement('button')
    ordersButton.classList.add('btn', 'buttons-containter__order')
    ordersButton.innerHTML = '<i class="fa-solid fa-list"></i> Orders'
    ordersButton.setAttribute('onclick', `cargarOrdenesUsuarios('${usr.mail}')`)

    //buttonsContainer.appendChild(wishButton)
    //buttonsContainer.appendChild(cartButton)
    buttonsContainer.appendChild(ordersButton)
    buttonsContainer.appendChild(editButton)
    buttonsContainer.appendChild(deleteButton)

    divPic.appendChild(img)

    divRow.appendChild(divPic)
    divRow.appendChild(divDesc)
    divRow.appendChild(divMail)
    divRow.appendChild(divRole)
    divRow.appendChild(buttonsContainer)

    t2.appendChild(divRow)

  })
}

//Event Listener order users
//let orderUsers = document.getElementById("order-by-usr")
//orderUsers.addEventListener("change", (evt) => {
//  addUsers(orderByUsers(usrSearchFilter, orderUsers.value))
//})


const searchButtonOrder = document.getElementById("search-button-order")
searchButtonOrder.addEventListener("click", async (evt) => {
  var mail = document.getElementById("search-input").value
  cargarOrdenesUsuarios(mail)
})


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

async function cargarOrdenesUsuarios(mail) {
  let consulta = await callApiPrivate(`/api/order/getuser/${mail}`, 'get')
  renderOrders(consulta.orders)
  openTab("", 'tab3')
}

//funcion para cargar renderisar usuarios segun termino de busqueda
let searchButtonUsr = document.getElementById("search-button-user")
searchButtonUsr.addEventListener("click", async (evt) => {

  const busqueda = document.getElementById("search-input-user").value
  let resultado = document.getElementById("listUsr").innerHTML

  if (busqueda) {
    try {
      usrSearchFilter = await callApiPrivate(`api/user/${busqueda}`, 'get')
    } catch (error) {
      console.log("ERRRRROOROROORORR")
      resultado = 'No se encontraron usuarios con el termino de busqueda'
    }
  } else {
    obtenerTodosLosUsers()
  }

  if (usrSearchFilter.users) {
    addUsers(usrSearchFilter.users)
  } else {
    resultado = 'No se encontraron usuarios con el termino de busqueda'
  }


})


//Funcion para eliminar usuarios
async function deleteUser(id) {
  let token = localStorage.getItem('tkn')
  let user = JSON.parse(localStorage.getItem('user'))

  if (token && user) {
    try {
      const headers = {
        Authorization: token
      }
      const body = {
        user: user._id,
      }
      const respuesta = await axios.delete(`/user/${id}`, { headers, data: body })
    } catch (error) {
    }
  } else {
  }

}

let registerCancel = document.getElementById("register-submit")
registerCancel.addEventListener("click", (evt) => {
  modalUsers.style.display = "none"
})

let newusr = document.getElementById("new-usr")
newusr.addEventListener("click", (evt) => {
  const formulario = document.getElementById('register-form-adm');
  for (let i = 0; i < formulario.elements.length - 3; i++) {
    formulario.elements[i].value = '';
  }

  let modal = document.getElementById("modalUser")
  modal.style.display = "flex"
})

const registerFormAdm = document.getElementById("register-form-adm")
registerFormAdm.addEventListener('submit', async (event) => {
  event.preventDefault()
  const elements = event.target.elements

  if (checkPass()) {
    try {
      const newUser = {
        name: elements.name.value,
        mail: elements.mail.value,
        pass: elements.password1.value,
        avatar: '/avatar-default.png',
        age: elements.age.value,
        bornDate: elements.borndate.value,
        country: elements.country.value,
        gender: "" + elements.gender.value,
        therms: elements.therms.checked,
        cart: [],
        wish: [],
        role: 'ROLE_USER'
      }

      const register = await axios.post("/register", newUser)

      if (register.status = 201) {
        showAlert('GRACIAS!!', 'Usuario creado con exito', 'sus')
      } else {
        showAlert('GRACIAS!!', register.msg, 'err')
      }

    } catch (err) {
      err.response.status = 401 ?
        showAlert('Error', 'El email ingresado ya existe', 'err') :
        err.response.status = 500 ?
          showAlert('Error', 'Error al crear el usuario', 'err') :
          ""

    }

  }
})


//Filtra todas las ordenes correspondiente a x usuario
async function getOrdersByUser(userId) {
  let orders = await callApiPrivate(`/api/get-orders`, "get")
  renderOrders(orders.order)
}


function quitMailErr() {
  email.classList.remove("err")
}

function quitPassErr() {
  password1.classList.remove("err")
  password2.classList.remove("err")
}
function checkPass() {
  if (password1.value !== password2.value && password1.value !== "" && password2.value !== "") {
    password1.classList.add("err")
    password2.classList.add("err")
    showAlert('Error contraseña', 'Las contraseñas ingresadas no coinciden', 'err')
    return false
  } else {
    return true
  }
}


//#endregion USUARIOS TAB2

/* END CODIGO MANEJAR LA TAB2 USUARIOS */





//Funcion ocultar los iconos de la forma de ordenamiento
function hideOrderIcons() {
  iconAZ.style.display = "none"
  iconZA.style.display = "none"
  icon19.style.display = "none"
  icon91.style.display = "none"

  //iconAZUsr.style.display = "none"
  //iconZAUsr.style.display = "none"
  //icon19Usr.style.display = "none"
  //icon91Usr.style.display = "none"
}



const orderDetail = document.getElementById('tab3')


//Funcion que dibuja las card en el DOM, parametro Array de todos los Articulos 
function addCards(arts, idOrder) {

  if (arts == 0) {

    const title = document.getElementById('title-h1')
    title.innerHTML = 'NO TIENES ORDENES GENERADAS'
  }

  arts.forEach(art => {

    const divRow = document.createElement('div')
    divRow.className = 'row'

    const divPic = document.createElement('div')
    divPic.className = 'row__pic'

    const img = document.createElement('img')
    img.src = `/assets/img/store/${art.img}`

    const divDesc = document.createElement('div')
    divDesc.className = 'row__description'
    divDesc.innerHTML = art.title

    const quantityContainer = document.createElement('div')
    quantityContainer.classList.add('quantity-container')



    const quantityInput = document.createElement('input')
    quantityInput.classList.add('cart-containter__qnty')
    quantityInput.setAttribute('value', art.quantity)
    quantityInput.setAttribute('readonly', true)

    quantityContainer.appendChild(quantityInput)

    const divPartialAmount = document.createElement('div')
    divPartialAmount.className = 'row__partial-amount'
    divPartialAmount.innerHTML = formatCurrency(art.quantity * art.price)

    divPic.appendChild(img)
    divRow.appendChild(divPic)
    divRow.appendChild(divDesc)
    divRow.appendChild(quantityContainer)
    divRow.appendChild(divPartialAmount)

    const rowOrder = document.getElementById(`order${idOrder}`)

    rowOrder.appendChild(divRow)
  })



}

let orderCancel = document.getElementById("order-cancel")
orderCancel.addEventListener("click", (evt) => {
  modalOrder.style.display = "none"
})

/* let orderForm = document.getElementById("order-form")
orderCancel.addEventListener("click", (evt) => {
  hideModalOrder()
}) */


function hideModalOrder() {
  setTimeout(() => {
    modalOrder.style = ""
    modalOrder.style.display = "none"
  }, 300)
  modalOrder.style.animation = "hide-modal 0.3s ease-out forwards"
}


async function editOrder(id) {
  modalOrder.style.display = "flex"
  modalOrder.style.animation = "drop-modal 0.3s ease-out forwards"

  let idOr = document.getElementById("id-order")
  idOr.value = id
}

async function editUser(id) {
  modalUser.style.display = "flex"
  modalUser.style.animation = "drop-modal 0.3s ease-out forwards"

  let idUsr = document.getElementById("id-user")
  idUsr.value = id
}



const formOrder = document.getElementById("order-form")
formOrder.addEventListener("submit", async (evt) => {
evt.preventDefault()
const elements = evt.target.elements


  if (elements.orderStatus.value === 'ELIMINAR') {
    showQuestion("Quiere borrar la orden", `${elements.idOrder.value} `, async () => {
      try {
        let order = await callApiPrivate(`/api/order/delete/${elements.idOrder.value}`, 'delete')
        showAlert(`${order.title}`, order, "sus")
        hideModalOrder()
        getAllOrders()
      } catch (error) {
        console.log(error)
        showAlert("Error al eliminar la orden", `${error.response.data}`, "err")
      }
    }, () => {
    })

  } else {
    try {
      obj = {
        id: elements.idOrder.value,
        status: elements.orderStatus.value,
      }
      let order = await callApiPrivate('/api/order/status', 'put', obj)
      showAlert("Editar orden", order.msg, "sus")
      hideModalOrder()
      getAllOrders()
    } catch (err) {
      showAlert("Editar orden ERROR", err, "err")
    }
  }
  })

  const formUser = document.getElementById("user-form")
  formUser.addEventListener("submit", async (evt) => {
    evt.preventDefault()
    const elements = evt.target.elements 

    console.log(elements)
    let order = await callApiPrivate(`/api/user/role/${elements.idRoll.value}`, 'put')

    console.log(order)
  })




