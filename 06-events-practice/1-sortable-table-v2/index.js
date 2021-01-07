export default class SortableTable {
  subElements = {};
  constructor(header, data) {
    this.data = [...data.data];
    this.header = header;
    this.render();
  }

  onColumnHeaderClick = event => {
    const sortableCol = event.target.closest('[data-sortable="true"]');
    if (!sortableCol) {
      return;
    }

    sortableCol.dataset.order = this.toggleOrder(sortableCol.dataset.order);
    this.sort(sortableCol.dataset.id, sortableCol.dataset.order);
  }

  toggleOrder(order = "asc") {
    const ordDict = {
      asc: 'desc',
      desc: 'asc',
    };

    return ordDict[order];
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.composeElement();
    this.element = wrapper.firstChild;

    this.tableBody = this.element.querySelector("[ data-element=body]");
    this.tableHeader = this.element.querySelector("[data-element=header]");
    this.subElements = this.getSubElements(this.element);

    this.initListeners();
  }

  initListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onColumnHeaderClick);
  }

  sort(fieldValue, orderValue) {
    const sortedData = this.sortData(fieldValue, orderValue);
    this.subElements.body.innerHTML = this.composeTableBody(sortedData);
    this.subElements.header.innerHTML = this.composeHeader(fieldValue, orderValue);
  }

  sortData(fieldValue, order) {
    const contents = [...this.data];
    const columnMeta = this.header.find(i => i.id === fieldValue);
    const sortType = columnMeta.sortType;
    const direction = order === 'asc' ? 1 : -1;

    return contents.sort((a, b) => {
      switch (sortType) {
        case 'string': return direction * a[fieldValue].localeCompare(b[fieldValue], 'ru');
        case 'number': return (a[fieldValue] - b[fieldValue]) * direction;
        default: return (a[fieldValue] - b[fieldValue]) * direction;
      }
    });
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }

  remove() {
    this.element.remove();
  }

  composeElement() {
    const template =
      `<div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.composeHeader()}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.composeTableBody(this.data)}
        </div>
      </div>
    </div>`;

    return template;
  }

  composeHeader(sortBy, order) {
    if (!sortBy) {
      sortBy = 'title';
      order = 'asc';
    }
    const orderAttr = !order ? '' : `data-order="${order}"`;
    const headerHtml = this.header
      .map(cell =>
        `<div class="sortable-table__cell" data-id="${cell.id}" data-sortable="${cell.sortable}" ${orderAttr}>
          <span>${cell.title}</span>
          ${cell.sortable && cell.id === sortBy ? this.composeSortingArrow(order) : ''}
         </div>`)
      .join('');

    return headerHtml;
  }

  composeSortingArrow(order) {
    return order
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
         </span>`
      : '';
  }

  composeTableBody(tableData) {
    const bodyHtml = tableData
      .map(dataElement => {
        const row = `<a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
                      ${this.composeRowCells(dataElement)}
                    </a>`;
        return row;
      })
      .join('');

    return bodyHtml;
  }

  composeRowCells(dataEl) {
    return this.header
      .map(he => {
        if (he.template) {
          return he.template().trim();
        }
        else {
          return `<div class="sortable-table__cell">${dataEl[he.id]}</div>`;
        }
      })
      .join('');
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }
}

