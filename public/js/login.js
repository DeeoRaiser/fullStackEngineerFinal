logout()

const users = JSON.parse(localStorage.getItem("users")) || []
const loginForm = document.getElementById("login-form")
const { email, password } = loginForm.elements

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault()

  try {

    const data = {
      email: loginForm.elements.email.value,
      pass: loginForm.elements.password.value
    }

    const resp = await axios.post("/api/login", data)
    const { token, user, msg } = resp.data

    showAlert('LOGIN CORRECTO', `Bienvenido ${user.name.split(" ")[0]}`, 'sus')
    localStorage.setItem('tkn', token)

    console.log(resp.data.user)
    localStorage.setItem('user', JSON.stringify(resp.data.user))

    setTimeout(() => {
      window.location.href = "/"
    }, 3000)


  } catch (err) {
    const msg = JSON.parse(err.request.response)
    console.log(msg)
    showAlert('ERROR', `${msg.msg}`, 'err')
  }

})

function logout() {
  localStorage.removeItem("tkn")
  let h = document.getElementsByClassName("user-navbar")
  h[0].innerHTML = ""
  let h2 = document.getElementsByClassName("user-navbar2")
  h2[0].innerHTML = ""

  localStorage.clear()

}
