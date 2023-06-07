
const registerForm = document.getElementById("register-form")

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    const elements = event.target.elements

    try {
        const newUser = {
            name: elements.name.value,
            mail: elements.mail.value,
            pass: elements.password1.value,
            img: 'avatar-default.png',
            age: elements.age.value,
            bornDate: elements.borndate.value,
            country: elements.country.value,
            gender: "" + elements.gender.value,
            therms: elements.therms.checked,
            cart: [],
            wish: [],
            role: ''
        }

        const register = await axios.post("/register", newUser)

        if (register.status = 201) {
            showAlert('GRACIAS!!', 'Por registrarte, te llevaremos al portal de ingreso', 'sus')

            setTimeout(()=>{
                window.location.href= "/login"
            },2800)
        }



    } catch (err) {
        console.log(err)
        err.response.status = 401 ?
            showAlert('Error', 'El email ingresado ya existe', 'err') :
            err.response.status = 500 ?
                showAlert('Error', 'Error al crear el usuario', 'err') :
                ""

    }

})

function redir() {
    window.location.href = "/pages/login/login.html"
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