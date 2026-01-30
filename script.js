// 1. Initialize Lenis Smooth Scroll
console.log("SCRIPT STARTED"); // Debug Log

// Visual Debugger
const debugFlag = document.createElement('div');
debugFlag.style.position = 'fixed';
debugFlag.style.top = '0';
debugFlag.style.left = '0';
debugFlag.style.width = '100%';
debugFlag.style.height = '5px';
debugFlag.style.background = 'red';
debugFlag.style.zIndex = '99999';
document.body.appendChild(debugFlag);

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

// 4. Services: Glass Grid Reveal (Section 2)
function initServices() {
    const cards = document.querySelectorAll('.glass-card');
    if (!cards.length) return;

    gsap.fromTo(cards, 
        { y: 80, autoAlpha: 0 },
        {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".services-section",
                start: "top 85%", 
                toggleActions: "play none none reverse"
            }
        }
    );
}

// 4.5 Velocity Scroll Text (Global - Seamless Infinite Loop)
function initVelocityText() {
    const tracks = document.querySelectorAll('.velocity-track');
    
    tracks.forEach((track, i) => {
        const originalContent = track.innerHTML;
        
        // Clone 3 more times (Total 4 copies)
        track.innerHTML = originalContent + originalContent + originalContent + originalContent; 
        
        // Row 1 moves Left, Row 2 moves Right, etc.
        const moveLeft = i % 2 === 0; 
        
        if (moveLeft) {
            // Move Left: Start at 0, slide to -25%
            gsap.fromTo(track, 
                { xPercent: 0 },
                { xPercent: -25, ease: "none", duration: 25, repeat: -1 }
            );
        } else {
            // Move Right: Start at -25% (shifted left), slide to 0
            gsap.fromTo(track,
                { xPercent: -25 },
                { xPercent: 0, ease: "none", duration: 25, repeat: -1 }
            );
        }
    });
}

// 5. Projects: Works Grid Pop-in
function initBento() {
    const items = document.querySelectorAll('.project-card');
    if (!items.length) return;

    gsap.fromTo(items,
        { y: 50, autoAlpha: 0 },
        {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".projects-section",
                start: "top 95%",
                toggleActions: "play none none reverse"
            }
        }
    );
}

// 5.5 Skills: Bento Grid Pop-in (New)
function initSkills() {
    const items = document.querySelectorAll('.bento-item');
    if (!items.length) return;

    gsap.fromTo(items,
        { scale: 0.9, autoAlpha: 0 },
        {
            scale: 1,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: ".bento-section", // Target the Skills section
                start: "top 90%"
            }
        }
    );
}

// 5.6 Spotlight Text (New Problem Solver)
function initSpotlight() {
    const section = document.querySelector('.spotlight-section');
    const text = document.querySelector('.spotlight-text');
    const highlight = document.querySelector('.spotlight-text .highlight');
    
    if (!section || !text) return;

    // 1. Scroll Reveal
    gsap.fromTo(text,
        { scale: 0.8, autoAlpha: 0, y: 50 },
        {
            scale: 1,
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 75%",
                end: "bottom 80%",
                scrub: 1
            }
        }
    );
    
    // 2. Interactive Magnetic Hover
    section.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        
        gsap.to(text, {
            rotationX: -y,
            rotationY: x,
            duration: 1,
            ease: "power2.out"
        });
    });
    
    // Reset on leave
    section.addEventListener('mouseleave', () => {
        gsap.to(text, { rotationX: 0, rotationY: 0, duration: 1 });
    });

    // 3. Highlight Word Hover (Glow Burst)
    if (highlight) {
        highlight.addEventListener('mouseenter', () => {
            gsap.to(highlight, { 
                textShadow: "0 0 30px #00ff85, 0 0 60px #00ff85", 
                color: "#fff",
                scale: 1.1,
                duration: 0.3 
            });
        });
        highlight.addEventListener('mouseleave', () => {
            gsap.to(highlight, { 
                textShadow: "none", 
                color: "#00ff85", // Return to green/accent
                scale: 1,
                duration: 0.3 
            });
        });
    }

    // Animate the beam light if it exists
    gsap.to('.spotlight-beam', {
        rotation: 20,
        opacity: 0.8,
        scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
}

// 6. Contact Terminal Effect (Consolidated)
// (Renamed from initTerminal to avoid confusion, logic moved to initContact)

// 7. Process Section
function initProcess() {
    const steps = document.querySelectorAll('.process-step');
    if (!steps.length) return;

    gsap.fromTo(steps,
        { y: 50, autoAlpha: 0 },
        {
            y: 0,
            autoAlpha: 1,
            stagger: 0.3,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".process-section",
                start: "top 95%"
            }
        }
    );
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

    gsap.fromTo(form, 
        { y: 30, autoAlpha: 0 },
        {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".contact-section",
                start: "top 90%"
            }
        }
    );

    // We can also add the typing effect here if desired, 
    // but the pure CSS/HTML structure of the terminal often looks good enough.
}

// 10. Footer: Parallax Reveal
function initFooter() {
    gsap.fromTo(".footer-big-text", 
        { y: 100, autoAlpha: 0 },
        {
            y: 0,
            autoAlpha: 1,
            scrollTrigger: {
                trigger: ".site-footer",
                start: "top 95%",
                scrub: 1
            }
        }
    );
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

// 3.5 About Me 3D Entrance
function initAbout() {
    gsap.from(".about-text > *", {
        scrollTrigger: {
            trigger: ".about-section",
            start: "top 80%"
        },
        x: -50,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
    });

    gsap.from(".orbit-system", {
        scrollTrigger: {
            trigger: ".about-section",
            start: "top 80%"
        },
        scale: 0.5,
        autoAlpha: 0,
        duration: 1,
        ease: "back.out(1.5)"
    });
}


// Master Init
document.addEventListener('DOMContentLoaded', () => {
    // 1. Register
    gsap.registerPlugin(ScrollTrigger);

    // 2. Initialize Components
    initHero();
    initAbout(); // New 3D Section
    initServices(); 
    initVelocityText(); // New Velocity Text
    initBento();     
    initSkills();    
    initProcess();
    initTestimonials();
    initSpotlight(); 
    initContact();
    initFooter();
    initAtmosphere();

    // 3. Force Layout Recalculation (Fixes 'Invisible' bugs)
    // Wait a tick for DOM to settle
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);
});
