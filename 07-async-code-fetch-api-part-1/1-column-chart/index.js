import getChartData from './utils/fetch-json.js';

export default class ColumnChart {
  subElements = {};
  chartHeight = 50;
  baseUrl = 'https://course-js.javascript.ru/';

  constructor({
    url,
    range = { from: "", to: "" },
    label = '',
    link = '',
  } = {}) {
    this.url = url;
    this.label = label;
    this.link = link;
    this.range = range;
    if (!this.range.to || !this.range.from) {
      this.setDefaultRange();
    }
    this.data = [];
    this.render();
    this.update(this.range.from, this.range.to).then(res => {
      console.log('updated');
    });
  }

  setDefaultRange() {
    const now = new Date;
    const fromTs = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 1,
      now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    const toTs = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(),
      now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    this.range.from = new Date(fromTs).toISOString();
    this.range.to = new Date(toTs).toISOString();
  }

  getColumnBody(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data
      .map(item => {
        const percent = (item / maxValue * 100).toFixed(0);

        return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
      })
      .join('');
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
             ${this.value}
           </div>
          <div data-element="body" class="column-chart__chart">
            ${this.getColumnBody(this.data)}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;

    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }

    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  async update(rangeStart, rangeEnd) {
    const responseData = await this.requestData(rangeStart, rangeEnd);
    if (!responseData || responseData.length === 0) {
      return;
    }
    this.data = responseData;
    this.value = this.data.reduce((acc, val) => acc + val, 0);
    this.subElements.header.innerHTML = this.value;
    this.element.classList.remove('column-chart_loading');
    this.subElements.body.innerHTML = this.getColumnBody(this.data);
  }

  updateComponent(data) {
    if (!data) {
      return;
    }

    this.data = data;
    this.subElements.innerHTML = this.getColumnBody(this.data);
  }

  async requestData(from, to) {
    let reqUrl = new URL(this.url, this.baseUrl);
    const fromDt = new Date(from);
    const toDt = new Date(to);

    let params = new URLSearchParams(`${fromDt ? `from=${fromDt.toISOString()}` : ''}${fromDt ? '&' : ''}${toDt ? `to=${toDt.toISOString()}` : ''}`);
    params.forEach((v, k) => reqUrl.searchParams.set(k, v));

    const data = await getChartData(reqUrl.toString(), params);

    let result = []
    for (const key in data) {
      result.push(data[key]);
    }

    return result;
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
