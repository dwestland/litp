const sendForm = (e) => {
  e.preventDefault()
  const MAILER_URL = 'https://api.westland.net/litp-mailer/'
  // Form constants
  const name = document.getElementById('name').value.trim()
  const phone = document.getElementById('phone').value.trim()
  const email_address = document.getElementById('email_address').value.trim()
  const message = document.getElementById('message').value.trim()
  let price = ''
  if (document.getElementById('price') !== null) {
    price = document.getElementById('price').value
  }
  let time = ''
  if (document.querySelector('input[name="time"]:checked') !== null) {
    time = document.querySelector('input[name="time"]:checked').value
  }
  const now = new Date()
  // Mailgun constants
  const email = `postmaster@mg.westland.net`
  const subject = `LITP WEBSITE MESSAGE from: ${name}`
  const text = (`Message from ${name}
    ${now}
    Name: ${name}
    Email: ${email_address}
    Phone: ${phone}
    Price: ${price}
    Time: ${time}
    Message: ${message}`
  )
  
  // Clear fetch message
  document.getElementById("mailer-message").innerHTML = ""
  
  // Clear form validation
  document.getElementById("name-error").innerHTML = ""
  document.getElementById("phone-email-error").innerHTML = ""
  document.getElementById("phone-error").innerHTML = ""
  document.getElementById("email-error").innerHTML = ""
  
  // Form validation
  let regex = ""
  let isNameValid = false
  let isPhoneOrEmail = false
  let isPhoneValid = true
  let isEmailValid = true

  if(name == "") {
    let message = '&nbsp; Please fill in your name'
    document.getElementById("name-error").innerHTML = message
    isNameValid = false
  } else {
    isNameValid = true
  }

  if((phone != "") || (email_address != "") ) {
    document.getElementById("phone-email-error").innerHTML = ""
    isPhoneOrEmail = true
  
    if(phone != "") {
      regex = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/
      if(regex.test(phone) === false) {
        let message = '&nbsp; Please enter a correct phone number'
        document.getElementById("phone-error").innerHTML = message
        isPhoneValid = false
      } else {
        isPhoneValid = true
      }
    }

    if(email_address != "") {
      regex = /^\S+@\S+\.\S+$/
      if(regex.test(email_address) === false) {
        let message = '&nbsp; Please enter a correct email'
        document.getElementById("email-error").innerHTML = message
        isEmailValid = false
      } else {
        isEmailValid = true
      }
    }
  } else {
    let message = '&nbsp; Please enter phone or email'
    document.getElementById("phone-email-error").innerHTML = message
    isPhoneOrEmail = false
  }
  
  if(isNameValid == false) {
    return false
  }
  if(isPhoneOrEmail == false) {
    return false
  }
  if(isPhoneValid == false){
    return false
  }
  if(isEmailValid == false){
    return false
  }
  // End form validation
  
    fetch(MAILER_URL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        email,
        subject,
        text,
      })
    })
    .then((data) => {
      if(data.status === 200) {
        let message = '<span class="message-success">Message Sent</span>'
        document.getElementById("mailer-message").innerHTML = message
      }
      console.log('success!', data)
    })
    .catch((err) => {
      console.log('error!', err)
      let message = '<span class="message-error">Message Error</span>'
      document.getElementById("mailer-message").innerHTML = message
    })
    messageForm.reset()
}

const messageForm = document.getElementById('message-form')
messageForm.addEventListener('submit', sendForm)
