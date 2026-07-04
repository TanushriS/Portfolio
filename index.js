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

  // ── PROJECT OUTCOME BOXES: DEALT CARDS EFFECT ──
  const projCards = document.querySelectorAll('.project-card');
  const projObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const outcomes = entry.target.querySelectorAll('.outcome-box');
        outcomes.forEach((box, i) => {
          box.style.opacity = '0';
          box.style.transform = 'scale(0.8) translateY(15px)';
          box.style.transition = `opacity 0.4s ease ${i * 0.12}s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.12}s`;
          setTimeout(() => {
            box.style.opacity = '1';
            box.style.transform = 'scale(1) translateY(0)';
          }, 100);
        });

        // Tech tags rubber band
        const tags = entry.target.querySelectorAll('.tech-tag');
        tags.forEach((tag, i) => {
          tag.style.opacity = '0';
          tag.style.transform = 'scale(0.3)';
          tag.style.transition = `opacity 0.3s ease ${0.5 + i * 0.1}s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${0.5 + i * 0.1}s`;
          setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'scale(1)';
          }, 100);
        });

        projObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  projCards.forEach(card => projObserver.observe(card));

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
