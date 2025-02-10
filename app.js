// Constants
const CONFIG = {
    ANIMATION: {
      THRESHOLD: 0.1,
      PARTICLE_DURATION: 1000,
      PARTICLE_COUNT: 5,
      CODE_RAIN_INTERVAL: 33
    },
    API: {
      URL: 'https://bugtoboss-atharvaawatades-projects.vercel.app/api/submit',
      ALERT_DURATION: 5000
    }
  };
  
  // Utility functions
  const createElement = (className, styles = {}) => {
    const element = document.createElement('div');
    element.className = className;
    Object.assign(element.style, styles);
    return element;
  };
  
  const getRandomPosition = () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight
  });
  
  const getRandomValue = (min, max) => Math.random() * (max - min) + min;
  
  // Animation observer
  const createAnimationObserver = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate__animated', 'animate__fadeInUp');
          }
        });
      },
      { threshold: CONFIG.ANIMATION.THRESHOLD }
    );
  
    document.querySelectorAll('.section, .timeline-item').forEach(element => {
      observer.observe(element);
    });
  
    return observer;
  };
  
  // Bug animation
  const createBugs = () => {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
  
    Array.from({ length: CONFIG.ANIMATION.PARTICLE_COUNT }).forEach(() => {
      const bug = createElement('bug', {
        left: `${getRandomPosition().x}px`,
        top: `${getRandomPosition().y}px`,
        animationDelay: `${-getRandomValue(0, 15)}s`
      });
      heroSection.appendChild(bug);
    });
  };
  
  // Form handling
  const setupForm = () => {
    const form = document.getElementById('submissionForm');
    const elements = {
      submitButton: document.getElementById('submitButton'),
      loading: document.getElementById('loading'),
      successAlert: document.getElementById('successAlert'),
      errorAlert: document.getElementById('errorAlert')
    };
  
    if (!form || !Object.values(elements).every(Boolean)) return;
  
    const showAlert = (element, message) => {
      element.style.display = 'block';
      element.textContent = message;
      setTimeout(() => {
        element.style.display = 'none';
      }, CONFIG.API.ALERT_DURATION);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      elements.successAlert.style.display = 'none';
      elements.errorAlert.style.display = 'none';
      elements.loading.style.display = 'block';
      elements.submitButton.disabled = true;
  
      try {
        const formData = ['name', 'email', 'github_url', 'linkedin_url', 'twitter_url']
          .reduce((acc, field) => ({ ...acc, [field]: form[field].value }), {});
  
        const response = await fetch(CONFIG.API.URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
  
        const data = await response.json();
  
        if (response.ok) {
          showAlert(elements.successAlert, 'Project submitted successfully!');
          form.reset();
        } else {
          showAlert(elements.errorAlert, data.detail || 'Failed to submit project');
        }
      } catch (error) {
        showAlert(elements.errorAlert, 'Network error. Please try again.');
      } finally {
        elements.loading.style.display = 'none';
        elements.submitButton.disabled = false;
      }
    };
  
    form.addEventListener('submit', handleSubmit);
  };
  
  // FAQ handling
  const setupFAQ = () => {
    document.querySelectorAll('.faq-question').forEach(question => {
      question.addEventListener('click', () => {
        question.parentElement?.classList.toggle('active');
      });
    });
  };
  
  // Particle effect
  const setupParticleEffect = () => {
    const handleMouseMove = (e) => {
      const particle = createElement('particle', {
        width: `${getRandomValue(2, 7)}px`,
        height: `${getRandomValue(2, 7)}px`,
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
      });
  
      const destinationX = (Math.random() - 0.5) * 100;
      const destinationY = (Math.random() - 0.5) * 100;
      
      particle.style.setProperty('--x', `${destinationX}px`);
      particle.style.setProperty('--y', `${destinationY}px`);
      particle.style.animation = 'particle-animation 1s forwards';
      
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), CONFIG.ANIMATION.PARTICLE_DURATION);
    };
  
    document.addEventListener('mousemove', handleMouseMove);
  };
  
  // Code rain effect
  const createCodeRain = () => {
    const canvas = createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const drops = Array(Math.floor(canvas.width / 20)).fill(1);
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0F0';
      ctx.font = '15px monospace';
      
      drops.forEach((drop, i) => {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * 20, drop * 20);
        
        if (drop * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    };
    
    setInterval(draw, CONFIG.CODE_RAIN_INTERVAL);
    return canvas;
  };
  
  // Initialize everything
  const init = () => {
    createAnimationObserver();
    createBugs();
    setupForm();
    setupFAQ();
    setupParticleEffect();
    const codeRainCanvas = createCodeRain();
    if (codeRainCanvas) {
      document.body.appendChild(codeRainCanvas);
    }
  };
  
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');

  hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
  });

  // Close mobile menu when a link is clicked
  links.forEach(link => {
      link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          navLinks.classList.remove('active');
      });
  });

  // Run initialization when DOM is ready
  document.addEventListener('DOMContentLoaded', init);
