function typeWriter(element, text, i, callback) {
    if (i < text.length) {
        element.textContent += text.charAt(i);
        setTimeout(() => typeWriter(element, text, i + 1, callback), 50);
    } else if (callback) {
        callback();
    }
}

let typewriterExecuted = false;

let currentLang = 'cz';

function setLanguage(lang) {
    currentLang = lang;
    const langData = translations[lang];

    document.title = langData.page_title;
    document.getElementById('meta_description').setAttribute('content', langData.meta_description);
    document.documentElement.setAttribute('lang', lang);

    for (const key in langData) {
        const element = document.getElementById(key);
        if (element) {
            if (key.startsWith('nav_')) {
                element.textContent = langData[key];
            } else if (key.startsWith('contact_')) {
                element.textContent = langData[key];
            } else if (key === 'about_title' && !typewriterExecuted) {
                typeWriter(element, langData[key], 0, () => {
                    typewriterExecuted = true;
                });
            } else {
                element.textContent = langData[key];
            }
        }
    }

    document.getElementById('lang_cz').classList.remove('active');
    document.getElementById('lang_en').classList.remove('active');
    document.getElementById(`lang_${lang}`).classList.add('active');
    
    if (typeof AOS !== 'undefined') {
        AOS.refreshHard();
    }
}

document.addEventListener('DOMContentLoaded', () => {

    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
    });

    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');

    hamburgerMenu.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        const icon = hamburgerMenu.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                hamburgerMenu.querySelector('i').classList.remove('fa-times');
                hamburgerMenu.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    window.onscroll = function() {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    };

    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', navHighlighter);

    function navHighlighter() {
        const viewportHeight = window.innerHeight;

        sections.forEach(current => {
            const rect = current.getBoundingClientRect();
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.main-nav a[href*='${sectionId}']`);
            const isVisible = rect.top < viewportHeight && rect.bottom > 0;

            if (isVisible) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        });
    }
    setLanguage(currentLang);
});