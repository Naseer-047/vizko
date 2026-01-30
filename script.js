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


// Utility: Split Text into Spans
function splitTextToSpans(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        const text = el.innerText;
        el.innerHTML = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.innerText = char === ' ' ? '&nbsp;' : char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(120%)';
            if (char === ' ') span.style.width = '0.3em'; // Adjust space width
            el.appendChild(span);
        });
    });
}

// 3. Hero Setup & Animation
function initHero() {
    initCodeWindow(); // New function for code interactions

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Hero Title Reveal
    tl.to('.reveal-text', {
        y: 0,
        opacity: 1,
        duration: 1.8,
        stagger: 0.2
    })
    .to('.hero-cta-wrapper', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
    }, "-=1.2");

    // Parallax
    gsap.to('.visual-wrapper', {
        yPercent: 30, // Increased parallax depth
        ease: "none",
        scrollTrigger: {
            trigger: '.hero-section',
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

}

function initCodeWindow() {
    // 3a. Magnetic Follow Effect + Glare
    const heroSection = document.querySelector('.hero-section');
    const codeWindow = document.querySelector('.code-window');
    const glare = document.querySelector('.window-glare');
    const heroGlow = document.querySelector('.hero-background-glow');

    if (heroSection && codeWindow) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            // Calculate mouse position relative to center of hero section
            const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2); // -1 to 1
            const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2); // -1 to 1

            // Move window slightly (Magnetic feel)
            gsap.to(codeWindow, {
                x: x * 30, // Move 30px max
                y: y * 30, // Move 30px max
                rotationY: x * 10, // Tilt 10deg
                rotationX: -y * 10, // Tilt 10deg
                duration: 0.5,
                ease: "power2.out"
            });

            // Glare Effect
            gsap.to(glare, {
                x: x * 80, // Glare moves opposite/more
                opacity: 0.5 + (x * 0.3), // Brightens on side
                duration: 0.5
            });

            // Hero Glow Follow
            if(heroGlow) {
                 gsap.to(heroGlow, {
                    x: x * 50, 
                    y: y * 50,
                    duration: 1.5,
                    ease: "power2.out"
                });
            }
        });

        heroSection.addEventListener('mouseleave', () => {
             // Reset Window
            gsap.to(codeWindow, {
                x: 0,
                y: 0,
                rotationY: -10, // Return to default CSS skew
                rotationX: 5,
                duration: 1,
                ease: "elastic.out(1, 0.5)"
            });
            // Reset Glare
             gsap.to(glare, { opacity: 0, duration: 0.5 });
        });
    }

    // 3b. Typewriter Effect
    const codeLines = document.querySelectorAll('.code-line');
    
    // reset text to hidden first
    gsap.set(codeLines, { autoAlpha: 0, x: -10 });

    const typeTl = gsap.timeline({ delay: 0.5 }); // Start quickly
    codeLines.forEach((line) => {
        typeTl.to(line, {
            autoAlpha: 1,
            x: 0,
            duration: 0.05,
            ease: "none"
        }, "+=0.08"); 
    });
}

// 4. Feature Section & Card Glow
function initFeatures() {
    // Divider Animation
    gsap.to('.section-divider', {
        scaleX: 1,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
            trigger: '.features-section',
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    // Scroll Reveal for cards - Added Depth (Scale)
    const cards = gsap.utils.toArray('.feature-card');
    cards.forEach((card, i) => {
        gsap.from(card, {
            y: 100,
            opacity: 0,
            scale: 0.92, // Z-depth illusion
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });

        // Mouse Move Glow Effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            gsap.to(card, {
                "--mouse-x": `${x}px`,
                "--mouse-y": `${y}px`,
                duration: 0.1,
                overwrite: true
            });
        });
    });
}


// 5. Product Image Blur Reveal
function initProductReveal() {
    // Pin the section while the reveal happens
    gsap.to('.product-image-wrapper', {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: '.product-section',
            start: "top top", // Pin immediately when it hits top
            end: "+=100%", // Pin for 1 screen height duration
            pin: true,
            scrub: true // Scrub the animation while pinned
        }
    });

    // Also animate text slightly for parallax
    gsap.from('.product-text', {
        y: 50,
        opacity: 0,
        scrollTrigger: {
            trigger: '.product-section',
            start: "top top",
            end: "+=50%",
            scrub: true
        }
    });
}

