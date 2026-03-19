/** @format */

export function initHeaderHide() {
  const header = document.querySelector(".header")
  const targetButtons = document.querySelector(".benefits__buttons")
  if (!header || !targetButtons) return
  const options = {
    root: null,  
    threshold: 0.9,  
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        header.classList.add("--header-hide")
      } else {
        header.classList.remove("--header-hide")
      }
    })
  }, options)

  observer.observe(targetButtons)
}

 