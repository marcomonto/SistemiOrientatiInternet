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
      return this.#element;
    }

    async renderDynamicComponent(componentType, params) {
      switch (componentType) {
        case 'WindowCard':
          const windowId = params.id
          if(!this.#components.get('windowCard_' + windowId)){
            const windowCard = new WindowCard(this.#client, params);
            let element = await windowCard.init();
            element.className = 'col-6';
            element.style.height = '150px';
            this.#element.querySelector('#sensorCards').appendChild(element);
            windowCard.registerRenderComponents(); // init reactivity
            this.#components.set('windowCard_' + windowId,windowCard);
          }
          else{
            let component = this.#components.get('windowCard_' + windowId);
            let divUpdated = component.update(params);
            divUpdated.style.height = '150px';
          }
          break;
        case 'DoorCard':
          if(!this.#components.get('doorCard')){
            const doorCard = new DoorCard(this.#client, params);
            let element = await doorCard.init();
            element.className = 'col-6';
            element.style.height = '150px';
            this.#element.querySelector('#sensorCards').appendChild(element);
            doorCard.registerRenderComponents(); // init reactivity
            this.#components.set('doorCard',doorCard);
          }
          else{
            let component = this.#components.get('doorCard');
            let divUpdated = component.update(params);
            divUpdated.style.height = '150px';
          }
          break;
        case 'HeatPumpCard':
          if(!this.#components.get('heatPumpCard')){
            const heatPumpCard = new HeatPumpCard(this.#client, params);
            let element = await heatPumpCard.init()
            element.className = 'col-6';
            element.style.height = '150px';
            this.#element.querySelector('#sensorCards').appendChild(element);
            heatPumpCard.registerRenderComponents(); // init reactivity
            this.#components.set('heatPumpCard',heatPumpCard);
          }
          else{
            let component = this.#components.get('heatPumpCard');
            let divUpdated = component.update(params);
            divUpdated.style.height = '150px';
          }
          break;
        default:
          console.error('Unknown component type:', componentType);
      }
    }
  }

  /* Exporting component */
  win.HistoricalDataView ||= HistoricalDataView;

})(window);


/*
$(document).ready(function() {
  const dataTable = $('#dataTable');
  const pagination = $('#pagination');
  const dateForm = $('#dateForm');

  dateForm.submit(function(event) {
    event.preventDefault();
    const fromDate = $('#fromDate').val();
    const toDate = $('#toDate').val();

    // Make an AJAX request to your server API endpoint with fromDate and toDate
    // Example using Axios
    axios.get(`/your-api-endpoint?from=${fromDate}&to=${toDate}`)
      .then(function(response) {
        // Assuming the response is an array of objects with 'id' and 'date' fields
        displayData(response.data);
      })
      .catch(function(error) {
        console.error('Error fetching data:', error);
      });
  });

  function displayData(data) {
    // Clear previous table data
    $('tbody', dataTable).empty();

    // Display fetched data in the table
    data.forEach(function(item) {
      const row = `<tr>
                    <td>${item.id}</td>
                    <td>${item.date}</td>
                    <!-- Add other table data here -->
                  </tr>`;
      $('tbody', dataTable).append(row);
    });

    // Add pagination logic here if needed
    // Example: You might receive pagination information from the server and dynamically create pagination links.
  }
});*/
