
      document.addEventListener("DOMContentLoaded", function () {
        // Initialize everything
        initLoader();
        initTheme();
        initNavigation();
        initTypewriter();
        initScrollAnimations();
        initHeroAnimation();
        initMobileNavigation(); // NEW: Initialize mobile navigation
        initScrollProgress();
        initBackToTop();
        initFormSubmission();
        initViewMoreProjects();
        initFloatingElements();
      });

      function initHeroAnimation() {
        // subtle floating animation for the profile card
        const profile = document.querySelector(".profile-card");
        if (!profile || typeof gsap === "undefined") return;

        gsap.to(profile, {
          y: -8,
          duration: 3.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      function initLoader() {
        const loader = document.getElementById("loader");
        const loaderText = document.querySelector(".loader-text");
        const loaderSubtitle = document.querySelector(".loader-subtitle");
        const progressBar = document.querySelector(".loader-progress-bar");

        // Animate loader text
        gsap.to(loaderText, {
          duration: 1.5,
          scale: 1.2,
          rotation: 360,
          ease: "power2.inOut",
          repeat: 1,
          yoyo: true,
        });

        // Animate progress bar
        gsap.to(progressBar, {
          width: "100%",
          duration: 2,
          ease: "power2.inOut",
          delay: 0.5,
          onComplete: () => {
            // Animate subtitle
            gsap.to(loaderSubtitle, {
              duration: 0.5,
              opacity: 1,
              onComplete: () => {
                // Hide loader
                setTimeout(() => {
                  gsap.to(loader, {
                    duration: 0.8,
                    opacity: 0,
                    onComplete: () => {
                      loader.style.display = "none";
                      // Animate hero section
                      animateHero();
                    },
                  });
                }, 1000);
              },
            });
          },
        });
      }

      function initTheme() {
        const themeToggle = document.getElementById("themeToggle");
        const mobileThemeToggle = document.getElementById("mobileThemeToggle");

        // Check saved theme
        let savedTheme = localStorage.getItem("theme");
        // Default to light if not set
        if (!savedTheme) {
          savedTheme = "light";
          localStorage.setItem("theme", "light");
        }
        if (savedTheme === "dark") {
          document.body.classList.add("dark");
        } else {
          document.body.classList.remove("dark");
        }

        // reflect initial aria state on the toggle
        if (themeToggle) {
          themeToggle.setAttribute(
            "aria-pressed",
            document.body.classList.contains("dark") ? "true" : "false",
          );
        }
        if (mobileThemeToggle) {
          mobileThemeToggle.setAttribute(
            "aria-pressed",
            document.body.classList.contains("dark") ? "true" : "false",
          );
        }

        // Toggle theme with animation and update aria state
        function toggleTheme() {
          gsap.to(document.body, {
            duration: 0.45,
            ease: "power2.inOut",
            onStart: () => {
              document.body.classList.toggle("dark");
              const isDarkNow = document.body.classList.contains("dark");
              
              // Update both theme toggles
              if (themeToggle) {
                themeToggle.setAttribute(
                  "aria-pressed",
                  isDarkNow ? "true" : "false",
                );
              }
              if (mobileThemeToggle) {
                mobileThemeToggle.setAttribute(
                  "aria-pressed",
                  isDarkNow ? "true" : "false",
                );
              }
              
              localStorage.setItem("theme", isDarkNow ? "dark" : "light");
            },
          });
        }

        // Add event listeners to both theme toggles
        if (themeToggle) {
          themeToggle.addEventListener("click", toggleTheme);
        }
        if (mobileThemeToggle) {
          mobileThemeToggle.addEventListener("click", toggleTheme);
        }
      }

      function initNavigation() {
        const navItems = document.querySelectorAll(".nav-item");
        const navIndicator = document.getElementById("navIndicator");
        const sections = document.querySelectorAll("section");

        // Set initial active nav item
        updateNavIndicator("home");

        // Nav item click handlers with rolling animation
        navItems.forEach((item) => {
          const text = item.querySelector(".nav-text:first-child");
          const clone = item.querySelector(".nav-text.clone");

          // Hover animation
          item.addEventListener("mouseenter", () => {
            gsap.to(text, {
              duration: 0.3,
              y: -30,
              ease: "power2.out",
            });
            gsap.to(clone, {
              duration: 0.3,
              y: -30,
              ease: "power2.out",
            });
          });

          item.addEventListener("mouseleave", () => {
            gsap.to(text, {
              duration: 0.3,
              y: 0,
              ease: "power2.out",
            });
            gsap.to(clone, {
              duration: 0.3,
              y: 30,
              ease: "power2.out",
            });
          });

          // Click handler
          item.addEventListener("click", () => {
            const targetId = item.getAttribute("data-target");
            scrollToSection(targetId);
          });
        });

        // Button hover animations
        document.querySelectorAll(".btn").forEach((btn) => {
          const text = btn.querySelector(".btn-text:first-child");
          const clone = btn.querySelector(".btn-text.clone");

          btn.addEventListener("mouseenter", () => {
            gsap.to(text, {
              duration: 0.3,
              y: -24,
              ease: "power2.out",
            });
            gsap.to(clone, {
              duration: 0.3,
              y: -24,
              ease: "power2.out",
            });
          });

          btn.addEventListener("mouseleave", () => {
            gsap.to(text, {
              duration: 0.3,
              y: 0,
              ease: "power2.out",
            });
            gsap.to(clone, {
              duration: 0.3,
              y: 24,
              ease: "power2.out",
            });
          });
        });

        // Update nav indicator on scroll
        window.addEventListener("scroll", updateActiveSection);

        // Header scroll effect
        window.addEventListener("scroll", () => {
          const header = document.getElementById("header");
          if (window.scrollY > 100) {
            header.classList.add("scrolled");
          } else {
            header.classList.remove("scrolled");
          }
        });
      }

      function updateActiveSection() {
        const sections = document.querySelectorAll("section");
        const scrollPosition = window.scrollY + 100;

        sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;
          const sectionId = section.getAttribute("id");

          if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
          ) {
            updateNavIndicator(sectionId);
            updateMobileNavActive(sectionId);
          }
        });
      }

      function updateNavIndicator(sectionId) {
        const navItems = document.querySelectorAll(".nav-item");
        const navIndicator = document.getElementById("navIndicator");
        const activeItem = document.querySelector(
          `.nav-item[data-target="${sectionId}"]`,
        );

        if (activeItem) {
          const rect = activeItem.getBoundingClientRect();
          const headerRect = document
            .getElementById("header")
            .getBoundingClientRect();

          gsap.to(navIndicator, {
            duration: 0.3,
            left: rect.left - headerRect.left,
            width: rect.width,
            ease: "power2.out",
          });

          navItems.forEach((item) => {
            if (item.getAttribute("data-target") === sectionId) {
              item.classList.add("active");
            } else {
              item.classList.remove("active");
            }
          });
        }
      }

      function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
          window.scrollTo({
            top: section.offsetTop,
            behavior: "smooth",
          });

          // Close mobile menu if open
          closeMobileMenu();
        }
      }

      function initTypewriter() {
        const typewriter = document.getElementById("typewriter");
        if (!typewriter) return;

        const texts = [
          "Information Science Student",
          "Full Stack Developer",
          "Engineering Student",
          "Tech Enthusiast",
          "Problem Solver",
          "UI/UX Designer",
          "JavaScript Developer",
        ];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;

        function type() {
          if (isPaused) return;

          const currentText = texts[textIndex];

          if (isDeleting) {
            typewriter.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
          } else {
            typewriter.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
          }

          let speed = isDeleting ? 50 : 100;

          if (!isDeleting && charIndex === currentText.length) {
            isPaused = true;
            setTimeout(() => {
              isPaused = false;
              isDeleting = true;
              type();
            }, 2000);
            return;
          } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            speed = 500;
          }

          setTimeout(type, speed);
        }

        // Start typing after hero animation
        setTimeout(type, 2000);
      }

      function animateHero() {
        const heroText = document.querySelector(".hero-text h1");
        const spans = heroText.querySelectorAll("span");
        const subtitle = document.querySelector(".hero-text .section-subtitle");
        const buttons = document.querySelector(".hero-buttons");

        // Animate name
        gsap.fromTo(
          spans,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out",
            delay: 0.5,
          },
        );

        // Animate subtitle
        gsap.fromTo(
          subtitle,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 1.2,
            ease: "power2.out",
          },
        );

        // Animate buttons
        gsap.fromTo(
          buttons.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            delay: 1.8,
            ease: "power2.out",
          },
        );

        // Animate profile image (subtle fade + scale)
        const profileCard = document.querySelector(".profile-card");
        gsap.fromTo(
          profileCard,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.9,
            delay: 0.6,
            ease: "power2.out",
          },
        );
      }

      function initScrollAnimations() {
        // Initialize GSAP ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Animate section headings
        gsap.utils.toArray(".section-heading").forEach((heading) => {
          gsap.from(heading, {
            scrollTrigger: {
              trigger: heading,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          });
        });

        // Animate cards
        gsap.utils
          .toArray(
            ".stat-card, .skill-category, .project-card, .achievement-card, .highlight-card, .tool-card",
          )
          .forEach((card) => {
            gsap.from(card, {
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse",
              },
              y: 50,
              opacity: 0,
              duration: 0.8,
              ease: "power2.out",
            });
          });

        // Animate timeline items (use fromTo so CSS-hidden items animate to visible)
        gsap.utils.toArray(".timeline-item").forEach((item, i) => {
          gsap.fromTo(
            item,
            { x: i % 2 === 0 ? -100 : 100, opacity: 0 },
            {
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse",
              },
              x: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              delay: i * 0.2,
            },
          );
        });

        // Animate skill bars
        gsap.utils.toArray(".skill-progress").forEach((bar) => {
          const width = bar.getAttribute("data-width");
          gsap.to(bar, {
            scrollTrigger: {
              trigger: bar,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse",
            },
            width: `${width}%`,
            duration: 1.5,
            ease: "power2.out",
          });
        });

        // Animate contact items
        gsap.utils.toArray(".contact-item").forEach((item, i) => {
          gsap.from(item, {
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play none none reverse",
            },
            x: -50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: i * 0.1,
          });
        });

        // Animate social links
        gsap.utils.toArray(".social-link").forEach((link, i) => {
          gsap.from(link, {
            scrollTrigger: {
              trigger: link,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play none none reverse",
            },
            scale: 0,
            rotation: 180,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            delay: i * 0.1,
          });
        });
      }

      // NEW: Mobile Navigation Functions
      function initMobileNavigation() {
        const mobileMenuToggle = document.getElementById("mobileMenuToggle");
        const mobileNavOverlay = document.getElementById("mobileNavOverlay");
        const mobileNavMenu = document.getElementById("mobileNavMenu");
        const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

        // Toggle mobile menu
        function toggleMobileMenu() {
          mobileMenuToggle.classList.toggle("active");
          mobileNavOverlay.classList.toggle("active");
          mobileNavMenu.classList.toggle("active");
          
          // Prevent body scroll when menu is open
          document.body.style.overflow = mobileNavMenu.classList.contains("active") ? "hidden" : "";
        }

        // Close mobile menu
        function closeMobileMenu() {
          mobileMenuToggle.classList.remove("active");
          mobileNavOverlay.classList.remove("active");
          mobileNavMenu.classList.remove("active");
          document.body.style.overflow = "";
        }

        // Update active mobile nav link
        function updateMobileNavActive(sectionId) {
          mobileNavLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("data-target") === sectionId) {
              link.classList.add("active");
            }
          });
        }

        // Event listeners
        if (mobileMenuToggle) {
          mobileMenuToggle.addEventListener("click", toggleMobileMenu);
        }

        if (mobileNavOverlay) {
          mobileNavOverlay.addEventListener("click", closeMobileMenu);
        }

        // Mobile nav link clicks
        mobileNavLinks.forEach(link => {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("data-target");
            scrollToSection(targetId);
            closeMobileMenu();
          });
        });

        // Close menu on escape key
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && mobileNavMenu.classList.contains("active")) {
            closeMobileMenu();
          }
        });

        // Expose closeMobileMenu function globally
        window.closeMobileMenu = closeMobileMenu;
        window.updateMobileNavActive = updateMobileNavActive;
      }

      function initScrollProgress() {
        const progressBar = document.querySelector(".scroll-progress-bar");

        window.addEventListener("scroll", () => {
          const windowHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
          const scrolled = (window.scrollY / windowHeight) * 100;

          gsap.to(progressBar, {
            width: `${scrolled}%`,
            duration: 0.3,
            ease: "power2.out",
          });

          // Show/hide scroll indicator
          const scrollIndicator = document.getElementById("scrollIndicator");
          if (window.scrollY > 100) {
            scrollIndicator.style.opacity = "0";
          } else {
            scrollIndicator.style.opacity = "0.7";
          }
        });
      }

      function initBackToTop() {
        const backToTop = document.getElementById("backToTop");

        window.addEventListener("scroll", () => {
          if (window.scrollY > 500) {
            backToTop.classList.add("visible");
          } else {
            backToTop.classList.remove("visible");
          }
        });

        backToTop.addEventListener("click", () => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });
      }

      function initFormSubmission() {
        const contactForm = document.getElementById("contactForm");

        contactForm.addEventListener("submit", function (e) {
          e.preventDefault();

          const submitBtn = this.querySelector('button[type="submit"]');
          const originalContent = submitBtn.innerHTML;

          // Show loading state
          submitBtn.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> SENDING...';
          submitBtn.disabled = true;

          // Simulate API call
          setTimeout(() => {
            // Show success animation
            submitBtn.innerHTML = '<i class="fas fa-check"></i> SENT!';

            // Add confetti effect
            createConfetti();

            // Reset form
            this.reset();

            // Reset button after 2 seconds
            setTimeout(() => {
              submitBtn.innerHTML = originalContent;
              submitBtn.disabled = false;
            }, 2000);
          }, 1500);
        });
      }

      // Create a project-card element matching existing layout
      function createProjectCard(title, techs, description) {
        const card = document.createElement("div");
        card.className = "project-card";

        const h3 = document.createElement("h3");
        h3.textContent = title;
        card.appendChild(h3);

        const techWrap = document.createElement("div");
        techWrap.className = "project-tech";
        techs.forEach((t) => {
          const span = document.createElement("span");
          span.className = "tech-tag";
          span.textContent = t;
          techWrap.appendChild(span);
        });
        card.appendChild(techWrap);

        const p = document.createElement("p");
        p.className = "project-description";
        p.textContent = description;
        card.appendChild(p);

        const a = document.createElement("a");
        a.href = "#";
        a.className = "btn btn-secondary";
        a.style.marginTop = "20px";
        a.style.width = "auto";
        a.innerHTML = `
                <i class="fas fa-external-link-alt"></i>
                <span>
                    <div class="btn-text">VIEW PROJECT</div>
                    <div class="btn-text clone">VIEW PROJECT</div>
                </span>`;
        card.appendChild(a);

        return card;
      }

      function initViewMoreProjects() {
        const btn = document.getElementById("viewMoreBtn");
        if (!btn) return;

        const projectsGrid = document.querySelector(".projects-grid");
        let extraAdded = false;
        let extraElements = [];

        btn.addEventListener("click", function (e) {
          e.preventDefault();

          const primaryText = btn.querySelector(".btn-text");
          const cloneText = btn.querySelector(".btn-text.clone");

          if (!extraAdded) {
            // Create 3 extra projects
            const p1 = createProjectCard(
              "Campus Analytics Dashboard",
              ["React", "D3.js", "PostgreSQL"],
              "Data visualization dashboard for campus metrics and analytics.",
            );
            const p2 = createProjectCard(
              "Mobile Attendance App",
              ["React Native", "Firebase"],
              "Mobile app for students to mark attendance and receive updates.",
            );
            const p3 = createProjectCard(
              "AI Tutor Chatbot",
              ["Python", "TensorFlow", "Flask"],
              "An intelligent chatbot to assist students with course queries and practice problems.",
            );

            extraElements = [p1, p2, p3];
            extraElements.forEach((el) => projectsGrid.appendChild(el));

            // Animate them into view
            gsap.from(extraElements, {
              y: 30,
              opacity: 0,
              stagger: 0.1,
              duration: 0.6,
              ease: "power2.out",
            });

            primaryText.textContent = "VIEW LESS";
            cloneText.textContent = "VIEW LESS";
            extraAdded = true;
          } else {
            // Remove appended elements
            extraElements.forEach((el) => el.remove());
            extraElements = [];
            primaryText.textContent = "VIEW MORE";
            cloneText.textContent = "VIEW MORE";
            extraAdded = false;
          }
        });
      }

      function initFloatingElements() {
        const container = document.querySelector(".floating-elements");

        // Create additional floating elements
        for (let i = 0; i < 8; i++) {
          const element = document.createElement("div");
          element.className = "floating-element";

          // Random properties
          const size = Math.random() * 150 + 50;
          const colors = [
            "var(--primary)",
            "var(--secondary)",
            "var(--accent)",
            "var(--success)",
          ];
          const color = colors[Math.floor(Math.random() * colors.length)];

          element.style.width = `${size}px`;
          element.style.height = `${size}px`;
          element.style.background = color;
          element.style.top = `${Math.random() * 100}%`;
          element.style.left = `${Math.random() * 100}%`;
          element.style.animationDelay = `${Math.random() * -20}s`;
          element.style.animationDuration = `${Math.random() * 20 + 20}s`;

          container.appendChild(element);
        }

        // Create larger decorative background spheres
        const sphereColors = [
          "radial-gradient(circle at 30% 30%, rgba(139,92,246,0.9), rgba(139,92,246,0.2))",
          "radial-gradient(circle at 60% 40%, rgba(59,130,246,0.9), rgba(59,130,246,0.18))",
          "radial-gradient(circle at 40% 70%, rgba(6,182,212,0.9), rgba(6,182,212,0.12))",
          "radial-gradient(circle at 70% 20%, rgba(16,185,129,0.9), rgba(16,185,129,0.12))",
        ];

        // (removed background spheres)
      }

      function createConfetti() {
        const colors = ["#8B5CF6", "#3B82F6", "#06B6D4", "#10B981"];

        for (let i = 0; i < 100; i++) {
          const confetti = document.createElement("div");
          confetti.style.position = "fixed";
          confetti.style.width = "10px";
          confetti.style.height = "10px";
          confetti.style.background =
            colors[Math.floor(Math.random() * colors.length)];
          confetti.style.borderRadius = "50%";
          confetti.style.left = `${Math.random() * 100}vw`;
          confetti.style.top = "0";
          confetti.style.zIndex = "9999";
          confetti.style.pointerEvents = "none";

          document.body.appendChild(confetti);

          // Animate confetti
          gsap.to(confetti, {
            y: window.innerHeight,
            x: Math.random() * 400 - 200,
            rotation: Math.random() * 360,
            duration: Math.random() * 2 + 1,
            ease: "power2.out",
            onComplete: () => confetti.remove(),
          });
        }
      }

      // Parallax effect for floating elements
      window.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth) * 20 - 10;
        const y = (e.clientY / window.innerHeight) * 20 - 10;

        gsap.to(".floating-element", {
          x: x,
          y: y,
          duration: 1,
          ease: "power2.out",
        });
      });

      // Initialize scroll indicator visibility
      window.dispatchEvent(new Event("scroll"));
