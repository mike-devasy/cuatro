/** @format */

const testimonialsData = [
  {
    text: `"At Nightrush, we've had the privilege of working with Boomerang Partners on various innovative and performance-driven initiatives. Their team consist... t Nightrush, we've had the privilege of working with Boomerang Partners on various innovative and performance-driven initiatives. Their team consist..."`,
    name: "nightrush",
    logo: "./images/testimonials/favorite.svg",
  },
  {
    text: `"We have been working with Boomerang for many years. Boomerang partners are among our favorite partners. They have some excellent brands in their port..."`,
    name: "cryptocasinos24",
    logo: "./images/testimonials/favorite.svg",
  },
  {
    text: `"We're really happy teaming up with Boomerang Partners. They're super reliable and one of the market leaders. Their brands totally convert great with ..."`,
    name: "topcashbackcasinosa",
    logo: "./images/testimonials/favorite.svg",
  },
  {
    text: `"Their team is responsive and always ready to help. A fantastic partner to work with!"`,
    name: "kasynopolska10",
    logo: "./images/testimonials/favorite.svg",
  },
  {
    text: `"We value this partnership and appreciate the communication, support and strong business results. Happy to recommend them."`,
    name: "partnername",
    logo: "./images/testimonials/favorite.svg",
  },
]
function showMore() {
  const blocks = document.querySelectorAll("[data-fls-showmore]")

  if (!blocks.length) return

  const getHiddenHeight = (content) => {
    const cssHeight =
      getComputedStyle(content).getPropertyValue("--showmore-height")
    const parsedCssHeight = parseFloat(cssHeight)

    if (parsedCssHeight) return parsedCssHeight

    return Number(content.dataset.flsShowmoreContent) || 200
  }

  const initBlock = (block) => {
    const content = block.querySelector("[data-fls-showmore-content]")
    const button = block.querySelector("[data-fls-showmore-button]")

    if (!content || !button) return

    const hiddenHeight = getHiddenHeight(content)

    content.style.height = "auto"

    const fullHeight = content.scrollHeight
    const hasOverflow = fullHeight > hiddenHeight + 1

    if (!hasOverflow) {
      button.hidden = true
      content.style.height = "auto"
      block.classList.remove("--showmore-active")
      block.classList.remove("has-showmore")
      return
    }

    button.hidden = false
    block.classList.add("has-showmore")

    content.style.height = block.classList.contains("--showmore-active")
      ? `${fullHeight}px`
      : `${hiddenHeight}px`
  }

  blocks.forEach(initBlock)

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-fls-showmore-button]")

    if (!button) return

    event.preventDefault()
    event.stopPropagation()

    const block = button.closest("[data-fls-showmore]")
    const content = block?.querySelector("[data-fls-showmore-content]")

    if (!block || !content) return

    const hiddenHeight = getHiddenHeight(content)
    const isActive = block.classList.toggle("--showmore-active")

    content.style.height = isActive
      ? `${content.scrollHeight}px`
      : `${hiddenHeight}px`
  })

  window.addEventListener("resize", () => {
    document.querySelectorAll("[data-fls-showmore]").forEach(initBlock)
  })
}
export function initTestimonialsSlider() {
  const track = document.querySelector("[data-testimonials-track]")
  const prevBtn = document.querySelector("[data-testimonials-prev]")
  const nextBtn = document.querySelector("[data-testimonials-next]")

  if (!track || !prevBtn || !nextBtn) return

  let currentIndex = 0
  let step = 0
  let maxIndex = 0

const createCard = ({ text, name, logo }) => {
  const card = document.createElement("article")
  card.className = "testimonials__card"

 card.innerHTML = `
  <div data-fls-showmore class="testimonials__showmore">
    <div
      data-fls-showmore-content
      class="testimonials__quote-wrap"
    >
      <p class="testimonials__quote">${text}</p>
    </div>

    <button
      hidden
      data-fls-showmore-button
      type="button"
      class="testimonials__more"
    >
      <span>More</span>
      <span>Less</span>
    </button>
  </div>

  <div class="testimonials__author">
    <img class="testimonials__logo" src="${logo}" alt="" loading="lazy">
    <span class="testimonials__name">${name}</span>
  </div>
`

  return card
}

  const renderCards = () => {
    const fragment = document.createDocumentFragment()

    testimonialsData.forEach((item) => {
      fragment.append(createCard(item))
    })

    track.append(fragment)
  }

  const updateSizes = () => {
    const cards = track.querySelectorAll(".testimonials__card")
    const firstCard = cards[0]

    if (!firstCard) return

    const cardWidth = firstCard.offsetWidth
    const gap = parseFloat(getComputedStyle(track).gap) || 0
    const viewportWidth = track.parentElement.offsetWidth
    const trackWidth = track.scrollWidth

    step = cardWidth + gap
    maxIndex = Math.max(0, Math.ceil((trackWidth - viewportWidth) / step))

    currentIndex = Math.min(currentIndex, maxIndex)

    updateSlider()
  }

  const updateSlider = () => {
    track.style.transform = `translateX(${-currentIndex * step}px)`

    prevBtn.disabled = currentIndex === 0
    nextBtn.disabled = currentIndex >= maxIndex
  }

  prevBtn.addEventListener("click", () => {
    if (currentIndex <= 0) return

    currentIndex -= 1
    updateSlider()
  })

  nextBtn.addEventListener("click", () => {
    if (currentIndex >= maxIndex) return

    currentIndex += 1
    updateSlider()
  })
let startX = 0
let currentX = 0
let isDragging = false

const isSwipeEnabled = () => window.innerWidth <= 1024

const onTouchStart = (event) => {
  if (!isSwipeEnabled()) return

  startX = event.touches[0].clientX
  currentX = startX
  isDragging = true

  track.style.transition = "none"
}

const onTouchMove = (event) => {
  if (!isDragging || !isSwipeEnabled()) return

  currentX = event.touches[0].clientX

  const diff = currentX - startX
  const baseTranslate = -currentIndex * step

  track.style.transform = `translate3d(${baseTranslate + diff}px, 0, 0)`
}

const onTouchEnd = () => {
  if (!isDragging || !isSwipeEnabled()) return

  isDragging = false

  const diff = currentX - startX
  const swipeLimit = 50

  track.style.transition = "transform 0.45s ease"

  if (diff < -swipeLimit && currentIndex < maxIndex) {
    currentIndex += 1
  }

  if (diff > swipeLimit && currentIndex > 0) {
    currentIndex -= 1
  }

  updateSlider()
}

track.addEventListener("touchstart", onTouchStart, { passive: true })
track.addEventListener("touchmove", onTouchMove, { passive: true })
track.addEventListener("touchend", onTouchEnd)
track.addEventListener("touchcancel", onTouchEnd)
  window.addEventListener("resize", updateSizes)

	renderCards()
	showMore()
  updateSizes()
}

// document.addEventListener("DOMContentLoaded", initTestimonialsSlider)
