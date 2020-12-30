class Tooltip {
  constructor() {
    this.onMouseMove = (event) => {
      const tooltipText = event.target.dataset.tooltip;
      if (tooltipText) {
        this.remove();
        this.render(tooltipText);
        this.element.style.top = (event.clientY + 20) + 'px';
        this.element.style.left = (event.clientX + 20) + 'px';
      }
    };
    this.onPointerOut = (event) => {
      this.element.remove();
    }
  }
  initialize() {
    document.body.addEventListener('mousemove', this.onMouseMove);
    document.body.addEventListener('pointerover', this.onMouseMove);
    document.body.addEventListener('pointerout', this.onPointerOut);
  }

  render(tooltipText) {
    const tmpContainer = document.createElement('div');
    tmpContainer.innerHTML = this.getTemplate(tooltipText);
    this.element = tmpContainer.firstChild;
    document.body.append(this.element);
  }

  getTemplate(text) {
    return `<div class="tooltip">${text}</div>`;
  }
  destroy() {
    this.remove();
    document.body.removeEventListener('mousemove', this.onMouseMove);
    document.body.removeEventListener('pointerover', this.onMouseMove);
    document.body.removeEventListener('pointerout', this.onPointerOut);
  }
  remove() {
    if (this.element) {
      this.element.remove();
    }
  }
}

const tooltip = new Tooltip();

export default tooltip;
