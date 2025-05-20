var str = window.location.href.split('?')[1]
if (JSON != null){
  var obj = JSON.parse(str)
  document.getElementById("title").text = obj.content.title
  document.getElementById("subtitle").text = obj.content.subtitle
}

// --- Smooth scroll to section with largest visible area on scroll stop ---
let scrollTimeout;
window.addEventListener('scroll', function () {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const sections = document.querySelectorAll('section');
    if (sections.length === 0) return;

    let maxVisible = 0;
    let mostVisibleSection = sections[0];

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, window.innerHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      if (visibleHeight > maxVisible) {
        maxVisible = visibleHeight;
        mostVisibleSection = section;
      }
    });

    mostVisibleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 150);
});
