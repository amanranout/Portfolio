// ========================================
// GLOBAL VARIABLES & DOM ELEMENTS
// ========================================

const navMenu = document.getElementById('navMenu');
const hamburger = document.getElementById('hamburger');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const loaderWrapper = document.getElementById('loaderWrapper');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

// 3D Canvas
const canvas3d = document.getElementById('canvas3d');
let scene, camera, renderer, particles;

// ========================================
// THREE.JS 3D BACKGROUND SETUP
// ========================================

function initThreeJsBackground() {
    if (!canvas3d) return;

    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0e27, 2000, 3000);

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 100;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas3d, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x0a0e27, 0.1);

    // Create particles
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 2000;
        positions[i + 1] = (Math.random() - 0.5) * 2000;
        positions[i + 2] = (Math.random() - 0.5) * 2000;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x6366f1,
        size: 2,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Lighting
    const light = new THREE.PointLight(0x6366f1, 1, 500);
    light.position.set(100, 100, 100);
    scene.add(light);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate particles
        if (particles) {
            particles.rotation.x += 0.0001;
            particles.rotation.y += 0.0002;
        }

        // Mouse interaction
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            camera.position.x = x * 50;
            camera.position.y = y * 50;
        });

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ========================================
// 1. LOADER ANIMATION & 3D INITIALIZATION
// ========================================

window.addEventListener('load', () => {
    // Initialize 3D background
    initThreeJsBackground();

    setTimeout(() => {
        loaderWrapper.style.display = 'none';
    }, 2000);
});

// ========================================
// 2. MOBILE NAVIGATION MENU
// ========================================

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ========================================
// 3. STICKY NAVBAR & SCROLL EFFECTS
// ========================================

let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolling class to navbar
    if (currentScroll > 100) {
        navbar.classList.add('scrolling');
    } else {
        navbar.classList.remove('scrolling');
    }

    // Update active nav link based on scroll
    updateActiveNavLink();

    // Show/hide scroll to top button
    if (currentScroll > 400) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }

    lastScroll = currentScroll;
});

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

// ========================================
// 4. SCROLL TO TOP BUTTON
// ========================================

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// 5. TYPING ANIMATION
// ========================================

const typingData = [
    'B.Tech CSE Student',
    'Data Science Learner',
    'Hackathon Enthusiast'
];

let currentText = '';
let currentIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const typingElement = document.querySelector('.typing-text');
    const fullText = typingData[currentIndex];

    if (isDeleting) {
        currentText = fullText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        currentText = fullText.substring(0, charIndex + 1);
        charIndex++;
    }

    typingElement.textContent = currentText;

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === fullText.length) {
        typeSpeed = 2000; // Pause before deleting
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % typingData.length;
        typeSpeed = 500; // Pause before typing next text
    }

    setTimeout(typeEffect, typeSpeed);
}

// Start typing animation when page loads
window.addEventListener('load', () => {
    setTimeout(typeEffect, 500);
});

// ========================================
// 6. SCROLL REVEAL ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with scroll-animate class
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.fade-in');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// ========================================
// 7. ANIMATED COUNTERS
// ========================================

let countersAnimated = false;

const animateCounters = () => {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50; // 50 steps

        const updateCount = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCount);
            } else {
                counter.textContent = target + '+';
            }
        };

        updateCount();
    });
};

// Trigger counter animation when about section is visible
const aboutSection = document.getElementById('about');
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            animateCounters();
            countersAnimated = true;
        }
    });
}, { threshold: 0.5 });

if (aboutSection) {
    aboutObserver.observe(aboutSection);
}

// ========================================
// 8. FORM VALIDATION & SUBMISSION
// ========================================

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm() {
    let isValid = true;

    // Reset error messages
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
    });
    document.querySelectorAll('.form-input').forEach(el => {
        el.classList.remove('error');
    });

    // Validate name
    if (nameInput.value.trim() === '') {
        showError(nameInput, 'nameError', 'Please enter your name');
        isValid = false;
    } else if (nameInput.value.trim().length < 2) {
        showError(nameInput, 'nameError', 'Name must be at least 2 characters');
        isValid = false;
    }

    // Validate email
    if (emailInput.value.trim() === '') {
        showError(emailInput, 'emailError', 'Please enter your email');
        isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, 'emailError', 'Please enter a valid email');
        isValid = false;
    }

    // Validate subject
    if (subjectInput.value.trim() === '') {
        showError(subjectInput, 'subjectError', 'Please enter a subject');
        isValid = false;
    }

    // Validate message
    if (messageInput.value.trim() === '') {
        showError(messageInput, 'messageError', 'Please enter your message');
        isValid = false;
    } else if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'messageError', 'Message must be at least 10 characters');
        isValid = false;
    }

    return isValid;
}

function showError(input, errorId, message) {
    input.classList.add('error');
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateForm()) {
        // Show success message
        successMessage.classList.add('show');
        contactForm.style.display = 'none';

        // Reset form
        contactForm.reset();

        // Hide success message and show form again after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
            contactForm.style.display = 'flex';
        }, 5000);

        // Optional: Clear success message visibility
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    }
});

