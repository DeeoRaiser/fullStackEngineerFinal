let user = ''

loadData()


//Funcion que carga los datos del perfil del usuario.
async function loadData() {
  user = await callApiPrivate("/api/profile", "get")

  localStorage.setItem('user', JSON.stringify(user.user))
  
  var username = document.getElementById("user-name")
  var email = document.getElementById("user-email")
  var bDate = document.getElementById("user-born-date")
  var gender = document.getElementById("user-gender")
  var country = document.getElementById("user-country")
  var titleCard = document.getElementsByClassName("user-title")[0]
  var avatar = document.getElementById("avatar")
  avatar.src = `/assets/img/avatar/${user.user.img}`
  username.innerText = user.user.name
  email.innerText = user.user.mail
  bDate.innerText = user.user.bornDate
  gender.innerText = checkGender(user.user.gender)
  country.innerText = countryName(user.user.country)
  titleCard.innerText = user.user.name

  var username2 = document.getElementById("user-name2")
  var email2 = document.getElementById("user-email2")
  var bDate2 = document.getElementById("user-born-date2")
  var gender2 = document.querySelector(`input[type="radio"][value="${user.user.gender}"]`) //============  ver esto ==========================
  var country2 = document.getElementById("user-country2")
  var avatar2 = document.getElementById("avatar-container2")

  username2.value = user.user.name
  email2.value = user.user.mail
  bDate2.value = user.user.bornDate
  gender2.checked = user.user.gender
  country2.value = user.user.country

  var avatar2 = document.getElementById("avatar2")
  avatar2.onerror = loadAvatarProfileError
  avatar2.src = `/assets/img/avatar/${user.user.img}`

  renderUserMenu()
}

let avatar = document.getElementById("routeImageUser")
avatar.addEventListener("change", (evt) => {
  let pic = document.getElementById("avatar2")
  const urlFile = URL.createObjectURL(evt.target.files[0])
  pic.src = urlFile
})


//Escucho el evento submit del formulario de actualizacion
var form = document.getElementById("profile-form")
form.addEventListener('submit', async (event) => {
  event.preventDefault()

  let upUsr = ''
  const formData = new FormData(event.target)
  var fileInput = document.getElementById('routeImageUser');

  //Si hay una imagen en el formulario envio la imagen, sino envio el resto de la data
  if (fileInput.files.length > 0) {
    upUsr = await callApiPrivate('/user/profile/image', 'put', formData)
  } else {


    try {
      const updateUser = {
        name: formData.getAll('usrname')[0],
        mail: formData.getAll('mail')[0],
        bornDate: formData.getAll('borndate')[0],
        country: formData.getAll('country')[0],
        gender: formData.getAll('gender')[0]
      }
      upUsr = await callApiPrivate('/user/profile', 'put', updateUser)

      hideModal()
      loadData()

    } catch (error) {
      showAlert('Error',error, 'err')
    }

  }
})


//Muestro el modal y manejo los para cerrarlo
function showModal(cmp) {
  hideElement(cmp)

  var modal = document.getElementById("modal")
  modal.style.display = "flex"
  modal.style.animation = "drop-modal 0.3s ease-out forwards"

  //evento boton cancel
  var cancel = document.getElementById("cancel")
  cancel.onclick = function () {
    setTimeout(function () {
      modal.style.display = "none"
    }, 300)
    modal.style.animation = "hide-modal 0.3s ease-out forwards"
  }

  //evento boton close
  var close = document.getElementsByClassName("close")[0]
  close.onclick = function () {
    hideModal()
    loadData()
  }
}

//Cierra el modal
function hideModal() {
  setTimeout(() => {
    modal.style.display = "none"
  }, 300)
  modal.style.animation = "hide-modal 0.3s ease-out forwards"
}

//OCULTO TODOS LOS CONTROLES DEL FORM MENOS EL ENVIADO Y APLICO EL REQUIRED
function hideElement(cmp) {

  const editName = document.getElementById("name-container")
  const editMail = document.getElementById("mail-container")
  const editBorn = document.getElementById("born-container")
  const editCountry = document.getElementById("born-country-container")
  const editGender = document.getElementById("gender-container")
  const editPassword1 = document.getElementById("pass-1")
  const editPassword2 = document.getElementById("pass-2")
  const editPassword3 = document.getElementById("pass-3")
  const avatar = document.getElementById("avatar-container2")

  editName.style.display = "none"
  editMail.style.display = "none"
  editBorn.style.display = "none"
  editCountry.style.display = "none"
  editGender.style.display = "none"
  editPassword1.style.display = "none"
  editPassword2.style.display = "none"
  editPassword3.style.display = "none"
  avatar.style.display = "none"


  editName.querySelector("input").required = false
  editMail.querySelector("input").required = false
  editGender.querySelector("input").required = false
  editBorn.querySelector("input").required = false
  editCountry.querySelector("select").required = false
  editPassword1.querySelector("input").required = false
  editPassword2.querySelector("input").required = false
  editPassword3.querySelector("input").required = false
  avatar.querySelector("input").required = false


  if (cmp === 'name') {
    editName.style.display = "block"
    editName.querySelector("input").required = true
  } if (cmp === 'mail') {
    editMail.style.display = "block"
    editMail.querySelector("input").required = true
  } if (cmp === 'gender') {
    editGender.style.display = "block"
    editGender.querySelector("input").required = true
  } if (cmp === 'bornDate') {
    editBorn.style.display = "block"
    editBorn.querySelector("input").required = true
  } if (cmp === 'country') {
    editCountry.style.display = "block"
    editCountry.querySelector("select").required = true
  } if (cmp === 'pass') {
    editPassword1.style.display = "block"
    editPassword2.style.display = "block"
    editPassword3.style.display = "block"

    editPassword1.querySelector("input").required = true
    editPassword2.querySelector("input").required = true
    editPassword3.querySelector("input").required = true
  }
  if (cmp === 'avatar') {
    avatar.style.display = "flex"
    avatar.querySelector("input").required = true
  }
}

//Retorno el genero en formato texto
function checkGender(gender) {
  if (parseInt(gender) === 1) {
    return "Masculino"
  } else if (parseInt(gender) === 0) {
    return "Femenino";
  } else if (parseInt(gender) === 2) {
    return "Otro";
  }
}

function changePass(info) {
  var pass1 = info.password.value
  var pass2 = info.password2.value
  var pass3 = info.password3.value
}


//carga la imagen por defecto e caso que no encuentre la que cargo el usuario
function loadAvatarProfileError() {
  const avatar = document.getElementById("avatar-container2")
  const avatar2 = document.getElementById("avatar")
  avatar.src = '/assets/img/avatar/avatar-default.png'
  avatar2.src = '/assets/img/avatar/avatar-default.png'
}

