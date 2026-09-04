const loader = document.querySelector('.loader')

/* ─── Constantes globais ─────────────────────────────────────────────────── */
const WHATSAPP_URL = 'https://wa.me/5548998396012'

/* ─── Botões WhatsApp nos serviços ─────────────────────────────────────── */
document.querySelectorAll('[data-wpp]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    window.open(WHATSAPP_URL, '_blank')
  })
})

/* ─── Botão WhatsApp da última seção ─────────────────────────────────── */
document.querySelectorAll('[data-wpp-target]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    window.open(WHATSAPP_URL, '_blank')
  })
})

window.addEventListener('load', () => {
  document.body.classList.add('is-ready')
  window.setTimeout(() => loader?.remove(), 1250)
})

/* ─── Reveal on scroll ────────────────────────────────────────────────────── */
const revealTargets = document.querySelectorAll(
  '.intro, .section-heading, .project, .services-top, .service-list article, .contact-copy, .contact-image'
)
revealTargets.forEach((element, index) => {
  element.classList.add('reveal')
  element.style.setProperty('--delay', `${index * 90}ms`)
})

const observer = new IntersectionObserver(
  (entries) => entries.forEach(({ isIntersecting, target }) => {
    if (isIntersecting) {
      target.classList.add('in-view')
      observer.unobserve(target)
    }
  }),
  { threshold: 0.14 }
)
revealTargets.forEach((element) => observer.observe(element))

/* ─── Parallax hero image ─────────────────────────────────────────────────── */
const heroImage = document.querySelector('.hero-image img')
const hero = document.querySelector('.hero')

window.addEventListener('scroll', () => {
  if (!hero) return
  const heroHeight = hero.offsetHeight

  if (heroImage && window.scrollY < heroHeight) {
    heroImage.style.transform = `scale(1.07) translateY(${window.scrollY * 0.035}px)`
  }
}, { passive: true })

/* ─── Scroll para centro da seção de destino (botões ↓) ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href')
    if (!id || id === '#') return
    const target = document.querySelector(id)
    if (!target) return

    // Para o link "Iniciar conversa" não interferir (é externo)
    if (link.classList.contains('button') || link.classList.contains('text-link') ||
        link.classList.contains('all-projects') || link.classList.contains('header-contact') ||
        link.classList.contains('brand') || link.classList.contains('circle-link')) {
      // Se for circle-link (seta), faz scroll para o centro da seção
      if (link.classList.contains('circle-link')) {
        e.preventDefault()

        // Caso especial: rolar até o final absoluto da página
        if (link.id === 'scroll-to-bottom') {
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
          return
        }

        // Caso especial: rolar até o topo absoluto (inclui header)
        if (link.id === 'scroll-to-top') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
          return
        }

        const header = document.querySelector('.header')
        const headerH = header ? header.offsetHeight : 0
        const targetTop = target.offsetTop
        const targetHeight = target.offsetHeight
        const viewportHeight = window.innerHeight
        const extra = link.getAttribute('data-offset') || '71'
        const centerScroll = targetTop - (viewportHeight - targetHeight) / 2 - headerH + parseInt(extra)
        window.scrollTo({
          top: centerScroll,
          behavior: 'smooth'
        })
      }
      return
    }
  })
})


const carousel = document.querySelector('.project-grid')
const prevBtn = document.querySelector('.carousel-prev')
const nextBtn = document.querySelector('.carousel-next')

if (carousel && prevBtn && nextBtn) {
  // Retorna o card atualmente centralizado
  function getActiveIndex() {
    const cw = carousel.clientWidth
    const centerX = carousel.scrollLeft + cw / 2
    const cards = Array.from(carousel.querySelectorAll('.project'))
    let activeIdx = 0
    let minDist = Infinity
    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(cardCenter - centerX)
      if (dist < minDist) { minDist = dist; activeIdx = idx }
    })
    return activeIdx
  }

  // Move para um card específico
  function scrollToCard(index) {
    const cards = Array.from(carousel.querySelectorAll('.project'))
    const target = cards[index]
    if (!target) return
    const cw = carousel.clientWidth
    const targetLeft = target.offsetLeft - carousel.offsetLeft
    const targetCenter = targetLeft + target.offsetWidth / 2
    const scrollLeft = targetCenter - cw / 2
    carousel.scrollTo({ left: scrollLeft, behavior: 'smooth' })
  }

  function updateActive() {
    const idx = getActiveIndex()
    const cards = carousel.querySelectorAll('.project')
    cards.forEach((card, i) => {
      card.classList.toggle('is-active', i === idx)
    })
  }

  prevBtn.addEventListener('click', () => {
    const idx = getActiveIndex()
    const total = carousel.querySelectorAll('.project').length
    if (idx === 0) {
      // Loop: vai para o último
      scrollToCard(total - 1)
    } else {
      scrollToCard(idx - 1)
    }
  })

  nextBtn.addEventListener('click', () => {
    const idx = getActiveIndex()
    const total = carousel.querySelectorAll('.project').length
    if (idx === total - 1) {
      // Loop: volta para o primeiro
      scrollToCard(0)
    } else {
      scrollToCard(idx + 1)
    }
  })

  // Atualiza is-active durante o scroll (natural do navegador + clique)
  carousel.addEventListener('scroll', () => {
    // Throttle via rAF
    if (!carousel._raf) {
      carousel._raf = requestAnimationFrame(() => {
        carousel._raf = null
        updateActive()
      })
    }
  }, { passive: true })

  // Inicia centrado na segunda imagem (index 1)
  window.addEventListener('load', () => {
    setTimeout(() => scrollToCard(1), 120)
  })

  // Teclado
  document.addEventListener('keydown', (e) => {
    if (window.innerWidth <= 720) return
    if (e.key === 'ArrowLeft') prevBtn.click()
    if (e.key === 'ArrowRight') nextBtn.click()
  })
}
