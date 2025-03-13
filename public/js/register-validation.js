const registerForm = document.getElementById('registerForm')
const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')

let usernamePattern = /[a-z0-9._!#$&+-/=?^'|~]{2,}/i
let passwordPattern = /[a-z0-9._!#$&+-/=?^'|~]{8,}/i

registerForm.addEventListener('submit', (event) => {
    console.log("FORM SUBMITTED!")
    let validData = testValidations()
    if(validData){
        // Let it post
    } else {
        event.preventDefault()
    }
});

function testValidations(){
    let isValid = false

    let usernameIsValid = usernamePattern.test(usernameInput.value)
    let passwordIsValid = passwordPattern.test(passwordInput.value)

    isValid = usernameIsValid && passwordIsValid
    addInvalidClass(usernameIsValid, passwordIsValid)
    return isValid
}

function addInvalidClass(usernameValid, passwordValid) {
    removeInvalidClass()
    if(!usernameValid) {
        usernameInput.classList.add('invalidInput')
        usernameError.hidden = false
    } if(!passwordValid) {
        passwordInput.classList.add('invalidInput')
        passwordError.hidden = false
    }
}

function removeInvalidClass(){
    usernameInput.classList.remove('invalidInput')
    usernameError.hidden = true
    passwordInput.classList.remove('invalidInput')
    passwordError.hidden = true
}