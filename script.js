// Naseer Portfolio - Animation Orchestration

// 1. Initialize Lenis for Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like easing
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Integrate Lenis with GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Update ScrollTrigger on Lenis scroll
// lenis.on('scroll', ScrollTrigger.update); // Not strictly clear if this is needed with latest versions, but good practice if syncing is off

// Connect GSAP ticker to Lenis for seamless sync
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

// Disable GSAP's lag smoothing to prevent stutter causing jumps
gsap.ticker.lagSmoothing(0);


// 2. Cursor Animation
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot follows immediately
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Outline follows with slight delay (using GSAP for smoothness)
    gsap.to(cursorOutline, {
        x: posX - 20, // Offset by half width/height (handled in CSS transform, but GSAP overwrites so we need to be careful. Actually CSS translate is -50%)
        // Let's rely on left/top GSAP animation
        left: posX,
        top: posY,
        duration: 0.15,
        ease: "power2.out"
    });
});

// Hover states for cursor
document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursorOutline, {
            scale: 1.5,
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderColor: 'transparent',
            duration: 0.3
        });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursorOutline, {
            scale: 1,
            backgroundColor: 'transparent',
            borderColor: 'rgba(0,0,0,0.5)',
            duration: 0.3
        });
    });
});

// Value Card Mouse Tracker
document.querySelectorAll('.value-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});


// Utility: Split Text into Spans
function splitTextToSpans(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        const text = el.innerText;
// 3. Hero Setup (MAGNETIC CODE EDITION)
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
    const items = document.querySelectorAll('.bento-item');
    if (!items.length) return;

    gsap.from(items, {
        scrollTrigger: {
            trigger: ".projects-section",
            start: "top 75%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
    });
}

// 6. Tech Stack: Terminal Typing
function initTerminal() {
    const terminal = document.querySelector('.terminal-container');
    if (!terminal) return;

    gsap.from(terminal, {
        scrollTrigger: {
            trigger: ".tech-terminal-section",
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
}

// 7. Process Section (New)
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

// 8. Testimonials Section (New - Marquee)
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
}

// 10. Footer: Parallax Reveal
function initFooter() {
    gsap.from(".footer-text", {
        scrollTrigger: {
            trigger: ".site-footer",
            start: "top 90%",
            scrub: 1
        },
        y: 100,
        opacity: 0,
    });
}

// 11. 3D Pricing Tilt
// 11. Contact Terminal Typing Effect
// This function is replaced by the new initTerminal and initContact
// function initTerminal() {
//     const section = document.querySelector('.contact-section');
//     if(!section) return;

//     // Typewriter for the command
//     gsap.fromTo('.terminal-line .command', 
//         { width: "0ch", opacity: 1, overflow: "hidden", whiteSpace: "nowrap", display: "inline-block", borderRight: "2px solid #fff" },
//         { 
//             width: "16ch", // "initiate_contact".length
//             duration: 1.5, 
//             ease: "steps(16)",
//             scrollTrigger: {
//                 trigger: section,
//                 start: "top 60%"
//             },
//             onComplete: () => {
//                 gsap.set('.terminal-line .command', { borderRight: "none" }); // Remove cursor
                
//                 // Show Output
//                 gsap.to('.terminal-line .output', { opacity: 1, duration: 0.5, stagger: 0.5 });
//                 // Show Input
//                 gsap.to('.terminal-input-line', { opacity: 1, y: 0, duration: 0.5, delay: 1 });
//             }
//         }
//     );

//     // Initial Hide
//     gsap.set('.terminal-line .output', { opacity: 0 });
//     gsap.set('.terminal-input-line', { opacity: 0, y: 10 });
// }

// 12. Video Window Parallax
function initVideoParallax() {
    gsap.to('.video-scale-wrapper', {
        scale: 1,
        borderRadius: "0px", // Optional: go full bleed
        scrollTrigger: {
            trigger: '.video-window-section',
            start: "top top",
            end: "bottom bottom",
            scrub: true
        }
    });
}


// 13. Animated Stats
function initStats() {
    gsap.utils.toArray('.stat-number').forEach(stat => {
        const target = parseInt(stat.dataset.target);
        gsap.to(stat, {
            innerText: target,
            duration: 2,
            snap: { innerText: 1 },
            scrollTrigger: {
                trigger: stat,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });
}

// 14. Smooth FAQ
function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            items.forEach(i => {
                i.classList.remove('active');
                gsap.to(i.querySelector('.faq-answer'), { height: 0, duration: 0.3 });
            });

            if (!isActive) {
                item.classList.add('active');
                // Auto height animation
                gsap.set(answer, { height: "auto" });
                gsap.from(answer, { height: 0, duration: 0.3 });
            }
        });
    });
}

// 15. Velocity Scroll Text (Global)
// 15. Velocity Scroll Text (Global Infinite Loop)
// 15. Velocity Scroll Text (Global Infinite Loop)
function initVelocityText() {
    const sections = document.querySelectorAll('.velocity-section');
    
    sections.forEach((section, index) => {
        const track = section.querySelector('.velocity-track');
        if (!track) return;

        // 1. Duplicate content: We need at least 2 full widths to loop seamlessly.
        // The HTML already has some text. Let's replicate it enough times.
        track.innerHTML += track.innerHTML; 
        track.innerHTML += track.innerHTML; // 4x original content
        
        // 2. Setup Variables
        let xPos = 0;
        const direction = index % 2 === 0 ? -1 : 1; // -1 = Left, 1 = Right
        const baseSpeed = 1.5 * direction; // Constant movement speed
        let scrollVelocity = 0;
        
        // 3. Ticker for Infinite Movement
        gsap.ticker.add(() => {
            // Calculate movement: Base Speed + Boost from Scroll
            const movement = baseSpeed + (scrollVelocity * direction * 0.5);
            xPos += movement;
            
            // 4. Wrap Logic (Infinite)
            // We wrap around half the total scrollWidth (since we duplicated content)
            // Actually, we wrap around the width of ONE Set of content.
            // Since we did 4x, we can wrap at 25% or 50% safely.
            const wrapWidth = track.scrollWidth / 2; 
            
            if (direction === -1) {
                // Moving Left
                if (xPos < -wrapWidth) xPos = 0;
            } else {
                // Moving Right
                if (xPos > 0) xPos = -wrapWidth;
            }
            
            // Apply
            gsap.set(track, { x: xPos });
            
            // Decay scroll velocity
            scrollVelocity *= 0.9;
        });
        
        // 5. Scroll Interaction (Boost)
        ScrollTrigger.create({
            trigger: section,
            onUpdate: (self) => {
                // self.getVelocity() gives pixels/second.
                // We add this impulse to our separate velocity variable
                // We limit the impulse to prevent glitching
                const v = self.getVelocity() / 50; 
                if (v !== 0) {
                     scrollVelocity = v; 
                }
            }
        });
    });
}

// 16. Optimized Atmosphere (Scroll + Hover)
function initAtmosphere() {
    const section = document.querySelector('.mesh-section');
    const mesh = document.querySelector('.mesh-gradient');
    
    if(!section || !mesh) return;

    // 1. Scroll Interaction (Parallax & Rotation)
    gsap.to(mesh, {
        rotation: 45,
        scale: 1.5,
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // 2. Hover Interaction (Mouse Follow)
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

// 17. Team Section Reveal
// 17. Education Timeline Reveal
function initEducation() {
    // Line height grow
    gsap.from('.timeline-line', {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
             trigger: '.education-section',
             start: "top 60%"
        }
    });

    // Items slide in
    const items = gsap.utils.toArray('.timeline-item');
    items.forEach((item, i) => {
        const isLeft = item.classList.contains('left');
        gsap.from(item, {
            x: isLeft ? -50 : 50,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: item,
                start: "top 85%"
            }
        });
    });
}

// 17. Workflow Horizontal Scroll (Stabilized)
function initWorkflow() {
    const track = document.querySelector('.hz-track');
    const items = gsap.utils.toArray('.hz-item');
    
    if(!track || items.length === 0) return;
    
    // Use xPercent for safer responsive behavior
    // We move the track to the left by (number of items - 1) * 100% ? 
    // No, track contains items. We slide the track itself.
    
    // Calculate how far to move: 
    // Total Width - Viewport Width
    // But to be super safe against "0 width" bugs:
    
    // We will use a function-based value for the tween to recalculate on resize
    // 1. Force track to be wide so we can measure it
    track.style.width = "max-content";

    function getScrollAmount() {
        // Distance to move = Total Width - Viewport Width
        let amount = track.offsetWidth - window.innerWidth;
        return amount > 0 ? amount : 0;
    }

    const scrollAmount = getScrollAmount();
    
    // Only animate if there IS content to scroll
    if(scrollAmount > 0) {
        gsap.to(track, {
            x: () => -getScrollAmount(),
            ease: "none",
            scrollTrigger: {
                trigger: ".workflow-section",
                start: "top top",
                end: () => `+=${getScrollAmount()}`, 
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                anticipatePin: 1
            }
        });
    }
}

// 18. Orbit Interaction (Solar System Tilt)
function initOrbit() {
    const section = document.querySelector('.orbit-section');
    const system = document.querySelector('.solar-system');
    
    if(!section || !system) return;
    
    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
        
        // Base Rotation: rotateX(60deg) rotateZ(-20deg)
        // We add mouse influence to X and Z axes
        
        gsap.to(system, {
            rotationX: 60 + (y * 20), // Tilt up/down
            rotationZ: -20 + (x * 20), // Rotate around
            duration: 1,
            ease: "power2.out"
        });
    });
    
    // Reset on leave
    section.addEventListener('mouseleave', () => {
        gsap.to(system, {
            rotationX: 60,
            rotationZ: -20,
            duration: 1.5,
            ease: "elastic.out(1, 0.5)"
        });
    });
}

// 19. CTA Reveal
function initCTA() {
    gsap.from('.cta-content > *', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: '.cta-section',
            start: "top 70%"
        }
    });
}

