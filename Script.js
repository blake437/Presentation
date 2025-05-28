if (window.AOS) AOS.init();

function fillContentFromJSON(obj) {
  if (!obj || !obj.content) return;

  const content = obj.content;

  if (content.title) {
    const titleEl = document.getElementById("title");
    if (titleEl) titleEl.textContent = content.title;
  }
  if (content.subtitle) {
    const subtitleEl = document.getElementById("subtitle");
    if (subtitleEl) subtitleEl.textContent = content.subtitle;
  }

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

function setDefaultContent() {
  const titleEl = document.getElementById("title");
  if (titleEl) titleEl.textContent = "Food waste";
  const subtitleEl = document.getElementById("subtitle");
  if (subtitleEl) subtitleEl.textContent = "And the subtitle goes here";
  const slidesContainer = document.getElementById("slides-container");
  if (slidesContainer) {
    slidesContainer.innerHTML = "";
    const section = document.createElement("section");
    section.className = "slide";
    const h1 = document.createElement("h1");
    h1.className = "slidetitle";
    h1.setAttribute("data-aos", "fade-up");
    h1.textContent = "About 1/3 of all food produced is wasted";
    section.appendChild(h1);
    const div = document.createElement("div");
    section.appendChild(div);
    const chartDiv = document.createElement("div");
    chartDiv.style.float = "right";
    const pieChart = document.createElement("pie-chart");
    const s1 = document.createElement("series");
    s1.setAttribute("value", 1);
    s1.setAttribute("color", "red");
    s1.textContent = "wasted";
    pieChart.appendChild(s1);
    const s2 = document.createElement("series");
    s2.setAttribute("value", 2);
    s2.setAttribute("color", "blue");
    s2.textContent = "not wasted";
    pieChart.appendChild(s2);
    chartDiv.appendChild(pieChart);
    section.appendChild(chartDiv);
    slidesContainer.appendChild(section);
  }
}

function getQueryParam(name) {
  const query = window.location.search.substring(1);
  const params = new URLSearchParams(query);
  return params.get(name);
}

document.addEventListener("DOMContentLoaded", function() {
  document.body.style.fontFamily = "'Nunito', sans-serif";
  const jsonStr = getQueryParam("json");
  if (jsonStr && JSON) {
    try {
      const obj = JSON.parse(decodeURIComponent(jsonStr));
      fillContentFromJSON(obj);
      return;
    } catch (e) {}
  }
  setDefaultContent();
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
