`use strict`;
(function (win) {
  class HistoricalDataView extends EventEmitter {
    /** @type {HTMLElement} */
    #element;
    /** @type {RestClient} */
    #client;
    /** @type {Handler[]} */
    #handlers = [];
    #components = new Map();
    #currentPage = 1;

    /**
     * Instances a new `LoginComponent`.
     * @param client {RestClient} The REST client
     */
    constructor(client) {
      super();
      this.#client = client;
    }

    /**
     * Destroys this component, removing it from it's parent node.
     */
    destroy() {
      this.#handlers.forEach(h => h.unregister());
      this.#element.remove();
    }

    /**
     * Initializes the component.
     * @return {Promise<HTMLElement>} The root element for this component.
     */
    async init() {
      this.#element = document.createElement('div');
      this.#element.innerHTML = document.querySelector('script#historical-data-template').textContent;
      let searchBtn = this.#element.querySelector('#searchTableBtn');
      let prevBtn = this.#element.querySelector('#prevBtn');
      let nextBtn = this.#element.querySelector('#nextBtn');
      let selectRowsPerPage = this.#element.querySelector('#perPageSelect');
      let hdlr = new Handler('click', searchBtn, (e) => {
        this.populateTable();
      });
      let hdlr2 = new Handler('click', nextBtn, (e) => {
        this.#currentPage++;
        this.populateTable();
      });
      let hdlr3 = new Handler('click', prevBtn, (e) => {
        this.#currentPage--;
        if(this.#currentPage < 1)
          this.#currentPage = 1;
        this.populateTable();
      });
      let hdlr4 = new Handler('change', selectRowsPerPage, (e) => {
        this.#currentPage = 1;
        this.populateTable();
      });
      this.#handlers.push(hdlr);
      this.#handlers.push(hdlr2);
      this.#handlers.push(hdlr3);
      this.#handlers.push(hdlr4);
      return this.#element;
    }

    async populateTable() {
      try {
        let from = document.getElementById('fromDateFilter').value;
        let to = document.getElementById('toDateFilter').value;
        let type = document.getElementById('typeFilter').value;
        if(!from || !to || !type)
          return;
        let response = await this.#client.get('history', {
          page: this.#currentPage,
          rowsPerPage: document.getElementById('perPageSelect').value,
          filters: this.calcFiltersTable(from, to),
          type: type
        });
        if(!!document.querySelector('#dataTableBody tr')) {
          document.getElementById('dataTableBody').innerHTML = '';
        }
        response?.payload?.items.forEach(item => {
          const row = document.createElement('tr');
          row.innerHTML = `
          <td>${item.value}</td>
          <td>${item.created}</td>`;
          document.getElementById('dataTableBody').appendChild(row);
        });
        document.getElementById('pageAndTotalItems').innerHTML =
          "Page " + response.payload.page + ' of ' + response.payload.totalPages
      } catch (e) {
        console.log(e.message)
      }
    }

    calcFiltersTable(from, to) {
      return 'created >= "' + from + '" ' + '&&' + ' ' + 'created < "' + to + ' 23:59:59"';
    }


  }

  /* Exporting component */
  win.HistoricalDataView ||= HistoricalDataView;

})(window);

