export default class ColumnChart {
  subElements = {};
  constructor({ data = [], label = '', value = 0, link = '' } = {}) {
    this.data = data;
    this.label = label;
    this.title = `Total ${this.label}`;
    this.value = value;
    this.link = link;
    this.chartHeight = 50;
    this.render();
  }

  render() {
    this.element = document.createElement('div');
    const link = `<a href="${this.link}" class="column-chart__link">View all</a>`;
    const chartContainerClassName = this.data.length ? 'column-chart' : 'column-chart_loading';

    this.element.innerHTML = `<div class="${chartContainerClassName}" style="--chart-height: ${this.chartHeight}">
          <div class="column-chart__title">${this.title}
            ${this.link ? link : ''}
          </div>
          <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">
              ${this.value}
            </div>
            <div data-element="body" class="column-chart__chart">
              ${this.composeBars()}
            </div>
          </div>
        </div>`;

    this.element = this.element.firstChild;

    this.subElements = this.element.querySelector('div[data-element="body"]');
  }

  update(data) {
    if (!data) {
      return;
    }

    this.data = data;
    this.subElements.innerHTML = this.composeBars();
  }

  destroy() {
    this.remove();
  }

  remove() {
    if (this.element.parentNode) {
      this.element.remove();
    }
  }

  composeBars() {
    return this.getColumnProps(this.data)
      .map(cp => `<div style="--value: ${cp.value}" data-tooltip="${cp.percent}"></div>`)
      .join('');
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }
}

