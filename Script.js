if (window.AOS) AOS.init();

function fillContentFromJSON(obj) {
  if (!obj || !obj.content) return;

  const content = obj.content;

  // Title & subtitle
  if (content.title) {
    const titleEl = document.getElementById("title");
    if (titleEl) titleEl.textContent = content.title;
  }
  if (content.subtitle) {
    const subtitleEl = document.getElementById("subtitle");
    if (subtitleEl) subtitleEl.textContent = content.subtitle;
  }

  // Slides (except title slide)
  if (Array.isArray(content.slides)) {
    const slidesContainer = document.getElementById("slides-container");
    if (slidesContainer) {
      slidesContainer.innerHTML = "";
      content.slides.forEach((slide, i) => {
        const section = document.createElement("section");
        section.className = "slide";

        if (slide.title) {
          const h1 = document.createElement("h1");
          h1.className = "slidetitle";
          h1.setAttribute("data-aos", "fade-up");
          h1.textContent = slide.title;
          section.appendChild(h1);
        }

        if (slide.text) {
          const div = document.createElement("div");
          div.textContent = slide.text;
          section.appendChild(div);
        }

        if (Array.isArray(slide.chart)) {
          const chartDiv = document.createElement("div");
          chartDiv.style.float = "right";
          const pieChart = document.createElement("pie-chart");
          slide.chart.forEach(series => {
            const s = document.createElement("series");
            s.setAttribute("value", series.value);
            if (series.color) s.setAttribute("color", series.color);
            s.textContent = series.label || "";
            pieChart.appendChild(s);
          });
          chartDiv.appendChild(pieChart);
          section.appendChild(chartDiv);
        }

        slidesContainer.appendChild(section);
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  document.body.style.fontFamily = "'Nunito', sans-serif";
  var str = window.location.href.split('?')[1];
  if (str && JSON) {
    try {
      var obj = JSON.parse(decodeURIComponent(str));
      fillContentFromJSON(obj);
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