// ... [Previous code remains exactly the same until after the initFloatingElements function]

function initFloatingElements() {
  const container = document.querySelector(".floating-elements");
  
  // Keep your existing 2D elements
  for (let i = 0; i < 8; i++) {
    const element = document.createElement("div");
    element.className = "floating-element";

    const size = Math.random() * 150 + 50;
    const colors = [
      "var(--primary)",
      "var(--secondary)",
      "var(--accent)",
      "var(--success)",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.background = color;
    element.style.top = `${Math.random() * 100}%`;
    element.style.left = `${Math.random() * 100}%`;
    element.style.animationDelay = `${Math.random() * -20}s`;
    element.style.animationDuration = `${Math.random() * 20 + 20}s`;

    container.appendChild(element);
  }

  // Initialize Three.js - FIXED VERSION
  initThreeJSBackground();
}

function initThreeJSBackground() {
  // Only proceed if Three.js is available
  if (typeof THREE === 'undefined') {
    console.log('Three.js not loaded');
    return;
  }

  const container = document.querySelector('.floating-elements');
  if (!container) return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  
  const canvas = renderer.domElement;
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'auto'; // Enable interaction
  container.appendChild(canvas);
  
  // Camera setup - ZOOM will be controlled by scroll
  camera.position.set(0, 0, 30); // Start further back

  // Get theme colors
  const rootStyles = getComputedStyle(document.documentElement);
  const themeColors = [
    parseInt(rootStyles.getPropertyValue('--primary').replace('#', '0x')),
    parseInt(rootStyles.getPropertyValue('--secondary').replace('#', '0x')),
    parseInt(rootStyles.getPropertyValue('--accent').replace('#', '0x')),
    parseInt(rootStyles.getPropertyValue('--success').replace('#', '0x'))
  ];

  // Create GALAXY structure (without round particles)
  createGalaxyStructure(scene, themeColors);
  
  // Create WAVE particles (not round spheres)
  createWaveParticles(scene, themeColors);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);
  
  // Multiple colored lights
  themeColors.forEach((color, i) => {
    const light = new THREE.PointLight(color, 0.5, 100);
    const angle = (i / themeColors.length) * Math.PI * 2;
    light.position.set(
      Math.cos(angle) * 20,
      Math.sin(angle) * 15,
      15
    );
    scene.add(light);
  });

  // Interactive variables
  let mouseX = 0;
  let mouseY = 0;
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let rotation = { x: 0, y: 0 };
  let targetRotation = { x: 0, y: 0 };
  
  // Scroll variables for ZOOM
  let scrollY = 0;
  let targetScrollY = 0;
  let scrollProgress = 0;
  let zoomLevel = 30; // Camera Z position
  
  // Mouse interaction - DRAG TO ROTATE
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    canvas.style.cursor = 'grabbing';
  });
  
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      targetRotation.y = deltaX * 0.01;
      targetRotation.x = deltaY * 0.01;
      
      dragStart.x = e.clientX;
      dragStart.y = e.clientY;
    }
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
    canvas.style.cursor = 'grab';
    // Smooth return to center
    targetRotation.x *= 0.5;
    targetRotation.y *= 0.5;
  });
  
  // Touch support
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDragging = true;
    dragStart.x = e.touches[0].clientX;
    dragStart.y = e.touches[0].clientY;
  });
  
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isDragging) {
      const deltaX = e.touches[0].clientX - dragStart.x;
      const deltaY = e.touches[0].clientY - dragStart.y;
      
      targetRotation.y = deltaX * 0.01;
      targetRotation.x = deltaY * 0.01;
      
      dragStart.x = e.touches[0].clientX;
      dragStart.y = e.touches[0].clientY;
    }
  });
  
  canvas.addEventListener('touchend', () => {
    isDragging = false;
    targetRotation.x *= 0.5;
    targetRotation.y *= 0.5;
  });
  
  // Scroll interaction - ZOOM CONTROL
  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = maxScroll > 0 ? targetScrollY / maxScroll : 0;
    
    // ZOOM based on scroll - as you scroll down, zoom in
    zoomLevel = 30 - (scrollProgress * 15); // From 30 to 15 (zooming in)
  });

  // Animation loop
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    
    const time = clock.getElapsedTime();
    const delta = clock.getDelta();
    
    // Smooth rotation interpolation
    rotation.x += (targetRotation.x - rotation.x) * 0.1;
    rotation.y += (targetRotation.y - rotation.y) * 0.1;
    
    // Update galaxy
    updateGalaxyStructure(time, rotation, mouseX, mouseY, scrollProgress);
    
    // Update wave particles
    updateWaveParticles(time, mouseX, mouseY, scrollProgress);
    
    // Camera ZOOM based on scroll
    camera.position.z += (zoomLevel - camera.position.z) * 0.1;
    
    // Camera look at with smooth follow
    const lookAtX = rotation.y * 5;
    const lookAtY = rotation.x * 3;
    camera.lookAt(lookAtX, lookAtY, 0);
    
    // Scene rotation
    scene.rotation.x = rotation.x;
    scene.rotation.y = rotation.y;
    
    // Add gentle auto-rotation when not dragging
    if (!isDragging) {
      scene.rotation.y += 0.001;
      scene.rotation.x = Math.sin(time * 0.1) * 0.05;
    }
    
    renderer.render(scene, camera);
  }

  // Handle window resize
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onWindowResize, false);
  
  // Start animation
  animate();
  
  // Set initial cursor
  canvas.style.cursor = 'grab';
}

