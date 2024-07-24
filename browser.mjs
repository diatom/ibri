import * as p from 'https://cdn.jsdelivr.net/npm/@mitranim/js@0.1.25/prax.mjs'
const {E} = p.Ren.native()
console.log(`Hello, welcome to the website of the Ibri carbonated drinks brand.
The site was made by Severin B. https://sirseverin.ru/
༼ つ ◕_◕ ༽つ



██████╗░██████╗░██╗███╗░░██╗██╗░░██╗  ██╗██████╗░██████╗░██╗
██╔══██╗██╔══██╗██║████╗░██║██║░██╔╝  ██║██╔══██╗██╔══██╗██║
██║░░██║██████╔╝██║██╔██╗██║█████═╝░  ██║██████╦╝██████╔╝██║
██║░░██║██╔══██╗██║██║╚████║██╔═██╗░  ██║██╔══██╗██╔══██╗██║
██████╔╝██║░░██║██║██║░╚███║██║░╚██╗  ██║██████╦╝██║░░██║██║
╚═════╝░╚═╝░░╚═╝╚═╝╚═╝░░╚══╝╚═╝░░╚═╝  ╚═╝╚═════╝░╚═╝░░╚═╝╚═╝


█▀▄▀█ ▄▀█ █▄▀ █▀▀   █░░ █▀█ █░█ █▀▀
█░▀░█ █▀█ █░█ ██▄   █▄▄ █▄█ ▀▄▀ ██▄
`)

// Menu
document.addEventListener('DOMContentLoaded', function() {
  const menuIcon = document.querySelector('menu')
  const mobileMenu = document.querySelector('mobilemenu')
  menuIcon.addEventListener('click', function() {
    if (mobileMenu.style.display === 'flex') {
      mobileMenu.style.display = 'none'
    } else {
      mobileMenu.style.display = 'flex'
    }
  })
  mobileMenu.addEventListener('click', function(e) {
    if (e.target === mobileMenu) {
      mobileMenu.style.display = 'none'
    }
  })
  document.addEventListener('click', function(e) {
    if (mobileMenu.style.display === 'flex' && e.target !== mobileMenu && !menuIcon.contains(e.target)) {
      mobileMenu.style.display = 'none'
    }
  })
})

// Popup image
const images = document.querySelectorAll('article img, .cockt img, .spoiler img')
const popup = document.getElementById('popup')
const popupImage = document.getElementById('popupImage')
const closeBtn = document.getElementById('closeBtn')

images.forEach(image => {
  image.addEventListener('click', () => {
      popupImage.src = image.src
      popup.style.display = 'flex'
  })
})
closeBtn.addEventListener('click', () => {
    popup.style.display = 'none'
})
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    popup.style.display = 'none'
  }
})
popup.addEventListener('click', (e) => {
    if (e.target === popup) {
        popup.style.display = 'none'
    }
})


// Tags button
if (window.location.pathname.startsWith('/post') || window.location.pathname === ('/mixology')) {
  document.addEventListener('DOMContentLoaded', function() {
    const tagsContainer = document.querySelector('tags')
    const buttons = tagsContainer.querySelectorAll('button[type="button"]')
    const blogDivs = document.querySelectorAll('.filter, .cockt')
    const activeTags = new Set()

    buttons.forEach(button => {
      button.addEventListener('click', function() {
        const buttonTag = this.innerText.trim().toLowerCase()

        if (activeTags.has(buttonTag)) {
          activeTags.delete(buttonTag)
        } else {
          activeTags.add(buttonTag)
        }

        blogDivs.forEach(div => {
          const divButtons = div.querySelectorAll('arttags button[type="button"]')
          const divTags = Array.from(divButtons).map(btn => btn.innerText.trim().toLowerCase())

          const shouldShow = Array.from(activeTags).every(tag => divTags.includes(tag))

          if (shouldShow) {
            div.style.display = 'block'
          } else {
            div.style.display = 'none'
          }
        })
      })
    })
  })

  document.addEventListener(`DOMContentLoaded`, function() {
    var buttons = document.querySelectorAll(`.btn`)

    buttons.forEach(function(button) {
      button.addEventListener(`click`, function() {
        button.classList.toggle(`active`)
      })
    })
  })
}

// Product press cocktails
document.addEventListener('DOMContentLoaded', function() {
  const cocktButtons = document.querySelectorAll('.a-cockt')
  cocktButtons.forEach(button => {
    button.addEventListener('click', function() {
      const buttonId = this.id
      localStorage.setItem('buttonToPress', buttonId)
      window.location.href = '/mixology'
    })
  })
})
document.addEventListener('DOMContentLoaded', function() {
  const buttonToPressId = localStorage.getItem('buttonToPress')
  if (buttonToPressId) {
    const buttonToPress = document.getElementById(buttonToPressId)
    if (buttonToPress) {
      buttonToPress.click()
    }
    localStorage.removeItem('buttonToPress')
  }
})

// Search
if (window.location.pathname === `/mixology`) {
  const searchInput = document.getElementById(`searchInput`)
  const searchButton = document.getElementById(`searchButton`)

  function searchDataBook(input) {
    const divs = document.getElementsByClassName(`cockt`)
    for (const elem of divb) {
      let result = elem.innerHTML.toLowerCase().includes(input)
      if (result) {
        elem.hidden = false
      } else {
        elem.hidden = true
      } 
    }
  }
  searchButton.addEventListener(`click`, () => {
    const userInput = searchInput.value.toLowerCase()
    searchDataBook(userInput)
  })

  // Enter click
  document.addEventListener(`keydown`, function(event) {
    if (event.key === `Enter`) {
        document.getElementById(`searchButton`).dispatchEvent(new Event(`click`))
        event.preventDefault()
    }
  })
}

// Spoiler 
if (window.location.pathname === `/mixology`) {
  document.querySelectorAll('.spoiler-header').forEach(header => {
    header.addEventListener('click', () => {
      header.classList.toggle('active')
      const content = header.nextElementSibling
      if (content.style.display === 'block') {
        content.style.display = 'none'
        header.querySelector('.toggle-icon').textContent = '▶'
      } else {
        content.style.display = 'block'
        header.querySelector('.toggle-icon').textContent = '▼'
      }
    })
  })
}
