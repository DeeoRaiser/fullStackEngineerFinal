
//Funcion que crea la alerta en el DOM
function createAlert() {
    const container = document.createElement("div")
    container.id = "alertContainer"
    container.classList.add("alert", "alert__hide")

    // Crear elemento de alerta
    const alertElement = document.createElement("div")
    alertElement.classList.add("alert__error")
    alertElement.id = "alert"

    // Crear título de alerta
    const titleElement = document.createElement("p")
    titleElement.classList.add("alert__title")
    titleElement.id = "alert__title"
    alertElement.appendChild(titleElement)

    // Crear descripción de alerta
    const descriptionElement = document.createElement("p")
    descriptionElement.classList.add("alert__description")
    descriptionElement.id = "alert__description"
    alertElement.appendChild(descriptionElement)

    // Crear botón de cerrar
    const closeButton = document.createElement("div")
    closeButton.classList.add("alert__button")
    closeButton.id = "alert__button"
    closeButton.addEventListener("click", hideAlert)

    const iconElement = document.createElement("i")
    iconElement.classList.add("fas", "fa-times")
    closeButton.appendChild(iconElement)

    // Agregar botón de cerrar al elemento de alerta
    alertElement.appendChild(closeButton)

    // Agregar elemento de alerta al contenedor principal
    container.appendChild(alertElement)

    // Agregar contenedor principal al cuerpo del documento
    document.body.appendChild(container)
}

//Funcion que muestra la alerta creada
function showAlert(title, message, tipo = "suc") {
    createAlert()

    _alert = document.getElementById('alert')
    _alert.classList.remove('alert__error')
    _alert.classList.remove('alert__sussecs')

    tipo == 'err' ?
        _alert.classList.add('alert__error') :
        _alert.classList.add('alert__sussecs')

    document.getElementById('alert__title').innerHTML = title
    document.getElementById('alert__description').innerHTML = message
    document.getElementById('alertContainer').classList.remove('alert__hide')

    setTimeout(hideAlert, 2800)
}

//Funcion que oculta la alerta
function hideAlert() {
    document.getElementById('alertContainer').classList.add('alert__hide')
    setTimeout(deleteAlert, 100)
}

//Funcion que borra el alerta del DOM
function deleteAlert() {
    document.getElementById('alertContainer').remove()
}


// Función que muestra el modal con los botones "Sí" y "No"
function showQuestion(title, message, yesCallback, noCallback) {
    // Crear el elemento modal
    const modal = document.createElement("div")
    modal.id = ""
    modal.classList.add("modalQuestion")

    // Crear el contenido del modal
    const modalContenido = document.createElement("div")
    modalContenido.classList.add("modalQuestion__contenido")

    // Crear el mensaje dentro del contenido
    const tit = document.createElement("p")
    tit.classList.add("modalQuestion__title")
    tit.textContent = title;
    modalContenido.appendChild(tit);

    // Crear el mensaje dentro del contenido
    const mensaje = document.createElement("p")
    mensaje.classList.add("modalQuestion__text")
    mensaje.innerHTML = message;
    modalContenido.appendChild(mensaje);

    // Crear los botones dentro del contenido
    const botones = document.createElement("div")
    botones.classList.add("modalQuestion__buttons")


    const botonSi = document.createElement("div");
    botonSi.classList.add("modalQuestion__button-ok","button__ok")
    botonSi.textContent = "Sí"
    botonSi.addEventListener("click", function () {
        yesCallback()
        closeQuestion(modal)
    });
    botones.appendChild(botonSi)

    const botonNo = document.createElement("div")
    botonNo.classList.add("modalQuestion__button-cancel","button__cancel")
    botonNo.textContent = "No"
    botonNo.addEventListener("click", function () {
        noCallback()
        closeQuestion(modal)
    });
    botones.appendChild(botonNo)

    modalContenido.appendChild(botones)

    modal.appendChild(modalContenido)

    // Agregar el modal a la página
    document.body.appendChild(modal)
}

// Función que cierra el modal y lo elimina de la página
function closeQuestion(modal) {
    document.body.removeChild(modal)
}