// 6. 3D Workflow Animation
// 6. Engineering Approach Animation (Stacked Cards)
function initWorkflow() {
    const cards = gsap.utils.toArray('.step-card');
    
    cards.forEach((card, i) => {
        // 1. Smooth Entry: Standard fade up as they come into view
        gsap.from(card, {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: card,
                start: "top 95%", // Trigger earlier
                toggleActions: "play none none reverse" 
            }
        });

        // 2. Stack Effect: Scale down previous card when next one overlaps
        if (i < cards.length - 1) { 
            const nextCard = cards[i + 1];
            
            gsap.to(card, {
                scale: 0.9,
                filter: "brightness(0.5) blur(5px)", // Darken and blur
                transformOrigin: "center top",
                ease: "none",
                scrollTrigger: {
                    trigger: nextCard,
                    start: "top bottom", // Start scaling as soon as next card enters viewport
                    end: "top 150px", // Finish when next card hits the sticky top
                    scrub: true
                }
            });
        }
    });
}

// 7. Interactive Comparison Slider
function initSlider() {
    const container = document.querySelector('.comparison-container');
    const afterImage = document.querySelector('.after-image');
    const handle = document.querySelector('.slider-handle');

    if (!container) return;

    function moveSlider(e) {
        const rect = container.getBoundingClientRect();
        // Calculate position (clamp between 0 and width)
        let x = (e.clientX || e.touches[0].clientX) - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        
        const percentage = (x / rect.width) * 100;

        // Update width of the Top image (After Image usually, or Before depending on layer order)
        // Here .after-image is the one on top (z-index 2), covering the sketch.
        // It has overflow hidden. 
        // So resizing width reveals/hides it.
        // If width is 100%, we see full render. If 0%, full sketch.
        
        gsap.to(afterImage, {
            width: `${percentage}%`,
            duration: 0.1, // Quick follow
            ease: "none"
        });
        
        gsap.to(handle, {
            left: `${percentage}%`,
            duration: 0.1,
            ease: "none"
        });
    }

    container.addEventListener('mousemove', moveSlider);
    container.addEventListener('touchmove', moveSlider);
}

// 8. Projects Grid (Filterable + Animation)
function initProjectsGrid() {
    const filters = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');
    
    // Initial Reveal
    gsap.from(cards, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
            trigger: ".project-grid",
            start: "top 80%"
        }
    });

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Update Active State
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.filter;
            
            // 2. Filter Logic (Fade Out -> Layout Change -> Fade In)
            // Ideally we'd use GSAP Flip here, but without the plugin loaded, 
            // a robust "animate out, switch, animate in" is safest.
            
            const tl = gsap.timeline();

            // Step A: Hide all current cards
            tl.to(cards, {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    // Step B: Update DOM layout (Display None/Block)
                    cards.forEach(card => {
                        if (category === 'all' || card.dataset.category === category) {
                            card.style.display = "block";
                        } else {
                            card.style.display = "none";
                        }
                    });
                }
            });

            // Step C:  Animate visible cards back in (New Layout)
            tl.to(cards, {
                 scale: 1,
                 opacity: 1,
                 duration: 0.4,
                 ease: "power2.out",
                 stagger: 0.05,
                 clearProps: "scale" // Ensure hover effects work later
            }); // This runs after A completes due to timeline
        });
    });
}

// 9. Footer Parallax
function initFooter() {
    gsap.from('.footer-big-text span', {
        yPercent: 50,
        opacity: 0,
        scrollTrigger: {
            trigger: '.site-footer',
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1
        }
    });
}

// 10. Tech Ecosystem Logic
function initStyleSelector() {
    const tabs = document.querySelectorAll('.style-tab');
    const images = document.querySelectorAll('.style-image');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active
            tabs.forEach(t => t.classList.remove('active'));
            images.forEach(img => img.classList.remove('active'));

            // Add active
            tab.classList.add('active');
            // ID format is style-[name] e.g. style-cyberpunk
            const targetId = `style-${tab.dataset.style}`;
            const target = document.getElementById(targetId);
            if(target) target.classList.add('active');
        });
    });
}

