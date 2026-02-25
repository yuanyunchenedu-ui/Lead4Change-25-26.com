// smoooooooooooooooooth scrolling between slides + intersection observer for slide3
(function() {
  const slides = Array.from(document.querySelectorAll('.slides'));
  if (!slides.length) return;

  let isAnimating = false;
  const ANIM_MS = 800;

  function currentIndex() {

    let idx = 0;
    let minDist = Infinity;
    slides.forEach((sl, i) => {
      const rect = sl.getBoundingClientRect();
      const dist = Math.abs(rect.top);
      if (dist < minDist) { minDist = dist; idx = i; }
    });
    return idx;
  }

  let scrollCue = null;
  function updateScrollCue() {
    if (!scrollCue) return;
    const idx = currentIndex();
    const hasNextSlide = idx < slides.length - 1;
    scrollCue.classList.toggle('is-hidden', !hasNextSlide);
  }

  if (slides.length > 1) {
    scrollCue = document.createElement('div');
    scrollCue.className = 'scroll-cue';
    scrollCue.setAttribute('aria-hidden', 'true');
    scrollCue.textContent = '⌄';
    document.body.appendChild(scrollCue);
    updateScrollCue();
    window.addEventListener('scroll', updateScrollCue, { passive: true });
  }

  function scrollTo(idx) {
    if (idx < 0 || idx >= slides.length) return;
    isAnimating = true;
    slides[idx].scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      isAnimating = false;
      updateScrollCue();
    }, ANIM_MS);
  }

  function handleDelta(delta) {
    const idx = currentIndex();
    if (delta > 0) scrollTo(idx + 1); else scrollTo(idx - 1);
  }

  // wheel stuff
  window.addEventListener('wheel', (e) => {
    const bioPanel = e.target.closest('.team-info .bio');
    if (bioPanel && bioPanel.scrollHeight > bioPanel.clientHeight) {
      e.preventDefault();
      bioPanel.scrollTop += e.deltaY;
      return;
    }

    if (isAnimating) return;
    // ignore jittters
    if (Math.abs(e.deltaY) < 30) return;
    e.preventDefault();
    handleDelta(e.deltaY);
  }, { passive: false });

  // uhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
  window.addEventListener('keydown', (e) => {
    if (isAnimating) return;
    if (['ArrowDown','PageDown'].includes(e.key)) { e.preventDefault(); handleDelta(1); }
    if (['ArrowUp','PageUp'].includes(e.key)) { e.preventDefault(); handleDelta(-1); }
    if (e.key === 'Home') { e.preventDefault(); scrollTo(0); }
    if (e.key === 'End') { e.preventDefault(); scrollTo(slides.length - 1); }
  });
  
  // Intersection observer for slide2 mission section
  const slide2 = document.querySelector('.slide2');
  const missionSection = slide2 ? slide2.querySelector('.mission-section') : null;
  if (slide2 && missionSection) {
    let entering = false;
    const observer2 = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target !== slide2) return;
        if (entry.isIntersecting) {
          if (entering) return;
          entering = true;
          missionSection.classList.add('in-view');
        } else {
          entering = false;
          missionSection.classList.remove('in-view');
        }
      });
    }, { threshold: 0.5 });
    observer2.observe(slide2);
  }

  const feedbackContent = document.querySelector('.feedback-content');
  if (feedbackContent) {
    let entering = false;
    const feedbackObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target !== feedbackContent) return;
        if (entry.isIntersecting) {
          if (entering) return;
          entering = true;
          feedbackContent.classList.add('in-view');
        } else {
          entering = false;
          feedbackContent.classList.remove('in-view');
        }
      });
    }, { threshold: 0.25 });
    feedbackObserver.observe(feedbackContent);
  }

  const initiativeSections = Array.from(document.querySelectorAll('.page-chronic-illnesses .initiatives-section, .page-mental-developmental .initiatives-section'));
  if (initiativeSections.length) {
    const initiativesObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
      });
    }, { threshold: 0.4 });

    initiativeSections.forEach(section => initiativesObserver.observe(section));
  }

  const tocBubbles = Array.from(document.querySelectorAll('.page-our-projects .toc-bubble[data-target]'));
  tocBubbles.forEach(bubble => {
    bubble.addEventListener('click', () => {
      const targetId = bubble.getAttribute('data-target');
      const targetSlide = targetId ? document.getElementById(targetId) : null;
      if (targetSlide) {
        targetSlide.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const projectVideos = Array.from(document.querySelectorAll('.page-our-projects .project-images video'));
  projectVideos.forEach(video => {
    video.controls = false;
    video.muted = true;

    const wrapper = document.createElement('div');
    wrapper.className = 'project-video-wrap';
    video.parentNode.insertBefore(wrapper, video);
    wrapper.appendChild(video);

    const muteButton = document.createElement('button');
    muteButton.type = 'button';
    muteButton.className = 'video-mute-btn';
    muteButton.setAttribute('aria-label', 'Toggle mute');

    function renderMuteIcon() {
      muteButton.textContent = video.muted ? '🔇' : '🔊';
    }

    renderMuteIcon();
    muteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      video.muted = !video.muted;
      renderMuteIcon();
    });

    wrapper.appendChild(muteButton);

    wrapper.addEventListener('mouseenter', () => {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    });

    wrapper.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
  
  const slide3 = document.querySelector('.page-homepage .slide3');
  const imgs = slide3 ? Array.from(slide3.querySelectorAll('.image-grid img')) : [];
  const teamHeading = slide3 ? slide3.querySelector('h2') : null;
  if (slide3 && (imgs.length || teamHeading)) {
    let entering = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target !== slide3) return;
        if (entry.isIntersecting) {
          if (entering) return;
          entering = true;
          if (teamHeading) teamHeading.classList.add('in-view');
          const HEAD_START_DELAY = 250; 
          setTimeout(() => {
            imgs.forEach((img, i) => {
              setTimeout(() => img.classList.add('in-view'), i * 80);
            });
          }, HEAD_START_DELAY);
        } else {
          entering = false;
          if (teamHeading) teamHeading.classList.remove('in-view');
          imgs.forEach(img => img.classList.remove('in-view'));
        }
      });
    }, { threshold: 0.5 });
    observer.observe(slide3);
  }
})();

