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
      let btn = document.querySelector('#searchTableBtn');
      console.log(btn)
      let hdlr = new Handler('click', btn, (e) => {
        e.preventDefault();
        this.populateTable();
      });
      this.#handlers.push(hdlr);
      return this.#element;
    }

    async populateTable() {
      let from = document.getElementById('fromDateFilter').value;
      let to = document.getElementById('toDateFilter').value;
      let type = document.getElementById('typeFilter').value;
      console.log(from,to,type)
      let response = await this.#client.get('history', {
        page: 1,
        rowsPerPage: 10,
        filters: this.calcFiltersTable(from,to),
        type: type
      });
      response?.data?.payload.forEach(item => {
        const row = document.createElement('tr');
          row.innerHTML = `
        <td>${item.value}</td>
        <td>${item.created}</td>
      `;
        document.getElementById('dataTable').appendChild(row);
      });
    }

    calcFiltersTable(from,to,type){
      let filterString = '';
      filterString += ('created >= ' + from +'&&');
      filterString += ('created < ' + to );
      return filterString;
    }


  }

  /* Exporting component */
  win.HistoricalDataView ||= HistoricalDataView;

})(window);

