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






