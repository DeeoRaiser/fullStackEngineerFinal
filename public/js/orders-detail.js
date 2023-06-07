var row = document.getElementsByClassName('row-cart-detail')

var user = JSON.parse(localStorage.getItem("user")) || []


//cargo las ordenes al array segun usuario logeado
getOrdersByUser(user)



const divCartDetail = document.getElementById('row-order-detail')


//Filtra todas las ordenes correspondiente a x usuario
async function getOrdersByUser(userId) {
    let orders = await callApiPrivate(`/api/get-order-by-user/${userId._id}`, "get")
    renderOrders(orders.order)

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
        
        const viewDetail = document.createElement('div')
        viewDetail.className = 'button__ok'
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




