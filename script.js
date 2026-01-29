// Vizcom Recreation - Animation Orchestration

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


// 3. Hero Setup & Animation
function initHero() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Staggered Text Reveal
    tl.to('.reveal-text', {
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.15,
        ease: "power4.out" // More "premium" sharp easing
    })
    .to('.hero-cta-wrapper', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
    }, "-=1"); // Overlap slightly with text

    // Parallax Effect for Hero Visual
    gsap.to('.visual-wrapper', {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: '.hero-section',
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
}


// 4. Feature Section Scroll Animations
function initFeatures() {
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.from(card, {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 85%", // Trigger when top of card hits 85% of viewport
                toggleActions: "play none none reverse"
            },
            delay: i * 0.1 // Stagger manual
        });
    });
}


// Initialize
window.addEventListener('load', () => {
    initHero();
    initFeatures();
});
