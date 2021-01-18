import fetchJson from './utils/fetch-json.js';

const backendUrl = 'https://course-js.javascript.ru/';

export default class ColumnChart {
  subElements = {};
  chartHeight = 50;

  constructor({
    url = '',
    range = {
      from: new Date(),
      to: new Date(),
    },
    label = '',
    link = '',
    formatHeading = data => data,
  } = {}) {
    this.url = new URL(url, backendUrl);
    this.label = label;
    this.link = link;
    this.range = range;
    this.formatHeading = formatHeading;
    // if (!this.range.to || !this.range.from) {
    //   this.setDefaultRange();
    // }

    this.data = [];
    this.render();

    this.loadData(this.range.from, this.range.to);
  }

  setDefaultRange() {
    const now = new Date;
    //day before today
    const fromTs = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 1, now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    //today
    const toTs = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    this.range.from = new Date(fromTs).toISOString();
    this.range.to = new Date(toTs).toISOString();
  }

  getColumnBody(data) {
    const maxValue = Math.max(...Object.values(data));
    const scale = this.chartHeight / maxValue;

    return Object.entries(data).map(([key, value]) => {
      const percent = (value / maxValue * 100).toFixed(0);
      const tooltip = `<span>
        <small>${key.toLocaleString('default', { dateStyle: 'medium' })}</small>
        <br>
        <strong>${percent}%</strong>
      </span>`;
      return `<div style="--value: ${Math.floor(value * scale)}" data-tooltip="${tooltip}%"></div>`;
    }).join('');
  }

  getLink() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  get template() {
    return `<div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
           <div data-element="header" class="column-chart__header">
           </div>
          <div data-element="body" class="column-chart__chart">
          </div>
        </div>
      </div>
    `;
  }

  getHeaderValue(data) {
    return this.formatHeading(Object.values(data).reduce((accum, item) => (accum + item), 0));
  }
  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  async loadData(from, to) {
    this.element.classList.add('column-chart_loading');
    this.subElements.header.textContent = '';
    this.subElements.body.innerHTML = '';

    this.url.searchParams.set('from', from.toISOString());
    this.url.searchParams.set('to', to.toISOString());

    const data = await fetchJson(this.url);

    this.range.from = from;
    this.range.to = to;

    if (!data || data.length === 0) {
      return;
    }

    this.subElements.header.textContent = this.getHeaderValue(data);
    this.subElements.body.innerHTML = this.getColumnBody(data);

    this.element.classList.remove('column-chart_loading');
  }

  updateComponent(data) {
    if (!data) {
      return;
    }

    this.data = data;
    this.subElements.innerHTML = this.getColumnBody(data);
    debugger;
  }

  async update(from, to) {
    return await this.loadData(from, to);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
