document.addEventListener('DOMContentLoaded', () => {
  // Format: new Date("YYYY-MM-DDTHH:mm:ss").getTime()
  const unlockDate = new Date("2025-12-31T03:15:00").getTime();
  const lock = document.getElementById("lock");
  const content = document.getElementById("content");
  const countdownEl = document.getElementById("countdown");
  const continueBtn = document.getElementById("continueBtn");
  const music = document.getElementById("music");

  if (lock && content && countdownEl && continueBtn) {
    // Timer logic
    const now = Date.now();
    const diff = unlockDate - now;

    if (diff <= 0) {
      // Timer expired - check if user already proceeded
      const userProceeded = localStorage.getItem('birthdayProceeded');
      if (userProceeded === 'true') {
        // User already clicked Continue on a previous visit
        lock.style.display = "none";
        content.classList.remove("hidden");
        if (music) music.play().catch(() => {});
        // Add fade-in to hero for returning users
        const hero = document.querySelector('.hero');
        if (hero) {
          hero.classList.add('fade-in');
        }
      } else {
        // Show Continue button
        countdownEl.style.display = "none";
        continueBtn.style.display = "inline-block";
      }
    } else {
      // Timer still running - show countdown
      const intervalId = setInterval(() => {
        const now = Date.now();
        const diff = unlockDate - now;

        if (diff <= 0) {
          clearInterval(intervalId);
          // Show continue button instead of auto-proceeding
          countdownEl.style.display = "none";
          continueBtn.style.display = "inline-block";
          return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);

        countdownEl.innerText = `${d}d ${h}h ${m}m ${s}s`;
      }, 1000);

      // Display initial countdown immediately
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      countdownEl.innerText = `${d}d ${h}h ${m}m ${s}s`;
    }

    // Continue button click handler
    continueBtn.addEventListener('click', () => {
      // Mark as proceeded in localStorage
      localStorage.setItem('birthdayProceeded', 'true');
      lock.style.display = "none";
      content.classList.remove("hidden");
      // Auto-play music when proceeding
      if (music) music.play().catch(() => {});

      // Add fade-in animation to hero section after content is visible
      setTimeout(() => {
        const hero = document.querySelector('.hero');
        if (hero) {
          hero.classList.add('fade-in');
        }
      }, 10);
    });
  }

  /* MUSIC TOGGLE BUTTON */
  const musicToggle = document.getElementById("musicToggle");
  if (musicToggle && music) {
    let isPlaying = false;
    
    musicToggle.addEventListener('click', () => {
      if (isPlaying) {
        music.pause();
        musicToggle.innerText = '🎵';
        isPlaying = false;
      } else {
        music.play().catch(() => {});
        musicToggle.innerText = '⏸️';
        isPlaying = true;
      }
    });
    
    // Update button state if music is playing
    music.addEventListener('play', () => {
      isPlaying = true;
      musicToggle.innerText = '⏸️';
    });
    
    music.addEventListener('pause', () => {
      isPlaying = false;
      musicToggle.innerText = '🎵';
    });
  }

  /* IMAGE OVERLAY */
  const imgs = document.querySelectorAll('.gallery-section img');
  const overlay = document.getElementById('overlay');
  const overlayImg = document.getElementById('overlayImg');

  if (imgs && overlay && overlayImg) {
    imgs.forEach(img => {
      img.addEventListener('click', () => {
        overlay.style.display = 'flex';
        overlayImg.src = img.src;
      });
    });

    overlay.addEventListener('click', () => { overlay.style.display = 'none'; });
  }

  /* OPEN / CLOSE MESSAGES */
  const openMessages = document.getElementById('openMessages');
  const messagesPage = document.getElementById('messagesPage');
  const closeMessages = document.getElementById('closeMessages');

  function launchConfetti() {
    // Lightweight confetti: optimized elements for continuous performance, CSS-driven transform/opacity animation
    const count = 10;
    const colors = ['#ff69b4','#8a2be2','#1e90ff','#ffd166','#4dd2ff'];
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 6 + Math.random() * 12; // 6 - 18px
      c.style.left = Math.random() * 100 + 'vw';
      c.style.width = `${size}px`;
      c.style.height = `${Math.max(4, size * 0.6)}px`;
      c.style.background = color;
      c.style.borderRadius = Math.random() > 0.6 ? '2px' : '50%';
      c.style.zIndex = 1000;
      c.style.pointerEvents = 'none';
      c.style.willChange = 'transform, opacity';

      // Very slow confetti fall: ~10s - 25s for extremely gentle descent
      const dur = 10000 + Math.random() * 15000; // 10.0s - 25.0s
      const delay = Math.random() * 600;
      c.style.animation = `confettiFall ${dur}ms cubic-bezier(.2,.6,.2,1) ${delay}ms forwards`;

      // Remove after animation ends
      c.addEventListener('animationend', () => c.remove());
      frag.appendChild(c);
    }

    document.body.appendChild(frag);
  }

  if (openMessages && messagesPage) {
    openMessages.addEventListener('click', () => {
      messagesPage.classList.remove('hidden');
      // ensure element is rendered, then add active to trigger transition
      requestAnimationFrame(() => messagesPage.classList.add('active'));
      launchConfetti();
    });
  }

  if (closeMessages && messagesPage) {
    closeMessages.addEventListener('click', () => {
      // remove active to start close transition, then hide after transition
      messagesPage.classList.remove('active');
      const onTransEnd = () => {
        messagesPage.classList.add('hidden');
        messagesPage.removeEventListener('transitionend', onTransEnd);
      };
      messagesPage.addEventListener('transitionend', onTransEnd);
    });
  }

  // Continuous confetti: spawn periodically across the site (skip if user prefers reduced motion)
  try {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      // launch once on load for immediate effect
      launchConfetti();
      // then periodically every ~1.5s for very continuous effect (confetti elements themselves have varied durations of 10-25s)
      const confettiInterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          launchConfetti();
        }
      }, 1500);

      // clear interval on unload to be tidy
      window.addEventListener('beforeunload', () => clearInterval(confettiInterval));
    }
  } catch (err) {
    // fail silently if matchMedia not available
    launchConfetti();
  }

  /* MESSAGE NAVIGATION */
  const messages = [
    "heyy maryam remember the day we first met? I clearly do and i still think about how so unexpectedly i found my TWIN.I still think how we clicked instantly anyways twin its your Birthday!!!you're officially an UNC congrats ig stay lit never sybau❤️‍🩹❤️‍🩹",
    "Very rare to find people like you and i am very lucky and glad to have you,it feels good to wake up to your messages all those texts reels and calls make my day way better and remember i'll always be here listeing to your daily yapping or putting you to sleep",
    "May all your dreams come true this year.This is my gift for you i hope you like it maybe one day i'll be able to gift you something in person and i hope we get to that point  as of now 12-31-2025 6:32 AM i am still on call with you but i am keeping this a secret from you because its your birthday surprise 🎉"
  ];

  let currentMessageIndex = 0;
  const currentMessageEl = document.getElementById('currentMessage');
  const prevButton = document.getElementById('prevMessage');
  const nextButton = document.getElementById('nextMessage');

  function showMessage(index) {
    if (currentMessageEl) {
      currentMessageEl.classList.remove('show');
      setTimeout(() => {
        currentMessageEl.textContent = messages[index];
        currentMessageEl.classList.add('show');
      }, 300); // Wait for fade out
    }
    updateArrows();
  }

  function updateArrows() {
    if (prevButton) {
      prevButton.style.display = currentMessageIndex === 0 ? 'none' : 'block';
    }
    if (nextButton) {
      nextButton.style.display = currentMessageIndex === messages.length - 1 ? 'none' : 'block';
    }
  }

  if (prevButton && nextButton && currentMessageEl) {
    prevButton.addEventListener('click', () => {
      if (currentMessageIndex > 0) {
        currentMessageIndex--;
        showMessage(currentMessageIndex);
      }
    });

    nextButton.addEventListener('click', () => {
      if (currentMessageIndex < messages.length - 1) {
        currentMessageIndex++;
        showMessage(currentMessageIndex);
      }
    });

    // Initialize first message
    showMessage(0);
  }

  /* MOUSE HEART (throttled + capped) */
  (function() {
    let lastHeart = 0;
    const minInterval = 120; // ms between hearts
    const maxHearts = 20; // max hearts on screen
    let activeHearts = 0;

    document.addEventListener('mousemove', e => {
      const now = Date.now();
      if (now - lastHeart < minInterval) return;
      if (activeHearts >= maxHearts) return;
      lastHeart = now;
      activeHearts++;

      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.innerText = '💙';
      heart.style.position = 'fixed';
      const offsetX = (Math.random() - 0.5) * 14;
      const offsetY = (Math.random() - 0.5) * 14;
      heart.style.left = (e.clientX + offsetX) + 'px';
      heart.style.top = (e.clientY + offsetY) + 'px';
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = 10000;
      document.body.appendChild(heart);

      const life = 1700; // ms
      setTimeout(() => {
        heart.remove();
        activeHearts = Math.max(0, activeHearts - 1);
      }, life);
    });
  })();
  /* SCROLL REVEAL FOR SECTIONS */
  const sectionsToReveal = document.querySelectorAll('.gallery-section, .closing-card');
  if (sectionsToReveal.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    sectionsToReveal.forEach(section => {
      sectionObserver.observe(section);
    });
  }



  /* PHOTO PARALLAX + TILT + HOVER/TOUCH POP */
  const galleryPhotos = document.querySelectorAll('.photo-layout img');
  const isTouchDevice = () => (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
  const touchActive = new Set();

  galleryPhotos.forEach(photo => {
    // Hover tilt effect for main photo (desktop)
    if (photo.classList.contains('main-photo') && !isTouchDevice()) {
      photo.addEventListener('mousemove', (e) => {
        const rect = photo.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateY = (x / rect.width - 0.5) * 8;
        const rotateX = (0.5 - y / rect.height) * 8;
        photo.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      photo.addEventListener('mouseleave', () => {
        photo.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    }

     // Simple click to open on all devices
     photo.addEventListener('click', () => {
       const overlay = document.getElementById('overlay');
       const overlayImg = document.getElementById('overlayImg');
       if (overlay && overlayImg) {
         overlay.style.display = 'flex';
         overlayImg.src = photo.src;
       }
     });
  });

});