// GALAXY STRUCTURE - NO ROUND SPHERES
function createGalaxyStructure(scene, colors) {
  const galaxy = new THREE.Group();
  
  // Create TORUS KNOT structure (not spheres)
  const knotGeometry = new THREE.TorusKnotGeometry(8, 3, 256, 32, 3, 4);
  const knotMaterial = new THREE.MeshBasicMaterial({
    color: colors[0],
    transparent: true,
    opacity: 0.15,
    wireframe: true
  });
  
  const mainKnot = new THREE.Mesh(knotGeometry, knotMaterial);
  galaxy.add(mainKnot);
  
  // Create smaller inner knot
  const innerKnotGeometry = new THREE.TorusKnotGeometry(5, 2, 128, 24, 2, 3);
  const innerKnotMaterial = new THREE.MeshBasicMaterial({
    color: colors[1],
    transparent: true,
    opacity: 0.2,
    wireframe: true
  });
  
  const innerKnot = new THREE.Mesh(innerKnotGeometry, innerKnotMaterial);
  galaxy.add(innerKnot);
  
  // Create GEOMETRIC LINES network (not spheres)
  const lines = new THREE.Group();
  
  // Create a dodecahedron wireframe
  const dodecaGeometry = new THREE.DodecahedronGeometry(6, 0);
  const dodecaEdges = new THREE.EdgesGeometry(dodecaGeometry);
  const dodecaLine = new THREE.LineSegments(
    dodecaEdges,
    new THREE.LineBasicMaterial({ 
      color: colors[2], 
      transparent: true, 
      opacity: 0.3,
      linewidth: 1 
    })
  );
  lines.add(dodecaLine);
  
  // Create an icosahedron wireframe
  const icosaGeometry = new THREE.IcosahedronGeometry(4, 0);
  const icosaEdges = new THREE.EdgesGeometry(icosaGeometry);
  const icosaLine = new THREE.LineSegments(
    icosaEdges,
    new THREE.LineBasicMaterial({ 
      color: colors[3], 
      transparent: true, 
      opacity: 0.4,
      linewidth: 1 
    })
  );
  lines.add(icosaLine);
  
  galaxy.add(lines);
  
  // Create ENERGY RIBBONS (not spheres)
  const ribbons = new THREE.Group();
  const ribbonCount = 6;
  
  for (let i = 0; i < ribbonCount; i++) {
    const points = [];
    const ribbonLength = 50;
    
    for (let j = 0; j < ribbonLength; j++) {
      const t = j / ribbonLength;
      const angle = t * Math.PI * 4 + (i / ribbonCount) * Math.PI * 2;
      const radius = 7 + Math.sin(t * Math.PI * 2) * 2;
      
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        (t - 0.5) * 15,
        Math.sin(angle) * radius
      ));
    }
    
    const ribbonGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const ribbonMaterial = new THREE.LineBasicMaterial({
      color: colors[i % colors.length],
      transparent: true,
      opacity: 0.15,
      linewidth: 2
    });
    
    const ribbon = new THREE.Line(ribbonGeometry, ribbonMaterial);
    ribbons.add(ribbon);
    
    ribbon.userData = {
      index: i,
      speed: 0.02 + i * 0.005
    };
  }
  
  galaxy.add(ribbons);
  
  // Create FLOATING TRIANGLES (not spheres)
  const triangles = new THREE.Group();
  const triangleCount = 100;
  
  for (let i = 0; i < triangleCount; i++) {
    const triangleGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -0.1, 0.17, 0,
      0.1, 0.17, 0,
      0, -0.17, 0
    ]);
    
    triangleGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    const triangleMaterial = new THREE.MeshBasicMaterial({
      color: colors[i % colors.length],
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    
    const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial);
    
    // Position in sphere
    const radius = 12 + Math.random() * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    triangle.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );
    
    // Random rotation
    triangle.rotation.x = Math.random() * Math.PI * 2;
    triangle.rotation.y = Math.random() * Math.PI * 2;
    triangle.rotation.z = Math.random() * Math.PI * 2;
    
    triangle.userData = {
      originalPos: triangle.position.clone(),
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      ),
      floatSpeed: 0.5 + Math.random() * 0.5,
      floatOffset: Math.random() * Math.PI * 2
    };
    
    triangles.add(triangle);
  }
  
  galaxy.add(triangles);
  
  // Store references
  window.galaxy = galaxy;
  window.mainKnot = mainKnot;
  window.innerKnot = innerKnot;
  window.lines = lines;
  window.ribbons = ribbons;
  window.triangles = triangles;
  
  scene.add(galaxy);
}

