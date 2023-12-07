`use strict`;
(function (win) {
  class HomePageView extends EventEmitter {
    /** @type {HTMLElement} */
    #element;
    /** @type {RestClient} */
    #client;
    /** @type {Handler[]} */
    #handlers = [];
    #socket = null;
    #intervalLostSensors = null;
    #components = new Map();

    /**
     * Instances a new `LoginComponent`.
     * @param client {RestClient} The REST client
     */
    constructor(client) {
      super();
      this.#client = client;
      document.getElementById('confirmAddSensorButton').addEventListener('click',
        () => this.addSensor(document.getElementById('sensorToAddAddress').value,document.getElementById('sensorToAddType').value)
      );
    }

    /**
     * Destroys this component, removing it from it's parent node.
     */
    destroy() {
      this.#handlers.forEach(h => h.unregister());
      this.#element.remove();
      this.#socket.close();
      clearInterval(this.#intervalLostSensors);
    }

    /**
     * Initializes the component.
     * @return {Promise<HTMLElement>} The root element for this component.
     */
    async init() {
      this.#element = document.createElement('div');
      this.#element.innerHTML = document.querySelector('script#homePage-template').textContent;
      this.connectWebSocket();
      this.#intervalLostSensors = setInterval(async () => {
        let response = await this.#client.get('healthCheck')
        console.log(response)
      }, 15000)
      return this.#element;
    }

    /**
     * @param {string} address - The address of the sensor.
     * @param {string} type - The type of the sensor.
     */
    async addSensor(address, type){
      let response = await this.#client.post('sensor',{
        address: address,
        type: type
      });
      console.log(response)
      console.log(address,type)
    }

    connectWebSocket() {
      this.#socket = new WebSocket('ws://'+ window.location.hostname +':8000'); // Replace with your WebSocket server URL
      // WebSocket event handlers
      this.#socket.onopen = () => {
        // Send a message to the WebSocket server
        this.#socket.send(JSON.stringify({
          type: 'subscribe'
        }));
      };
      this.#socket.onmessage =  (event) => {
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
      this.#socket.onclose = function () {
        console.log('WebSocket connection closed.');
      };

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
        case 'WeatherCard':
        case 'ThermometerCard':
          if(!this.#components.get('weatherCard')){
            const weatherCard = new WeatherCard(this.#client, params);
            let element = await weatherCard.init()
            element.className = 'col-12';
            this.#element.querySelector('#temperatureCards').appendChild(element);
            weatherCard.registerRenderComponents(); // init reactivity
            this.#components.set('weatherCard',weatherCard);
          }
          else{
            let component = this.#components.get('weatherCard');
            component.update(params);
          }
          break;
        default:
          console.error('Unknown component type:', componentType);
      }
    }
  }

  /* Exporting component */
  win.HomePageView ||= HomePageView;

})(window);