// Review Slider Functionality
(function() {
  const sliderTrack = document.querySelector('.slider-track');
  const reviewCards = document.querySelectorAll('.review-card');
  const dotsContainer = document.querySelector('.slider-dots');
  const leftZone = document.querySelector('.hover-zone.left');
  const rightZone = document.querySelector('.hover-zone.right');
  
  if (!sliderTrack || !reviewCards.length || !dotsContainer) return;
  
  let currentIndex = 0;
  const totalCards = reviewCards.length;
  let hoverInterval = null;
  
  // Create dots
  for (let i = 0; i < totalCards; i++) {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
  
  const dots = document.querySelectorAll('.slider-dot');
  
  function updateSlider() {
    const cardWidth = reviewCards[0].offsetWidth;
    const gap = 32; // 2rem gap
    const offset = -(currentIndex * (cardWidth + gap));
    sliderTrack.style.transform = `translateX(${offset}px)`;
    
    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }
  
  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, totalCards - 1));
    updateSlider();
  }
  
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalCards;
    updateSlider();
  }
  
  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    updateSlider();
  }
  
  // Hover zone functionality
  if (rightZone) {
    rightZone.addEventListener('mouseenter', () => {
      hoverInterval = setInterval(nextSlide, 800);
    });
    
    rightZone.addEventListener('mouseleave', () => {
      clearInterval(hoverInterval);
    });
  }
  
  if (leftZone) {
    leftZone.addEventListener('mouseenter', () => {
      hoverInterval = setInterval(prevSlide, 800);
    });
    
    leftZone.addEventListener('mouseleave', () => {
      clearInterval(hoverInterval);
    });
  }
  
  // Update on window resize
  window.addEventListener('resize', updateSlider);
  
  // Initialize
  updateSlider();
})();

(function() {
  const header = document.querySelector('.header');
  const dropdown = document.querySelector('.dropdown-menu');
  const dropdownContainer = document.querySelector('.dropdown');

  if (header && dropdown && dropdownContainer) {
    function updateDropdownPosition() {
      const headerHeight = header.offsetHeight;
      const viewportWidth = window.innerWidth;
      const containerRect = dropdownContainer.getBoundingClientRect();
      const menuWidth = dropdown.offsetWidth;
      const viewportPadding = 16;

      let left = containerRect.left;

      if (left + menuWidth > viewportWidth - viewportPadding) {
        left = viewportWidth - menuWidth - viewportPadding;
      }

      if (left < viewportPadding) {
        left = viewportPadding;
      }

      dropdown.style.top = `${headerHeight}px`;
      dropdown.style.left = `${left}px`;
    }

    updateDropdownPosition();
    window.addEventListener('resize', updateDropdownPosition);
    dropdownContainer.addEventListener('mouseenter', updateDropdownPosition);
  }

  // Add hover delay to keep dropdown open when moving mouse to it
  if (dropdownContainer && dropdown) {
    let hideTimeout;
    
    dropdownContainer.addEventListener('mouseenter', () => {
      clearTimeout(hideTimeout);
    });
    
    dropdownContainer.addEventListener('mouseleave', () => {
      hideTimeout = setTimeout(() => {
        // Dropdown will hide via CSS when not hovering
      }, 300); // 300ms grace period
    });
    
    dropdown.addEventListener('mouseenter', () => {
      clearTimeout(hideTimeout);
    });
    
    dropdown.addEventListener('mouseleave', () => {
      hideTimeout = setTimeout(() => {
        // Dropdown will hide via CSS
      }, 300);
    });
  }

  const donateButtons = Array.from(document.querySelectorAll('.donate-nav'));
  if (donateButtons.length) {
    const normalizedPath = window.location.pathname.replace(/\\/g, '/').toLowerCase();
    const isSubfolderPage = /\/(find-help|learn-more|get-involved)\//.test(normalizedPath);
    const donatePath = isSubfolderPage ? '../donate.html' : 'donate.html';

    donateButtons.forEach((button) => {
      button.addEventListener('click', () => {
        window.location.href = donatePath;
      });
    });
  }
})();