// 11. 3D Pricing Tilt
function initPricingTilt() {
    const cards = document.querySelectorAll('.pricing-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Normalize to -1 to 1
            const xPct = (x / rect.width - 0.5) * 20; // 20deg max
            const yPct = (y / rect.height - 0.5) * -20; 

            gsap.to(card, {
                rotationY: xPct,
                rotationX: yPct,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationY: 0,
                rotationX: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });
}

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
function initTeam() {
    gsap.from('.team-card', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: '.team-section',
            start: "top 80%"
        }
    });
}

// 18. Orbit Interaction (Mouse Tilt)
function initOrbit() {
    const container = document.querySelector('.orbit-container');
    if(!container) return;
    
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        gsap.to(container, {
            rotationY: x * 30,
            rotationX: -y * 30,
            duration: 1,
            ease: "power2.out"
        });
    });
    
    // Reset on leave
    container.addEventListener('mouseleave', () => {
        gsap.to(container, {
            rotationY: 0,
            rotationX: 0,
            duration: 1,
            ease: "power2.out"
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
function initSpotlight() {
    const section = document.querySelector('.spotlight-section');
    const text = document.querySelector('.spotlight-text');
    
    section.addEventListener('mousemove', (e) => {
        // We can just use a simple mask or color switch
        // But for "flashlight" effect, we might need a clip-path or complex mask
        // Simpler premium feel: The text is dark grey (#333) and the beam lightens it?
        // Actually CSS overlay mix-blend-mode handles the beam visual.
        // Let's just make the text light up close to mouse?
        // Or simple: Text is dark, Beam is white overlay with exclusion? 
        // Let's stick to the CSS beam following mouse.
        
        const rect = section.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        gsap.to('.spotlight-beam', {
            x: e.clientX, // Fixed position based on viewport
            y: e.clientY,
            duration: 0.1,
            ease: "power1.out"
        });
        
        // Dynamic text color shift
        const textRect = text.getBoundingClientRect();
        const relX = e.clientX - textRect.left;
        const relY = e.clientY - textRect.top;
        
        // Advanced: Use CSS variables to update radial gradient on text itself
        text.style.backgroundImage = `radial-gradient(circle at ${relX}px ${relY}px, white 0%, #333 150px)`;
        text.style.webkitBackgroundClip = "text";
        text.style.webkitTextFillColor = "transparent";
    });
}

// 21. Testimonial Stack Swipe
function initStack() {
    const cards = document.querySelectorAll('.stack-card');
    
    // Pin section
    ScrollTrigger.create({
        trigger: '.stack-section',
        start: "top top",
        end: "+=200%", // 3 cards
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
            // Logic to peel off cards
            const progress = self.progress; // 0 to 1
            const total = cards.length;
            const index = Math.floor(progress * total);
            
            // Current card flies away? 
            // Better: Stack logic. 
            // All start visible. As we scroll, top one slides up/out.
            
            cards.forEach((card, i) => {
                // Determine phase for this card
                const start = i / total;
                const end = (i + 1) / total;
                const cardProgress = (progress - start) / (end - start); // 0 to 1 within its slot
                
                if (progress > start) {
                    // Card is active or done
                    // Animate it out
                    gsap.to(card, {
                        y: -50 * cardProgress + (i * 10), // slight offset
                        scale: 1 - (cardProgress * 0.1),
                        opacity: 1 - cardProgress,
                        rotation: cardProgress * 5,
                        duration: 0, // Scrub controlled
                        overwrite: true
                    });
                } else {
                    // Reset
                    gsap.to(card, { y: i * 10, scale: 1 - (i * 0.05), opacity: 1, rotation: 0, duration: 0.1, overwrite: true });
                }
            });
        }
    });
}

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
    initFeatures();
    initProductReveal();
    initWorkflow();
    initSlider();
    initProjectsGrid();
    initFooter();
    initStyleSelector();
    initPricingTilt();
    initVideoParallax();
    initStats();
    initFAQ();
    initVelocityText();
    initAtmosphere();
    initTeam();
    initOrbit();
    initCTA();
    initSpotlight();
    initStack();
    initDevices();
    initMagnetic();
    initProjectModal();
});