// WAVE PARTICLES - NO ROUND SPHERES
function createWaveParticles(scene, colors) {
  const waveParticles = new THREE.Group();
  
  // Create WAVE LINES instead of round particles
  const waveCount = 8;
  const pointsPerWave = 100;
  
  for (let w = 0; w < waveCount; w++) {
    const wavePoints = [];
    const waveAmplitude = 3 + w * 0.5;
    const waveFrequency = 0.5 + w * 0.1;
    
    for (let i = 0; i < pointsPerWave; i++) {
      const t = i / pointsPerWave;
      const x = (t - 0.5) * 40;
      const y = Math.sin(t * Math.PI * waveFrequency + w) * waveAmplitude;
      const z = Math.cos(w) * 5;
      
      wavePoints.push(new THREE.Vector3(x, y, z));
    }
    
    const waveGeometry = new THREE.BufferGeometry().setFromPoints(wavePoints);
    const waveMaterial = new THREE.LineBasicMaterial({
      color: colors[w % colors.length],
      transparent: true,
      opacity: 0.2 + w * 0.05,
      linewidth: 1
    });
    
    const waveLine = new THREE.Line(waveGeometry, waveMaterial);
    
    waveLine.userData = {
      waveIndex: w,
      amplitude: waveAmplitude,
      frequency: waveFrequency,
      speed: 0.05 + w * 0.01,
      offset: Math.random() * Math.PI * 2
    };
    
    waveParticles.add(waveLine);
  }
  
  // Create FLOATING SQUARES grid
  const squares = new THREE.Group();
  const gridSize = 20;
  
  for (let x = -gridSize; x <= gridSize; x += 2) {
    for (let z = -gridSize; z <= gridSize; z += 2) {
      const squareGeometry = new THREE.PlaneGeometry(0.3, 0.3);
      const squareMaterial = new THREE.MeshBasicMaterial({
        color: colors[Math.abs(x + z) % colors.length],
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });
      
      const square = new THREE.Mesh(squareGeometry, squareMaterial);
      square.position.set(x, 0, z);
      
      square.userData = {
        originalX: x,
        originalZ: z,
        speed: 0.02 + Math.random() * 0.03,
        offset: Math.random() * Math.PI * 2
      };
      
      squares.add(square);
    }
  }
  
  waveParticles.add(squares);
  
  window.waveParticles = waveParticles;
  window.waveLines = waveParticles.children.slice(0, waveCount);
  window.squaresGrid = squares;
  
  scene.add(waveParticles);
}

