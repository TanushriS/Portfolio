/* ═══════════════════════════════════════════════════════════
   PORTFOLIO JS — Tanushri Rajesh Sukhwal
   All animations, scroll reveal, theme toggle, counters
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // ── THEME TOGGLE ──
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.setAttribute('data-lucide', theme === 'light' ? 'moon' : 'sun');
      if (window.lucide) lucide.createIcons();
    }
  }

  // ── HAMBURGER MENU ──
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ── NAVBAR SCROLL EFFECT ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ── ACTIVE NAV LINK ON SCROLL ──
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a');

  function setActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop - 80;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < bottom) {
        navAnchors.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === `#${id}`) {
            a.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', setActiveNav);

  // ── INTERSECTION OBSERVER: SCROLL REVEAL ──
  const revealClasses = [
    'reveal-element',
    'reveal-left',
    'reveal-right',
    'reveal-scale',
    'reveal-drop',
    'reveal-rise'
  ];

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealClasses.forEach(cls => {
    document.querySelectorAll(`.${cls}`).forEach(el => {
      revealObserver.observe(el);
    });
  });

  // ── SKILL BAR ANIMATION ──
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const percent = entry.target.getAttribute('data-percent');
        entry.target.style.width = percent + '%';

        // Animate the percentage number
        const card = entry.target.closest('.skill-item');
        if (card) {
          const percentEl = card.querySelector('.skill-percent');
          if (percentEl) {
            animateCounter(percentEl, 0, parseInt(percent), 1200, '%');
          }
        }

        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  // ── STAT COUNTER ANIMATION ──
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-count'));
        animateCounter(entry.target, 0, target, 1500, '+');
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => statObserver.observe(num));

  function animateCounter(el, start, end, duration, suffix) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // ── EXPERIENCE BULLET STAGGER ──
  const expSection = document.querySelector('#experience');
  if (expSection) {
    const bulletObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bullets = entry.target.querySelectorAll('.exp-right ul li');
          bullets.forEach((li, i) => {
            li.style.opacity = '0';
            li.style.transform = 'translateX(-20px)';
            li.style.transition = `opacity 0.4s ease ${i * 0.15}s, transform 0.4s ease ${i * 0.15}s`;
            setTimeout(() => {
              li.style.opacity = '1';
              li.style.transform = 'translateX(0)';
            }, 50);
          });
          bulletObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.experience-card').forEach(card => {
      bulletObserver.observe(card);
    });
  }

  // ── EDUCATION HIGHLIGHT TYPEWRITER FEEL ──
  const eduCards = document.querySelectorAll('.edu-card');
  const eduObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.edu-highlights li');
        items.forEach((item, i) => {
          item.style.opacity = '0';
          item.style.transform = 'translateX(-15px)';
          item.style.transition = `opacity 0.5s ease ${i * 0.2}s, transform 0.5s ease ${i * 0.2}s`;
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          }, 100);
        });
        eduObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  eduCards.forEach(card => eduObserver.observe(card));

  // ── PROJECTS FILTER BAR STATE & DYNAMIC RENDER ──
  const projects = [
    {
      id: "ai-interviewer",
      title: "AI Technical Interviewer",
      date: "July 2026",
      tags: ["All", "AI / ML", "Full Stack"],
      description: "A microservice-based AI technical interviewer using DeepSeek-R1 (Ollama) and Whisper speech-to-text for real-time coding evaluations and automated candidate feedback.",
      bulletPoints: [
        "Orchestrated real-time WebSocket sessions using Node.js API Gateway and Socket.io",
        "Engineered local transcription service using FastAPI, Uvicorn, and OpenAI Whisper",
        "Integrated low-latency local reasoning model using Ollama (deepseek-r1:1.5b)",
        "Built candidate UI featuring Monaco Editor, Redux Toolkit, and Chart.js"
      ],
      techStack: ["React", "Redux", "TailwindCSS", "Monaco Editor", "Chart.js", "Node.js", "Express", "MongoDB", "Socket.io", "FastAPI", "Whisper", "Ollama"]
    },
    {
      id: "nourishfy",
      title: "Nourishfy – AI Nutrition & Smart Groceries",
      date: "Sept. 2025",
      tags: ["All", "Full Stack", "AI / ML"],
      description: "AI-powered nutrition planner that generates personalized weekly food plans based on user deficiencies, symptoms, and dietary exclusions using Gemini 2.5-flash.",
      bulletPoints: [
        "Generated personalized weekly nutrition plans using Gemini 2.5-flash",
        "Implemented Firebase Authentication and Firestore for real-time profile, plan, and grocery tracking",
        "Built dynamic grocery list generation with food image caching for optimized performance",
        "Delivered a fully responsive, mobile-first UI with dark/light mode"
      ],
      techStack: ["React.js", "Tailwind CSS", "Firebase Auth", "Firestore", "Gemini 2.5 API"]
    },
    {
      id: "thermosense",
      title: "Thermosense",
      date: "Aug 2025",
      tags: ["All", "Systems", "AI / ML", "Full Stack"],
      description: "Cross‑platform battery–health dashboard powered by a Random‑Forest model, FastAPI, and a React front‑end.",
      bulletPoints: [
        "Extracted native OS hardware telemetry using Python 3.11 (`ioreg` & `powermetrics` for macOS; `WMI` for Windows)",
        "Trained a Random Forest model to forecast battery health and thermal pressure metrics",
        "Containerized deployment using Docker and Nginx reverse proxy",
        "Connected cross-platform native sensors to a responsive React dashboard"
      ],
      techStack: ["Python 3.11", "FastAPI", "Random Forest", "React", "Docker", "Nginx", "Tailwind CSS", "WMI / ioreg"]
    },
    {
      id: "intelliqrhelp",
      title: "IntelliQRHelp",
      date: "Jan. 2025",
      tags: ["All", "Full Stack", "Systems"],
      description: "Emergency response system that generates encrypted QR codes linking to user medical profiles, paired with a secure web dashboard.",
      bulletPoints: [
        "Generated 1,000+ encrypted QR codes linking to user medical profiles",
        "Built a web dashboard used by 300+ users to manage medical details",
        "Enabled each user to manage 5+ emergency contacts securely",
        "Ensured real-time updates via Firebase and Telegram Bot API alerting"
      ],
      techStack: ["React.js", "Tailwind CSS", "Firebase Auth", "Firestore", "QRServer API", "Telegram Bot API"]
    }
  ];

  const projectsContainer = document.getElementById('projects-container');
  const toggleContainer = document.getElementById('projects-toggle-container');
  const toggleBtn = document.getElementById('projects-toggle-btn');
  let activeFilter = "All";
  let isExpanded = false;

  // Reusable IntersectionObserver for outcomes & tags inside dynamic cards
  const projObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger outcome boxes animation inside card
        const outcomes = entry.target.querySelectorAll('.outcome-box');
        outcomes.forEach((box, i) => {
          box.style.opacity = '0';
          box.style.transform = 'scale(0.8) translateY(15px)';
          box.style.transition = `opacity 0.4s ease ${i * 0.1}s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.1}s`;
          setTimeout(() => {
            box.style.opacity = '1';
            box.style.transform = 'scale(1) translateY(0)';
          }, 50);
        });

        // Trigger tech tags animation inside card
        const tags = entry.target.querySelectorAll('.tech-tag');
        tags.forEach((tag, i) => {
          tag.style.opacity = '0';
          tag.style.transform = 'scale(0.3)';
          tag.style.transition = `opacity 0.3s ease ${0.4 + i * 0.08}s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${0.4 + i * 0.08}s`;
          setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'scale(1)';
          }, 50);
        });

        projObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  function renderProjects(filter = "All") {
    if (!projectsContainer) return;

    // Filter projects
    const filteredProjects = projects.filter(p => p.tags.includes(filter));

    // Limit to first 2 by default unless expanded
    const projectsToDisplay = isExpanded ? filteredProjects : filteredProjects.slice(0, 2);

    // Get current cards if any, to animate them out
    const existingCards = projectsContainer.querySelectorAll('.project-card');
    
    if (existingCards.length > 0) {
      // Animate out existing cards
      existingCards.forEach(card => {
        card.classList.remove('fade-enter-active');
        card.classList.add('fade-exit-active');
      });
      // Wait for exit transition, then build new cards
      setTimeout(() => {
        buildNewCards(projectsToDisplay);
        updateToggleButton(filteredProjects.length);
      }, 300);
    } else {
      buildNewCards(projectsToDisplay);
      updateToggleButton(filteredProjects.length);
    }
  }

  function updateToggleButton(totalCount) {
    if (!toggleContainer || !toggleBtn) return;
    
    if (totalCount > 2) {
      toggleContainer.style.display = 'flex';
      toggleBtn.textContent = isExpanded ? 'Show Less' : 'View All Projects';
    } else {
      toggleContainer.style.display = 'none';
    }
  }

  function buildNewCards(projectsList) {
    projectsContainer.innerHTML = '';
    
    projectsList.forEach((project, idx) => {
      const formattedNum = String(idx + 1).padStart(2, '0');
      const projectType = project.date === "Personal Project" ? "System & Data Research" : "Personal Project";
      
      const techHTML = project.techStack
        .map(tech => `<span class="tech-tag">${tech}</span>`)
        .join('');
        
      const outcomesHTML = project.bulletPoints
        .map((point, index) => `
          <div class="outcome-box">
            <span class="outcome-number">${index + 1}</span>
            <span>${point}</span>
          </div>
        `)
        .join('');

      const card = document.createElement('div');
      card.className = 'project-card fade-enter';
      card.innerHTML = `
        <div class="proj-left">
          <span class="proj-number">${formattedNum}</span>
          <h3>${project.title}</h3>
          <p class="proj-type">${projectType}</p>
          <p class="proj-duration">📅 ${project.date}</p>
        </div>
        <div class="proj-right">
          <p class="proj-description">${project.description}</p>
          <div class="proj-outcomes">
            ${outcomesHTML}
          </div>
          <div class="tech-tags">
            ${techHTML}
          </div>
        </div>
      `;

      projectsContainer.appendChild(card);
      
      // Observe the newly added card for outcomes & tags scroll reveal
      projObserver.observe(card);

      // Force reflow
      card.offsetHeight;
      
      // Staggered fade/slide in
      setTimeout(() => {
        card.classList.remove('fade-enter');
        card.classList.add('fade-enter-active');
      }, idx * 150);
    });
  }

  // Setup click listeners for filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Reset expanded state
      isExpanded = false;
      
      activeFilter = btn.getAttribute('data-filter');
      renderProjects(activeFilter);
    });
  });

  // Setup click listener for toggle button
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      
      // Smooth scroll back to top of projects if collapsing
      if (!isExpanded) {
        const projSection = document.getElementById('projects');
        if (projSection) {
          const headerOffset = 80;
          const elementPosition = projSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
      
      renderProjects(activeFilter);
    });
  }

  // Initial render on page load
  renderProjects(activeFilter);

  // ── CERTIFICATION CARDS: WATERFALL CASCADE ──
  const certCards = document.querySelectorAll('.cert-card');
  const certObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(certCards).indexOf(entry.target);
        const randomRot = (Math.random() * 4 - 2).toFixed(1);
        entry.target.style.opacity = '0';
        entry.target.style.transform = `translateY(-20px) rotate(${randomRot}deg)`;
        entry.target.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) rotate(0)';
        }, 50);
        certObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  certCards.forEach(card => certObserver.observe(card));

  // ── CERTIFICATION TILT ON MOUSE MOVE ──
  certCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ── CERTIFICATE MODAL POPUP ──
  const certDialog = document.getElementById('certDialog');
  const certFrame = document.getElementById('certFrame');
  const dialogCertTitle = document.getElementById('dialogCertTitle');
  const closeCertDialog = document.getElementById('closeCertDialog');

  if (certDialog && certFrame) {
    // Add click listeners to all certificate cards
    certCards.forEach(card => {
      card.addEventListener('click', () => {
        const url = card.getAttribute('data-cert-url');
        const title = card.getAttribute('data-cert-title');
        if (url) {
          dialogCertTitle.textContent = title || 'Certificate';
          certFrame.src = url;
          if (!certDialog.open) {
            certDialog.showModal();
          }
        }
      });
    });

    closeCertDialog.addEventListener('click', () => {
      certDialog.close();
    });

    certDialog.addEventListener('close', () => {
      certFrame.src = '';
    });

    // Fallback for browsers without native closedby support
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      certDialog.addEventListener('click', (event) => {
        if (event.target !== certDialog) return;
        const rect = certDialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isDialogContent) {
          certDialog.close();
        }
      });
    }
  }

  // ── ACHIEVEMENT MODAL POPUP ──
  const achCards = document.querySelectorAll('.achievement-card');
  const achDialog = document.getElementById('achDialog');
  const achModalImage = document.getElementById('achModalImage');
  const dialogAchTitle = document.getElementById('dialogAchTitle');
  const closeAchDialog = document.getElementById('closeAchDialog');

  if (achDialog && achModalImage) {
    // Add click listeners to all achievement cards
    achCards.forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('.ach-image');
        const titleEl = card.querySelector('.ach-body h3');
        if (img) {
          const url = img.getAttribute('src');
          const title = titleEl ? titleEl.textContent : 'Achievement';
          dialogAchTitle.textContent = title;
          achModalImage.src = url;
          achModalImage.alt = title;
          if (!achDialog.open) {
            achDialog.showModal();
          }
        }
      });
    });

    closeAchDialog.addEventListener('click', () => {
      achDialog.close();
    });

    achDialog.addEventListener('close', () => {
      achModalImage.src = '';
    });

    // Fallback for browsers without native closedby support
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      achDialog.addEventListener('click', (event) => {
        if (event.target !== achDialog) return;
        const rect = achDialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isDialogContent) {
          achDialog.close();
        }
      });
    }
  }

  // ── SKILL CATEGORY STAGGER ──
  const skillCategories = document.querySelectorAll('.skill-category');
  const skillCatObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(skillCategories).indexOf(entry.target);
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'scale(0.85)';
        entry.target.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'scale(1)';
        }, 50);
        skillCatObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  skillCategories.forEach(cat => skillCatObserver.observe(cat));

  // ── CONTACT FORM: PULSE SEND BUTTON ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const contactObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sendBtn = contactForm.querySelector('.btn-send');
          if (sendBtn) {
            setTimeout(() => {
              sendBtn.style.animation = 'pulse 1s ease';
              sendBtn.addEventListener('animationend', () => {
                sendBtn.style.animation = '';
              }, { once: true });
            }, 800);
          }
          contactObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    contactObserver.observe(contactForm);
  }

  // ── ACHIEVEMENT CARDS: SPRING BOUNCE ──
  const achObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(achCards).indexOf(entry.target);
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'scale(0.7)';
        entry.target.style.transition = `opacity 0.5s ease ${index * 0.08}s, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${index * 0.08}s`;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'scale(1)';
        }, 50);
        achObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  achCards.forEach(card => achObserver.observe(card));

  // ── SMOOTH SCROLL for internal links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ── CONTACT FORM: Sequential underline draw on load ──
  const formGroups = document.querySelectorAll('#contactForm .form-group');
  const formObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        formGroups.forEach((group, i) => {
          const underline = group.querySelector('.underline');
          if (underline) {
            setTimeout(() => {
              underline.style.width = '100%';
              setTimeout(() => {
                underline.style.width = '0';
              }, 400);
            }, i * 200);
          }
        });
        formObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (contactForm) {
    formObserver.observe(contactForm);
  }
});
