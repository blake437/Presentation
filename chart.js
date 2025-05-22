class PieChart extends HTMLElement {
  constructor() {
    super();
    const container = document.createElement('div');
    container.className = 'pie-container';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('pie-svg');
    svg.setAttribute('viewBox', '0 0 250 250');
    container.appendChild(svg);
    const legend = document.createElement('div');
    legend.className = 'pie-legend';
    container.appendChild(legend);
    this.appendChild(container);
    this.svg = svg;
    this.legend = legend;
    this.defaultColors = [
      '#e74c3c', '#3498db', '#f1c40f', '#27ae60', '#9b59b6', '#1abc9c',
      '#e67e22', '#34495e', '#7f8c8d', '#ff6f61', '#6b5b95', '#88b04b'
    ];
    this._animationFrame = null;
    this._interval = null;
    this._observer = null;
    this._inView = false;
  }
  connectedCallback() {
    this.style.display = 'block';
    this.style.width = '350px';
    this.style.height = '350px';
    this.querySelector('.pie-container').style.width = '100%';
    this.querySelector('.pie-container').style.height = '100%';
    this.drawChart();
    this.setupAnimationObserver();
    if (this.hasAttribute('repeat-interval')) {
      this.startRepeatAnimation();
    }
  }
  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
      this._animationFrame = null;
    }
  }
  drawChart() {
    this.svg.innerHTML = '';
    this.legend.innerHTML = '';
    const seriesEls = Array.from(this.querySelectorAll('series'));
    const usedColors = [];
    const data = [];
    seriesEls.forEach((el) => {
      let value = el.getAttribute('value');
      if (value === null || value === undefined || isNaN(Number(value))) return;
      value = Number(value);
      if (value <= 0) return;
      let color = el.getAttribute('color');
      if (!color) {
        color = this.defaultColors.find(c => !usedColors.includes(c));
        if (!color) color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      }
      usedColors.push(color);
      let label = (el.textContent || '').trim();
      data.push({ value, color, label });
    });
    if (!data.length) {
      this.legend.style.display = 'none';
      return;
    }
    const cx = 125, cy = 125, r = 100;
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = -90;
    this.sliceData = [];
    data.forEach((d) => {
      const angleSpan = (d.value / total) * 360;
      const start = currentAngle;
      const end = start;
      const finalEnd = start + angleSpan;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', this.describeArc(cx, cy, r, start, end));
      path.setAttribute('fill', d.color);
      this.svg.appendChild(path);
      this.sliceData.push({
        path,
        cx, cy, r,
        start,
        end,
        finalEnd
      });
      currentAngle += angleSpan;
    });
    const hasLabels = data.some(d => d.label);
    if (hasLabels) {
      this.legend.style.display = '';
      data.forEach(d => {
        if (!d.label) return;
        const entry = document.createElement('div');
        entry.className = 'pie-legend-entry';
        const swatch = document.createElement('span');
        swatch.className = 'pie-legend-swatch';
        swatch.style.background = d.color;
        entry.appendChild(swatch);
        const text = document.createElement('span');
        text.className = 'pie-legend-label';
        text.textContent = d.label;
        entry.appendChild(text);
        this.legend.appendChild(entry);
      });
    } else {
      this.legend.style.display = 'none';
    }
  }
  describeArc(cx, cy, r, startAngle, endAngle) {
    const rad = Math.PI / 180;
    const x1 = cx + r * Math.cos(rad * startAngle);
    const y1 = cy + r * Math.sin(rad * startAngle);
    const x2 = cx + r * Math.cos(rad * endAngle);
    const y2 = cy + r * Math.sin(rad * endAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return [
      `M ${cx} ${cy}`,
      `L ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
  }
  setupAnimationObserver() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    this._observer = new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this._inView = true;
          this.restartAnimation();
        } else {
          this._inView = false;
        }
      });
    }, { threshold: 0.4 });
    this._observer.observe(this);
  }
  animateSlices() {
    if (!this.sliceData || !this.sliceData.length) return;
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
      this._animationFrame = null;
    }
    const duration = Number(this.getAttribute('animation-length')) || 1200;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      let prevEnd = -90;
      this.sliceData.forEach(slice => {
        const sweep = slice.finalEnd - slice.start;
        const currentEnd = prevEnd + sweep * t;
        slice.path.setAttribute('d', this.describeArc(
          slice.cx, slice.cy, slice.r, prevEnd, currentEnd
        ));
        prevEnd += sweep;
      });
      if (t < 1) {
        this._animationFrame = requestAnimationFrame(animate);
      } else {
        this._animationFrame = null;
      }
    };
    this._animationFrame = requestAnimationFrame(animate);
  }
  restartAnimation() {
    this.animateSlices();
  }
  startRepeatAnimation() {
    const interval = Number(this.getAttribute('repeat-interval')) || 2000;
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
    this._interval = setInterval(() => {
      if (this._inView) {
        this.restartAnimation();
      }
    }, interval);
    this.restartAnimation();
  }
}
customElements.define('pie-chart', PieChart);