function updateGalaxyStructure(time, rotation, mouseX, mouseY, scrollProgress) {
  if (!window.galaxy) return;
  
  const { mainKnot, innerKnot, lines, ribbons, triangles } = window;
  
  // Scale based on scroll (ZOOM effect)
  const scale = 0.8 + scrollProgress * 0.4;
  window.galaxy.scale.set(scale, scale, scale);
  
  // Rotate knots
  if (mainKnot) {
    mainKnot.rotation.x = time * 0.1;
    mainKnot.rotation.y = time * 0.15;
    mainKnot.rotation.z = time * 0.05;
    
    // Mouse affects opacity
    const mouseDist = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    mainKnot.material.opacity = 0.15 + mouseDist * 0.1;
  }
  
  if (innerKnot) {
    innerKnot.rotation.x = -time * 0.08;
    innerKnot.rotation.y = -time * 0.12;
    innerKnot.rotation.z = -time * 0.03;
    
    // Scroll affects color intensity
    const hue = scrollProgress;
    innerKnot.material.color.setHSL(hue, 0.8, 0.6);
  }
  
  // Rotate geometric lines
  if (lines) {
    lines.rotation.y = time * 0.05;
    lines.rotation.x = Math.sin(time * 0.1) * 0.1;
    
    // Scale lines with scroll
    const lineScale = 0.9 + scrollProgress * 0.2;
    lines.scale.set(lineScale, lineScale, lineScale);
  }
  
  // Animate ribbons
  if (ribbons && ribbons.children) {
    ribbons.children.forEach(ribbon => {
      if (ribbon.userData) {
        const t = time * ribbon.userData.speed + ribbon.userData.index;
        
        // Move ribbon points
        const positions = ribbon.geometry.attributes.position.array;
        const pointCount = positions.length / 3;
        
        for (let i = 0; i < pointCount; i++) {
          const t2 = i / pointCount;
          const angle = t2 * Math.PI * 4 + ribbon.userData.index;
          const radius = 7 + Math.sin(t2 * Math.PI * 2 + t) * 2;
          
          const idx = i * 3;
          positions[idx] = Math.cos(angle) * radius; // x
          positions[idx + 1] = (t2 - 0.5) * 15 + Math.sin(t + i * 0.1) * 0.5; // y
          positions[idx + 2] = Math.sin(angle) * radius; // z
        }
        
        ribbon.geometry.attributes.position.needsUpdate = true;
        
        // Pulse opacity
        ribbon.material.opacity = 0.15 + Math.sin(t * 2) * 0.1;
      }
    });
  }
  
  // Animate triangles
  if (triangles && triangles.children) {
    triangles.children.forEach(triangle => {
      if (triangle.userData) {
        const data = triangle.userData;
        const t = time * data.floatSpeed + data.floatOffset;
        
        // Floating motion
        triangle.position.x = data.originalPos.x + Math.sin(t) * 0.5;
        triangle.position.y = data.originalPos.y + Math.cos(t * 1.3) * 0.5;
        triangle.position.z = data.originalPos.z + Math.sin(t * 0.7) * 0.5;
        
        // Rotation
        triangle.rotation.x += data.rotationSpeed.x;
        triangle.rotation.y += data.rotationSpeed.y;
        triangle.rotation.z += data.rotationSpeed.z;
        
        // Mouse influence
        const dx = triangle.position.x - mouseX * 10;
        const dy = triangle.position.y - mouseY * 10;
        const mouseDist = Math.sqrt(dx*dx + dy*dy);
        const mouseForce = 1 / (mouseDist + 1);
        
        triangle.position.x += (dx / mouseDist) * mouseForce * 0.5;
        triangle.position.y += (dy / mouseDist) * mouseForce * 0.5;
        
        // Scroll affects scale
        const triangleScale = 0.8 + scrollProgress * 0.4;
        triangle.scale.set(triangleScale, triangleScale, triangleScale);
        
        // Scroll affects opacity
        triangle.material.opacity = 0.4 + scrollProgress * 0.3;
      }
    });
  }
}

