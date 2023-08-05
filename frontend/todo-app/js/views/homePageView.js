`use strict`;
(function (win) {
  class ActiveService {
    #id;
    #params;
    constructor(id , params) {
      this.#id = id;
      this.#params = params;
    }
  }
  /**
   * A login component.
   */
  class HomePageComponent extends EventEmitter {
    /** @type {HTMLElement} */
    #element;
    /** @type {RestClient} */
    #client;
    /** @type {Handler[]} */
    #handlers = [];
    /** @type {ActiveService[]} */
    #activeServices = [];

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
      this.#element.innerHTML = document.querySelector('script#homePage-template').textContent;
      const btn = this.#element.querySelector('button');
      const hdlr = new Handler('click', btn, () => this.test());
      this.#handlers.push(hdlr);
      //rxjs.fromEvent(document, 'click').subscribe(() => console.log('asdasd!'));
      this.connectWebSocket();
      return this.#element;
    }

    async test() {
      try {
        let response = await this.#client.get('updateInfo')
        console.log(response)
      } catch (err) {
        console.log(err)
      }
    }

    connectWebSocket() {
      const socket = new WebSocket('ws://localhost:8000'); // Replace with your WebSocket server URL
      // WebSocket event handlers
      socket.onopen = function () {
        // Send a message to the WebSocket server
        socket.send(JSON.stringify({
          type: 'subscribe'
        }));
      };
      socket.onmessage = function (event) {
        console.log('Received message:', event.data);
      };
      socket.onclose = function () {
        console.log('WebSocket connection closed.');
      };

    }

    renderDynamicComponent(componentData) {
      const { componentType, componentParams } = componentData;

      switch (componentType) {
        case 'WindowCard':
          const otherComponent = new WindowCard(componentParams);
          otherComponent.init().then((element) => {
            this.#element.appendChild(element);
          });
          break;
        case 'DoorCard':
          const anotherComponent = new DoorCard(componentParams);
          anotherComponent.init().then((element) => {
            this.#element.appendChild(element);
          });
          break;
        case 'HeatPump':
          const heatPumpCard = new HeatPumpCard(componentParams);
          heatPumpCard.init().then((element) => {
            this.#element.appendChild(element);
          });
          break;
        case 'WeatherCard':
          const weatherCard = new WeatherCard(componentParams);
          weatherCard.init().then((element) => {
            this.#element.appendChild(element);
          });
          break;
        default:
          console.error('Unknown component type:', componentType);
      }
    }
  }

  /* Exporting component */
  win.HomePageComponent ||= HomePageComponent;

})(window);
