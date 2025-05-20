if (window.AOS) AOS.init();

document.addEventListener("DOMContentLoaded", function() {
  document.body.style.fontFamily = "'Nunito', sans-serif";
  var str = window.location.href.split('?')[1];
  if (str && JSON) {
    try {
      var obj = JSON.parse(str);
      var titleEl = document.getElementById("title");
      var subtitleEl = document.getElementById("subtitle");
      if (titleEl && subtitleEl && obj.content) {
        titleEl.textContent = obj.content.title;
        subtitleEl.textContent = obj.content.subtitle;
      }
    } catch (e) {}
  }
});

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
    if ('scrollIntoView' in mostVisibleSection) {
      try {
        mostVisibleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (e) {
        mostVisibleSection.scrollIntoView(true);
      }
    }
  }, 150);
});
