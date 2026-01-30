
// =============================================================================
//  VIZKO PORTFOLIO: GOD-LEVEL EDITION
//  Powered by GSAP, ScrollTrigger, & Lenis
// =============================================================================

// Safe Check for Dependencies
if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof Lenis === 'undefined') {
    console.error("Critical Dependencies Missing (GSAP, ScrollTrigger, or Lenis). Animations disabled.");
    document.body.style.cursor = 'auto'; // Fallback
} else {
    // 1. Initialize Smooth Scroll (Lenis)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-style easing
        direction: 'vertical',
        smooth: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate GSAP with Lenis
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0); // Prevent lag jumps

    // Enable Custom Cursor Logic
    document.body.classList.add('custom-cursor-active');

    // =============================================================================
    //  CORE ANIMATIONS
    // =============================================================================

    document.addEventListener('DOMContentLoaded', () => {
        
        // A. Hero Section: Kinetic Typography Reveal
        // Progressive Enhancement: Hide them JS-side first
        gsap.set('.reveal-text', { y: "120%", opacity: 0 }); 
        
        const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });
        
        heroTimeline
            .to('.reveal-text', {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 1.5,
                stagger: 0.1
            })
            .from('.hero-subtitle', {
                opacity: 0,
                y: 20,
                duration: 1
            }, "-=1")
            .from('.hero-cta-wrapper', {
                opacity: 0,
                y: 20,
                duration: 1
            }, "-=0.8");

        // B. Magnetic Buttons
        const magnets = document.querySelectorAll('.btn-magnetic');
        magnets.forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: "power2.out"
                });
                gsap.to(btn.querySelector('.btn-fill'), {
                    x: x * 0.2,
                    y: y * 0.2,
                    duration: 0.3
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
                gsap.to(btn.querySelector('.btn-fill'), { x: 0, y: 0, duration: 0.5 });
            });
        });

        // C. Expertise: Holographic Tilt Effect
        const cards = document.querySelectorAll('.holo-card');
        cards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10; // Max -10deg to 10deg
                const rotateY = ((x - centerX) / centerX) * 10;
                
                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    duration: 0.5,
                    ease: "power2.out",
                    transformPerspective: 1000,
                    transformStyle: "preserve-3d"
                });
                
                // Move overlay reflection
                const overlay = card.querySelector('.holo-overlay');
                gsap.to(overlay, {
                    background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.1), transparent 80%)`,
                    duration: 0.1
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
        });

        // D. Projects: 3D Parallax Scroll
        const projects = gsap.utils.toArray('.project-card-3d');
        projects.forEach((card, i) => {
            gsap.from(card, {
                y: 100,
                opacity: 0,
                rotateX: 10,
                scale: 0.9,
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    end: "top 50%",
                    scrub: 1,
                }
            });
        });

        // E. Stats: Neon Counters
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            // Get raw number, handle "+" manually via CSS or span
            const rawText = stat.innerText;
            const hasPlus = rawText.includes('+');
            const value = parseInt(rawText.replace('+', '')); 
            
            // Set initial value to 0
            stat.innerText = '0' + (hasPlus ? '+' : '');
            
            // Create a proxy object to animate cleanly
            const proxy = { val: 0 };
            
            ScrollTrigger.create({
                trigger: stat,
                start: "top 85%",
                once: true,
                onEnter: () => {
                    gsap.to(proxy, {
                        val: value,
                        duration: 2,
                        ease: "power2.out",
                        onUpdate: function() {
                            stat.innerText = Math.ceil(proxy.val) + (hasPlus ? '+' : '');
                        }
                    });
                }
            });
        });

        // F. Skills: Neural Grid Pulse
        gsap.utils.toArray('.skill-node').forEach((node, i) => {
            gsap.from(node, {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                delay: i * 0.05,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: '.bento-grid',
                    start: "top 80%"
                }
            });
            
            // Random floating movement
            gsap.to(node, {
                y: "random(-5, 5)",
                x: "random(-5, 5)",
                duration: "random(2, 4)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: "random(0, 2)"
            });
        });

        // G. Timeline: Cyberpunk Reveal
        const timelineNodes = gsap.utils.toArray('.timeline-node');
        timelineNodes.forEach((node, i) => {
            gsap.from(node, {
                x: -50,
                opacity: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: node,
                    start: "top 85%"
                }
            });
            
            // Dot Glow
            const dot = node.querySelector('.node-dot');
            gsap.from(dot, {
                scale: 0,
                duration: 0.5,
                delay: 0.3,
                scrollTrigger: {
                    trigger: node,
                    start: "top 85%"
                }
            });
        });

        // H. Terminal: Typing Simulation
        const terminalInput = document.querySelector('.terminal-window input');
        if(terminalInput) {
            ScrollTrigger.create({
                trigger: '.terminal-window',
                start: "top 70%",
                once: true,
                onEnter: () => {
                    // Flash the prompt
                    gsap.fromTo('.prompt', { opacity: 0 }, { opacity: 1, duration: 0.5, repeat: 3, yoyo: true });
                }
            });
        }

        // I. Custom Cursor Logic
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        
        if(cursorDot && cursorOutline) {
            window.addEventListener('mousemove', (e) => {
                const posX = e.clientX;
                const posY = e.clientY;

                // Dot: Instant follow
                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;

                // Outline: Smooth lag
                cursorOutline.animate({
                    left: `${posX}px`,
                    top: `${posY}px`
                }, { duration: 500, fill: "forwards" }); 
                // Or use GSAP for outline
                /* 
                gsap.to(cursorOutline, {
                    x: posX - 30, // Adjust for center if using GSAP x/y transform instead of top/left
                    y: posY - 30,
                    duration: 0.15,
                    ease: "power2.out"
                }); 
                */
               // Since CSS uses translate(-50%, -50%) on top/left 0, we should update top/left:
               gsap.to(cursorOutline, {
                   left: posX,
                   top: posY,
                   duration: 0.15,
                   ease: "power2.out"
               });
            });

            // Interactive Hover States
            document.querySelectorAll('a, button, input, textarea, .holo-card').forEach(el => {
                el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
                el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
            });
        }
    });
}
