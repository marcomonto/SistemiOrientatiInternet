`use strict`;
(function (win) {
  class HomePageComponent extends EventEmitter {
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
      socket.onopen = () => {
        // Send a message to the WebSocket server
        socket.send(JSON.stringify({
          type: 'subscribe'
        }));
      };
      socket.onmessage =  (event) => {
        console.log('Received message:', event.data);
        try {
          let message = JSON.parse(event.data);
          let serviceType = message.payload.serviceType;
          let data = message.payload;
          switch (serviceType) {
            case 'weather':
              this.renderDynamicComponent('WeatherCard', data);
              break;
            case 'window':
              this.renderDynamicComponent('WindowCard',data);
              break;
            case'door':
              this.renderDynamicComponent('DoorCard', data);
              break;
            case 'heatPump':
              this.renderDynamicComponent('HeatPumpCard', data);
              break;
            case 'thermometer':
              this.renderDynamicComponent('ThermometerCard', data);
              break;
            default:
              break;
          }
        } catch (e) {
          console.log(e)
        }

      };
      socket.onclose = function () {
        console.log('WebSocket connection closed.');
      };

    }

    async renderDynamicComponent(componentType, params) {
      switch (componentType) {
        case 'WindowCard':
          if(!this.#components.get('windowCard')){
            const weatherCard = new WindowCard(this.#client, params);
            let element = await weatherCard.init();
            element.className = 'col-4';
            this.#element.querySelector('#sensorCards').appendChild(element);
            this.#components.set('windowCard',weatherCard);
          }
          else{
            let component = this.#components.get('windowCard');
            component.update(params);
          }
          break;
        case 'DoorCard':
          if(!this.#components.get('doorCard')){
            const doorCard = new DoorCard(this.#client, params);
            let element = await doorCard.init();
            element.className = 'col-4';
            this.#element.querySelector('#sensorCards').appendChild(element);
            this.#components.set('doorCard',doorCard);
          }
          else{
            let component = this.#components.get('doorCard');
            component.update(params);
          }
          break;
        case 'HeatPumpCard':
          if(!this.#components.get('heatPumpCard')){
            const heatPumpCard = new HeatPumpCard(this.#client, params);
            let element = await heatPumpCard.init()
            element.className = 'col-4';
            this.#element.querySelector('#sensorCards').appendChild(element);
            this.#components.set('heatPumpCard',heatPumpCard);
          }
          else{
            let component = this.#components.get('heatPumpCard');
            component.update(params);
          }
          break;
        case 'WeatherCard':
          if(!this.#components.get('weatherCard')){
            const weatherCard = new WeatherCard(this.#client, params);
            let element = await weatherCard.init()
            element.className = 'col-6';
            this.#element.querySelector('#temperatureCards').appendChild(element);
            this.#components.set('weatherCard',weatherCard);
          }
          else{
            let component = this.#components.get('weatherCard');
            component.updateTemperature(params.value);
          }
          break;
        case 'ThermometerCard':
          const thermometerCard = new ThermometerCard(this.#client, params);
          thermometerCard.init().then((element) => {
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