// Real-time validation on input
nameInput.addEventListener('blur', () => {
    if (nameInput.value.trim() !== '') {
        nameInput.classList.remove('error');
        document.getElementById('nameError').classList.remove('show');
    }
});

emailInput.addEventListener('blur', () => {
    if (emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.remove('error');
        document.getElementById('emailError').classList.remove('show');
    }
});

subjectInput.addEventListener('blur', () => {
    if (subjectInput.value.trim() !== '') {
        subjectInput.classList.remove('error');
        document.getElementById('subjectError').classList.remove('show');
    }
});

messageInput.addEventListener('blur', () => {
    if (messageInput.value.trim() !== '') {
        messageInput.classList.remove('error');
        document.getElementById('messageError').classList.remove('show');
    }
});

// ========================================
// 9. SMOOTH SCROLL BEHAVIOR
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// 10. PARALLAX EFFECT ON SCROLL
// ========================================

window.addEventListener('scroll', () => {
    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
        parallaxBg.style.transform = `translateY(${window.pageYOffset * 0.5}px)`;
    }
});

// ========================================
// 11. PROGRESS BAR ANIMATION
// ========================================

const skillsSection = document.getElementById('skills');
let skillsAnimated = false;

const animateSkillBars = () => {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-out';
            bar.style.width = width;
        }, 100);
    });
};

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
            animateSkillBars();
            skillsAnimated = true;
        }
    });
}, { threshold: 0.5 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// ========================================
// 12. PROJECT CARD 3D TILT EFFECT (ENHANCED)
// ========================================

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        card.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        card.style.boxShadow = `0 40px 100px rgba(99, 102, 241, 0.3)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1500px) rotateX(0) rotateY(0) scale(1)';
        card.style.boxShadow = '0 15px 40px rgba(99, 102, 241, 0.15)';
    });
});

// ========================================
// 13. SKILL CARD 3D HOVER ANIMATION (ENHANCED)
// ========================================

const skillCards = document.querySelectorAll('.skill-card');

skillCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1500px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ========================================
// 14. INTERSECTION OBSERVER FOR FADE-IN & GLOW EFFECT
// ========================================

const fadeInElements = document.querySelectorAll(
    '.about-paragraph, .stat-card, .skill-card, .project-card, .info-item'
);

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                // Add glow effect
                entry.target.style.boxShadow = '0 0 40px rgba(99, 102, 241, 0.2)';
                fadeInObserver.unobserve(entry.target);
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

fadeInElements.forEach(el => {
    fadeInObserver.observe(el);
});

// ========================================
// 15. DYNAMIC STARS BACKGROUND
// ========================================

function createStars() {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer) return;

    const starCount = 50;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = '2px';
        star.style.height = '2px';
        star.style.background = 'white';
        star.style.borderRadius = '50%';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.opacity = Math.random() * 0.5 + 0.3;
        star.style.animation = `twinkle ${2 + Math.random() * 3}s infinite`;
        starsContainer.appendChild(star);
    }
}

createStars();

// ========================================
// 16. KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('keydown', (e) => {
    // Scroll to top with 'Home' key
    if (e.code === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Scroll to bottom with 'End' key
    if (e.code === 'End') {
        e.preventDefault();
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }
});

// ========================================
// 17. PREFETCH LINKS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// ========================================
// 18. ENHANCE INPUT FOCUS ANIMATIONS
// ========================================

const inputs = document.querySelectorAll('.form-input');

inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'scale(1)';
    });
});

// ========================================
// 19. MODIFY RESUME & LINKS
// ========================================

// To update social links, modify these values:
function updateSocialLinks() {
    // LinkedIn
    const linkedinLink = document.querySelector('.social-icon[title="LinkedIn"]');
    if (linkedinLink) linkedinLink.href = 'https://www.linkedin.com/in/aman-kumar-47a86432a/';

    // GitHub
    const githubLink = document.querySelector('.social-icon[title="GitHub"]');
    if (githubLink) githubLink.href = 'https://github.com/amanranout';

    // Instagram
    const instagramLink = document.querySelector('.social-icon[title="Instagram"]');
    if (instagramLink) instagramLink.href = 'https://instagram.com/yourprofile';
}

// Update social links on page load
window.addEventListener('load', updateSocialLinks);

// ========================================
// 20. PERFORMANCE OPTIMIZATION
// ========================================

// Lazy load images (if needed)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// 21. CONSOLE WELCOME MESSAGE
// ========================================

console.log(
    '%c Welcome to Aman Kumar\'s Portfolio! ',
    'background: #6366f1; color: white; font-size: 16px; padding: 10px;'
);
console.log(
    '%c 💻 Designed & Developed by Aman Kumar',
    'color: #8b5cf6; font-size: 14px;'
);
console.log(
    '%c 🚀 B.Tech CSE | Data Science | Hackathon Enthusiast | Web Developers',
    'color: #10b981; font-size: 12px;'
);