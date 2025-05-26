document.addEventListener('DOMContentLoaded', function() {
    // Menu Mobile
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    
    // Mostrar menu
    if(navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }
    
    // Esconder menu
    if(navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }
    
    // Remover menu mobile ao clicar em um link
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    });
    
    // Scroll ativo para seções
    const sections = document.querySelectorAll('section[id]');
    
    function scrollActive() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 50;
            const sectionId = section.getAttribute('id');
            
            if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active');
            } else {
                document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active');
            }
        });
    }
    window.addEventListener('scroll', scrollActive);
    
    // Scroll Up
    function scrollUp() {
        const scrollUp = document.getElementById('scroll-up');
        if(this.scrollY >= 200) {
            scrollUp.classList.add('show-scroll');
        } else {
            scrollUp.classList.remove('show-scroll');
        }
    }
    window.addEventListener('scroll', scrollUp);
    
    // Scroll Reveal Animation
    const sr = ScrollReveal({
        origin: 'top',
        distance: '60px',
        duration: 2500,
        delay: 400,
        // reset: true
    });
    
    sr.reveal('.home__data, .home__img, .section__header, .feature__card, .pricing__card, .about__container, .contact__container');
    sr.reveal('.stat', {interval: 100});
    
    // Formulário de contato
    const contactForm = document.querySelector('.contact__form');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulação de envio
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                submitButton.innerHTML = '<i class="fas fa-check"></i> Enviado!';
                
                // Reset após 2 segundos
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    contactForm.reset();
                }, 2000);
            }, 1500);
        });
    }
});

// Inicializar Google Analytics
function gtag() {
    dataLayer.push(arguments);
}