function updateWaveParticles(time, mouseX, mouseY, scrollProgress) {
  if (!window.waveParticles) return;
  
  const { waveLines, squaresGrid } = window;
  
  // Animate wave lines
  if (waveLines) {
    waveLines.forEach(waveLine => {
      if (waveLine.userData) {
        const t = time * waveLine.userData.speed + waveLine.userData.offset;
        
        // Update wave points
        const positions = waveLine.geometry.attributes.position.array;
        const pointCount = positions.length / 3;
        
        for (let i = 0; i < pointCount; i++) {
          const x = (i / pointCount - 0.5) * 40;
          const y = Math.sin(i / pointCount * Math.PI * waveLine.userData.frequency + t) * waveLine.userData.amplitude;
          const z = Math.cos(waveLine.userData.waveIndex) * 5;
          
          const idx = i * 3;
          positions[idx] = x; // x
          positions[idx + 1] = y + mouseY * 2; // y with mouse influence
          positions[idx + 2] = z + mouseX * 2; // z with mouse influence
        }
        
        waveLine.geometry.attributes.position.needsUpdate = true;
        
        // Scroll affects wave amplitude
        waveLine.userData.amplitude = 3 + waveLine.userData.waveIndex * 0.5 + scrollProgress * 2;
        
        // Pulse opacity
        waveLine.material.opacity = 0.2 + waveLine.userData.waveIndex * 0.05 + Math.sin(t) * 0.1;
      }
    });
  }
  
  // Animate squares grid
  if (squaresGrid && squaresGrid.children) {
    squaresGrid.children.forEach(square => {
      if (square.userData) {
        const t = time * square.userData.speed + square.userData.offset;
        
        // Floating motion
        const floatY = Math.sin(t + square.userData.originalX * 0.1 + square.userData.originalZ * 0.1) * 2;
        square.position.y = floatY;
        
        // Mouse influence
        const dx = square.position.x - mouseX * 15;
        const dz = square.position.z - mouseY * 15;
        const mouseDist = Math.sqrt(dx*dx + dz*dz);
        const mouseForce = 1 / (mouseDist + 1);
        
        square.position.y += Math.sin(mouseDist * 0.5 + t) * mouseForce * 3;
        
        // Rotation based on position
        square.rotation.x = time * 0.1 + square.userData.originalX * 0.05;
        square.rotation.y = time * 0.15 + square.userData.originalZ * 0.05;
        
        // Scroll affects scale and opacity
        const squareScale = 0.8 + scrollProgress * 0.4;
        square.scale.set(squareScale, squareScale, squareScale);
        
        square.material.opacity = 0.2 + Math.sin(t) * 0.1 + scrollProgress * 0.3;
        
        // Scroll affects color
        const hue = (square.position.y + 10) / 20 + scrollProgress * 0.3;
        square.material.color.setHSL(hue, 0.8, 0.6);
      }
    });
  }
}

// ... [Rest of the code remains exactly the same]