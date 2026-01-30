// 1. Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Register GSAP
gsap.registerPlugin(ScrollTrigger);

// 3. Hero Setup (Magnetic Code Editor)
function initHero() {
    // A. Typewriter Effect
    const roles = ["Full Stack Developer", "Premium UI Engineer", "Creative Coder"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseDelay = 2000;
    const typeTarget = document.querySelector('.typewriter-text');

    function type() {
        if (!typeTarget) return;
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typeTarget.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeTarget.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let nextSpeed = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentRole.length) {
            nextSpeed = pauseDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            nextSpeed = 500;
        }

        setTimeout(type, nextSpeed);
    }
    type();

    // B. Magnetic 3D Tilt for Code Window
    const win = document.querySelector('.code-window-3d');
    const container = document.querySelector('.hero-split');

    if (win && container) {
        container.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25; // Rotate Y
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25; // Rotate X
            
            win.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg) scale(1.02)`;
        });

        // Reset on leave
        container.addEventListener('mouseleave', () => {
            win.style.transform = `rotateY(0deg) rotateX(0deg) scale(1)`;
        });
    }

    // C. Entrance Animations
    gsap.from('.hero-text > *', {
        y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out", delay: 0.5
    });
    gsap.from('.hero-visual', {
        x: 50, opacity: 0, duration: 1.5, ease: "power3.out", delay: 0.8
    });
}

// 4. Services: Glass Grid Reveal
function initServices() {
    const cards = document.querySelectorAll('.glass-card');
    if (!cards.length) return;

    gsap.from(cards, {
        scrollTrigger: {
            trigger: ".services-section",
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });
}
// 5. Projects: Bento Grid Pop-in
function initBento() {
    // This targets the new Projects Grid which uses .project-card but we can animate the container
    const items = document.querySelectorAll('.project-card');
    if (!items.length) return;

    gsap.from(items, {
        scrollTrigger: {
            trigger: ".projects-section",
            start: "top 75%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
    });
}

// 6. Contact Terminal Effect (Consolidated)
// (Renamed from initTerminal to avoid confusion, logic moved to initContact)

// 7. Process Section
function initProcess() {
    const steps = document.querySelectorAll('.process-step');
    if (!steps.length) return;

    gsap.from(steps, {
        scrollTrigger: {
            trigger: ".process-section",
            start: "top 80%"
        },
        y: 50,
        opacity: 0,
        stagger: 0.3,
        duration: 1,
        ease: "power2.out"
    });
}

// 8. Testimonials Section
function initTestimonials() {
    const track = document.querySelector('.testimonial-track');
    if(!track) return;
    
    // Clone for infinite loop
    track.innerHTML += track.innerHTML; 
    
    // Infinite Scroll
    gsap.to(track, {
        xPercent: -50,
        duration: 20,
        ease: "none",
        repeat: -1
    });
}

// 9. Contact: CLI Form Slide Up
function initContact() {
    const form = document.querySelector('.contact-container');
    if (!form) return;

    // Contact form slide up
    gsap.from(form, {
        scrollTrigger: {
            trigger: ".contact-section",
            start: "top 75%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });

    // We can also add the typing effect here if desired, 
    // but the pure CSS/HTML structure of the terminal often looks good enough.
}

// 10. Footer: Parallax Reveal
function initFooter() {
    // Target the correct class from index.html
    gsap.from(".footer-big-text", {
        scrollTrigger: {
            trigger: ".site-footer",
            start: "top 90%",
            scrub: 1
        },
        y: 100,
        opacity: 0,
    });
}

// 11. Atmosphere
function initAtmosphere() {
    const section = document.querySelector('.mesh-section');
    const mesh = document.querySelector('.mesh-gradient');
    
    if(!section || !mesh) return;

    section.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 50; 
        const y = (e.clientY / window.innerHeight - 0.5) * 50;

        gsap.to(mesh, {
            x: x,
            y: y,
            duration: 1,
            ease: "power2.out"
        });
    });
}

// Master Init
document.addEventListener('DOMContentLoaded', () => {
    initHero();
    initServices(); // Now exists in HTML
    initBento();    // Animates Projects
    // initTerminal(); // Removed (covered by Contact)
    initProcess();
    initTestimonials();
    initContact();
    initFooter();
    initAtmosphere();
});
