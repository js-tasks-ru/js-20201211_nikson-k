import fetchJson from './utils/fetch-json.js';

const backendUrl = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  subElements = {};
  loading = false;

  onSortClick = async event => {
    const column = event.target.closest('[data-sortable="true"]');

    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc'
      };

      return orders[order];
    };

    if (column) {
      const { id, order } = column.dataset;
      const nextOrder = toggleOrder(order);
      const arrow = column.querySelector('.sortable-table__sort-arrow');

      column.dataset.order = toggleOrder(order);

      if (!arrow) {
        column.append(this.subElements.arrow);
      }
      if (this.isServersideSorting) {
        this.sortOnServer(id, nextOrder, 1, 1 + this.step)
      }
      else {
        this.updateRows(this.sortData(id, nextOrder));
      }
    }
  };

  onScroll = async event => {
    const { bottom } = this.element.getBoundingClientRect();
    const { id, order } = this.sorted;

    if (bottom < document.documentElement.clientHeight && !this.loading && !this.isSortLocally) {
      this.start = this.end;
      this.end = this.start + this.step;

      this.loading = true;

      const data = await this.loadData(id, order, this.start, this.end);

      this.appendRows(data);

      this.loading = false;
    }
  }

  constructor(headersConfig = [], {
    data = [],
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'asc'
    },
    isServersideSorting = true,
    step = 20,
    start = 1,
    end = step + start,
    url = '',
  } = {}) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.isServersideSorting = isServersideSorting;
    this.url = new URL(url, backendUrl);
    this.step = step;
    this.start = start;
    this.end = end;

    this.render();
  }

  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headersConfig.map(item => this.getHeaderRow(item)).join('')}
    </div>`;
  }

  getHeaderRow({ id, title, sortable }) {
    const order = this.sorted.id === id ? this.sorted.order : 'asc';

    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
        <span>${title}</span>
        ${this.getHeaderSortingArrow(id)}
      </div>
    `;
  }

  getHeaderSortingArrow(id) {
    const isOrderExist = this.sorted.id === id ? this.sorted.order : '';

    return isOrderExist
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
      : '';
  }

  getTableBody(data) {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getTableRows(data)}
      </div>`;
  }

  getTableRows(data) {
    return data.map(item => `
      <div class="sortable-table__row">
        ${this.getTableRow(item, data)}
      </div>`
    ).join('');
  }

  getTableRow(item) {
    const cells = this.headersConfig.map(({ id, template }) => {
      return {
        id,
        template
      };
    });

    return cells.map(({ id, template }) => {
      return template
        ? template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getTable() {
    return `
      <div class="sortable-table">
        ${this.getTableHeader()}
        ${this.getTableBody(this.data)}
      </div>`;
  }

  async render() {
    const { id, order } = this.sorted;
    const wrapper = document.createElement('div');
    //const sortedData = this.sortData(id, order);

    wrapper.innerHTML = this.getTable();

    const element = wrapper.firstElementChild;

    this.element = element;
    this.subElements = this.getSubElements(element);

    const data = await this.loadData(id, order);

    this.updateRows(data);

    this.initEventListeners();
  }

  async loadData(id, order, start = this.start, end = this.end) {
    this.url.searchParams.set('_sort', id);
    this.url.searchParams.set('_order', order);
    this.url.searchParams.set('_start', start);
    this.url.searchParams.set('_end', end);

    this.element.classList.add('sortable-table_loading');
    // try {
    const data = await fetchJson(this.url);
    this.element.classList.remove('sortable-table_loading');
    return data;
    //}
    // catch (error) {
    //   console.error(error);
    // }
    //finally {
    //
    //}
  }

  updateRows(data) {
    if (!data || data.length === 0) {
      return;
    }

    this.data = data;
    this.subElements.body.innerHTML = this.getTableRows(this.data);
  }

  appendRows(data) {
    const rows = document.createElement('div');

    this.data = [...this.data, ...data];
    rows.innerHTML = this.getTableRows(data);

    this.subElements.body.append(...rows.childNodes);
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);
    document.addEventListener('scroll', this.onScroll);
  }

  sortData(id, order) {
    const arr = [...this.data];
    const column = this.headersConfig.find(item => item.id === id);
    const { sortType, customSorting } = column;
    const direction = order === 'asc' ? 1 : -1;

    return arr.sort((a, b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[id] - b[id]);
        case 'string':
          return direction * a[id].localeCompare(b[id], 'ru');
        case 'custom':
          return direction * customSorting(a, b);
        default:
          return direction * (a[id] - b[id]);
      }
    });
  }

  async sortOnServer(id, order, start, end) {
    const data = await this.loadData(id, order, start, end);

    this.updateRows(data);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
