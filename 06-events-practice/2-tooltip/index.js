class Tooltip {
  static instance;

  onPointerOver = (event) => {
    const element = event.target.closest('[data-tooltip]');
    if (!element) {
      return;
    }

    this.render(element.dataset.tooltip);
    this.moveElement(event);
    document.addEventListener('pointermove', this.onPointerMove);
  }

  onPointerOut = (event) => {
    this.remove();
  }

  onPointerMove = (event) => {
    this.moveElement(event);
  }

  moveElement(event) {
    const offset = 20;

    if (!this.element) {
      return;
    }

    const tooltipRect = this.element.getBoundingClientRect();
    const pointerX = event.pageX;
    const pointerY = event.pageY;
    const tooltipRightX = pointerX + offset + (tooltipRect ?  tooltipRect.width : 0);
    const tooltipBottomY = pointerY + offset + (tooltipRect ? tooltipRect.height : 0);

    if (tooltipRightX > window.outerWidth && tooltipBottomY > window.outerHeight) {
      this.element.style.left = `${event.clientX - tooltipRect.width}px`;
      this.element.style.top = `${event.clientX - tooltipRect.height}px`;
    } else if (tooltipRightX > window.outerWidth) {
      this.element.style.left = `${event.clientX - tooltipRect.width}px`;
      this.element.style.top = `${event.clientY + offset}px`;
    } else if (tooltipBottomY > window.outerHeight) {
      this.element.style.left = `${event.clientX + offset}px`;
      this.element.style.top = 'auto';
      this.element.style.bottom = '100%';
    } else {
      this.element.style.top = `${event.clientY + offset}px`;
      this.element.style.left = `${event.clientX + offset}px`;
    }
  }

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
  }

  initialize() {
    document.body.addEventListener('pointerover', this.onPointerOver);
    document.body.addEventListener('pointerout', this.onPointerOut);
  }

  render(tooltipText) {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.innerHTML = tooltipText;

    document.body.append(this.element);
  }
  S
  destroy() {
    document.removeEventListener('pointerover', this.onMouseMove);
    document.removeEventListener('pointerout', this.onPointerOut);
    this.remove();
  }

  remove() {
    if (this.element) {
      this.element.remove();
      this.element = null;
      document.removeEventListener('pointermove', this.onMouseMove);
    }
  }
}

const tooltip = new Tooltip();

export default tooltip;
