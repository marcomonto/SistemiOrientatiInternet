`use strict`;

(function (win) {

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
        console.log('Waiting ');
      };
      socket.onmessage = function (event) {
        console.log('Received message:', event.data);
      };
      socket.onclose = function () {
        console.log('WebSocket connection closed.');
      };
      // Send a message to the WebSocket server
      socket.send(JSON.stringify({
        type: 'subscribe'
      }));
    }
  }

  /* Exporting component */
  win.HomePageComponent ||= HomePageComponent;

})(window);
