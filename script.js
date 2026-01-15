document.addEventListener('DOMContentLoaded', () => {
  // Format: new Date("YYYY-MM-DDTHH:mm:ss").getTime()
  const unlockDate = new Date("2026-01-18T00:00:00").getTime();
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
      // Timer expired - show continue button but keep scrolling disabled
      continueBtn.style.display = "block";
      continueBtn.classList.remove("hidden");
      document.body.style.overflow = 'hidden'; // Keep scrolling disabled
    } else {
      // Timer still running - show countdown and disable scrolling
      document.body.style.overflow = 'hidden'; // Prevent scrolling
      const intervalId = setInterval(() => {
        const now = Date.now();
        const diff = unlockDate - now;

        if (diff <= 0) {
          clearInterval(intervalId);
          // Show continue button but keep scrolling disabled
          continueBtn.style.display = "block";
          continueBtn.classList.remove("hidden");
          document.body.style.overflow = 'hidden'; // Keep scrolling disabled
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
      document.body.style.overflow = 'auto'; // Enable scrolling after unlocking
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

  if (openMessages && messagesPage) {
    openMessages.addEventListener('click', () => {
      messagesPage.classList.remove('hidden');
      // ensure element is rendered, then add active to trigger transition
      requestAnimationFrame(() => messagesPage.classList.add('active'));
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

  /* MESSAGE NAVIGATION */
  const messages = [
    "Happy Birthday, Maryam. Here my gift to you on your special day. not much but i hope this makes you smile. I am very garetful to have someone like you, A wonderful personality and a kind heart rare to find these days. And now you're officially an UNC never sybau twin ❤️‍🩹",
    "Life is soo surprising and unexpected there are so many things you wish for, people you wish you could meet things you could do but life has its own rhythm and timing you migh not always get what you want but i hope you get everything that's best for you and that makes you happy.",
    "I wish this new year brings you endless joy, success and all the things you wish to achieve. You deserve all the love and happiness. Keep laughing and shining like you always have. Happy Birthday!-Hamza 12-31-2025 9:04 PM",
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
      }, 250); // Faster transition timing
    }
    updateArrows();
    updateDots(index);
  }

  function updateArrows() {
    if (prevButton) {
      prevButton.style.display = currentMessageIndex === 0 ? 'none' : 'block';
    }
    if (nextButton) {
      nextButton.style.display = currentMessageIndex === messages.length - 1 ? 'none' : 'block';
    }
  }

  function updateDots(index) {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Create progress dots
  const progressDotsEl = document.getElementById('progressDots');
  if (progressDotsEl) {
    for (let i = 0; i < messages.length; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.addEventListener('click', () => {
        currentMessageIndex = i;
        showMessage(currentMessageIndex);
      });
      progressDotsEl.appendChild(dot);
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
    const isMobile = window.innerWidth <= 768;
    const minInterval = isMobile ? 300 : 120; // slower on mobile
    const maxHearts = isMobile ? 10 : 20; // fewer on mobile
    let activeHearts = 0;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isMobile) return; // Skip hearts entirely on mobile or reduced motion

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