// 20. Spotlight Mouse Tracker
// 20. Liquid Hero Spotlight
function initSpotlight() {
    const hero = document.querySelector('.hero-liquid');
    const beam = document.querySelector('.spotlight-beam');
    
    if(!hero || !beam) return;
    
    hero.addEventListener('mousemove', (e) => {
        gsap.to(beam, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.2, // Lag for smoothness
            ease: "power2.out"
        });
    });
}

// 21. Testimonial Stack Swipe (Removed)
// function initStack() {} 

// 22. Device Parallax
function initDevices() {
    gsap.from('.device-laptop', {
        y: 100,
        scrollTrigger: { trigger: '.device-section', scrub: true }
    });
    gsap.from('.device-tablet', {
        y: 200,
        scrollTrigger: { trigger: '.device-section', scrub: true }
    });
    gsap.from('.device-phone', {
        y: 300,
        scrollTrigger: { trigger: '.device-section', scrub: true }
    });
}

// 23. Magnetic Button
function initMagnetic() {
    const btns = document.querySelectorAll('.magnetic-btn');
    
    btns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
        });
        
        btn.addEventListener('mouseleave', () => {
             // Reset
            gsap.to(btn, { x: 0, y: 0, duration: 0.3 });
        });
    });
}

// 24. Project Modal Logic
function initProjectModal() {
    const modal = document.querySelector('.project-modal');
    const closeBtn = document.querySelector('.modal-close');
    const overlay = document.querySelector('.modal-overlay');
    const projectCards = document.querySelectorAll('.project-card');

    if (!modal) return;

    // Open Modal
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            // Get content from card
            const title = card.querySelector('h3') ? card.querySelector('h3').innerText : 'Project';
            const tags = card.querySelector('.project-info p') ? card.querySelector('.project-info p').innerText : 'Tech';
            
            // Populate Modal
            const modalTitle = modal.querySelector('.modal-title');
            const modalTags = modal.querySelector('.modal-tags');
            
            if(modalTitle) modalTitle.innerText = title;
            if(modalTags) modalTags.innerHTML = tags.split(',').map(t => `<span>${t.trim()}</span>`).join('');
            
            // Show
            modal.classList.add('active');
            gsap.to('.modal-content', { 
                scale: 1, 
                opacity: 1, 
                y: 0, 
                duration: 0.4, 
                ease: "back.out(1.2)" 
            });
        });
    });

    // Close Modal
    function closeModal() {
        modal.classList.remove('active');
        gsap.to('.modal-content', { 
            scale: 0.95, 
            opacity: 0, 
            y: 50, 
            duration: 0.3 
        });
    }

    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(overlay) overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}

// --- Main Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Run all inits
    initHero();
    initFeatures(); // Restored
    initExpertise(); // New Bento
    initWorkflow(); // New Circuit
    initSlider();
    initProjectsGrid();
    initFooter();
    initStyleSelector();
    // initPricingTilt(); // Removed
    initTerminal(); // New Contact
    initVideoParallax();
    initStats();
    initFAQ();
    initVelocityText();
    initAtmosphere();
    initEducation(); // New Timeline
    initOrbit();
    initCTA();
    initSpotlight();
    initSpotlight();
    // initStack(); // Removed
    initDevices();
    initDevices();
    initMagnetic();
    initProjectModal();
});
