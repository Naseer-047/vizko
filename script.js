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

// 3.5 About Section GSAP Animations
function initAbout() {
    // Character-by-character animation for "ABOUT" heading
    const heading = document.querySelector('.about-heading');
    if (heading) {
        // Split text into characters
        const text = heading.textContent;
        heading.innerHTML = text.split('').map(char => 
            `<span class="char" style="display: inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
        
        // Create timeline with scrub for flexible scroll-linked animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 70%',
                end: 'top 30%',
                scrub: 1 // Smooth scrubbing, takes 1 second to "catch up"
            }
        });
        
        tl.from('.about-heading .char', {
            y: 100,
            opacity: 0,
            rotationX: -90,
            stagger: 0.08,
            duration: 0.8,
            ease: 'back.out(1.7)'
        })
        .from('.about-email', {
            x: -30,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.3')
        .from('.about-description', {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out'
        }, '-=0.2')
        .from('.about-location', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.3')
        .from('.about-image img', {
            scale: 0.8,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5');
    }
}

function initAtomicOrbit() {
    // Check if atomic orbit elements exist (they've been removed now)
    const rings = [
        { el: document.querySelector('.ring-1'), angle: 0 },
        { el: document.querySelector('.ring-2'), angle: 60 },
        { el: document.querySelector('.ring-3'), angle: -60 }
    ];
    
    // Only run if elements exist
    if (!rings[0].el) return;

    const radius = 225; // 450px / 2
    const ySquash = 0.5; // Match CSS scaleY
    
    // Animate each electron
    rings.forEach((ring, i) => {
        if(!ring.el) return;
        const electrons = ring.el.querySelectorAll('.electron');
        
        electrons.forEach((electron, j) => {
            // Offset starting angles so they don't clump
            let progress = j * 0.5; // 0, 0.5 (180 deg apart)
            
            gsap.to({}, {
                duration: 15, // Orbit speed
                repeat: -1,
                ease: "none",
                onUpdate: function() {
                    // Update progress 0 -> 1
                    progress += 0.002; // Speed factor (approx 1/frame)
                    const rad = progress * Math.PI * 2;
                    
                    // 1. Calculate Un-Rotated Ellipse Position
                    const ex = Math.cos(rad) * radius;
                    const ey = Math.sin(rad) * radius * ySquash;
                    
                    // 2. Rotate to match Ring alignment (Manual 2D Rotation)
                    const ringRad = ring.angle * (Math.PI / 180);
                    const finalX = ex * Math.cos(ringRad) - ey * Math.sin(ringRad);
                    const finalY = ex * Math.sin(ringRad) + ey * Math.cos(ringRad);
                    
                    // 3. Apply
                    gsap.set(electron, { x: finalX, y: finalY });
                }
            });
        });
    });
}


// 3.6 Resume Section Animations
function initResume() {
    // Animate skill bars with scroll-scrubbing
    const skillFills = document.querySelectorAll('.skill-fill');
    skillFills.forEach(fill => {
        const percent = fill.getAttribute('data-percent');
        
        gsap.timeline({
            scrollTrigger: {
                trigger: '.resume-section',
                start: 'top 60%',
                end: 'top 20%',
                scrub: 1
            }
        }).to(fill, {
            width: percent + '%',
            duration: 1,
            ease: 'power3.out'
        });
    });
    
    // Animate timeline items with scroll-scrubbing
    gsap.timeline({
        scrollTrigger: {
            trigger: '.timeline',
            start: 'top 70%',
            end: 'top 30%',
            scrub: 1
        }
    }).to('.timeline-item', {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power2.out'
    });
    
    // Animate hobby icons with scroll-scrubbing
    gsap.timeline({
        scrollTrigger: {
            trigger: '.hobbies-grid',
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1
        }
    }).to('.hobby-item', {
        opacity: 1,
        scale: 1,
        stagger: 0.15,
        duration: 0.6,
        ease: 'back.out(1.7)'
    });
}


// 3.7 Project Sections Animations
function initProjects() {
    // Animate each project section with scroll-scrubbing
    gsap.utils.toArray('.project-section').forEach(section => {
        const content = section.querySelector('.project-content');
        const visual = section.querySelector('.project-visual');
        
        // Create timeline for this project
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                end: 'top 20%',
                scrub: 1
            }
        });
        
        // Animate content
        tl.from(content.querySelector('.project-number'), {
            x: -50,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
        })
        .from(content.querySelector('.project-subtitle'), {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.3')
        .from(content.querySelector('.project-description'), {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.2');
        
        // Animate images
        const singleImage = visual.querySelector('.project-image-single img');
        const gridImages = visual.querySelectorAll('.project-images-grid img');
        
        if (singleImage) {
            tl.from(singleImage, {
                scale: 0.9,
                opacity: 0,
                duration: 0.7,
                ease: 'power3.out'
            }, '-=0.5');
        } else if (gridImages.length > 0) {
            tl.from(gridImages, {
                scale: 0.8,
                opacity: 0,
                stagger: 0.1,
                duration: 0.6,
                ease: 'back.out(1.7)'
            }, '-=0.5');
        }
    });
}


// Master Init
document.addEventListener('DOMContentLoaded', () => {
    // 1. Register
    gsap.registerPlugin(ScrollTrigger);

    // 2. Initialize Components
    initHero();
    initAbout(); // New 3D Section
    initResume(); // Resume section with skills/timeline
    initProjects(); // Project showcase sections
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
