// Sweet Spot Augustów — Scroll Reveal Animations
// Lightweight IntersectionObserver-based reveal system

document.addEventListener('DOMContentLoaded', () => {
  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  function observeElements() {
    document.querySelectorAll('.reveal-on-scroll:not(.revealed)').forEach(el => {
      observer.observe(el);
    });
  }

  // Observe all static elements
  observeElements();

  // Re-observe when dynamic content loads (product cards injected by products.js)
  const grid = document.getElementById('productsGrid');
  if (grid) {
    const mutationObs = new MutationObserver(() => {
      observeElements();
    });
    mutationObs.observe(grid, { childList: true });
  }
});
