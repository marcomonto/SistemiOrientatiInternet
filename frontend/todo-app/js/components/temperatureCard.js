(function (win) {
  class WeatherCard extends EventEmitter {
    /** @type {HTMLElement} */
    #element;
    /** @type {number} */
    #homeTemperature;
    /** @type {number} */
    #weatherTemperature;
    /** @type {Handler[]} */
    #handlers = [];
    #client;
    #temperatureChart;
    #weatherChart;
    #rxjsSubscriptions = [];
    #statusObserver;

    /**
     * Creates a new instance of `TemperatureCardComponent`.
     * @params {} Payload.
     */
    constructor(client, params) {
      super();
      this.#client = client;
      this.#homeTemperature = params.value;
    }

    /**
     * Initializes the component.
     * @return {HTMLElement} The root element for this component.
     */
    init() {
      this.#element = document.createElement('div');
      this.#element.className = 'container';
      this.#element.id = 'weatherCard';


      const containerGraph = document.createElement('div');
      containerGraph.className = 'row';
      //containerGraph.setAttribute("style",
       // "max-width:400px");
      //------------------------------ FIRST COLUMN -----------------------------
      const containerColumnOne = document.createElement('div');
      containerColumnOne.className = 'col-6';

      const graphWeather = document.createElement('canvas');
      graphWeather.id = "weatherTemperatureChart";
      graphWeather.setAttribute("style",
        "height: 200px; width:50%");
      this.renderChart(graphWeather, 'WEATHER')
      containerColumnOne.appendChild(graphWeather);

      const weatherTemperatureValue = document.createElement('span');
      weatherTemperatureValue.textContent = this.#homeTemperature.toString();
      weatherTemperatureValue.className = 'temperature';
      weatherTemperatureValue.id = 'weatherTemperatureLabel';
      containerColumnOne.appendChild(weatherTemperatureValue);

      containerGraph.appendChild(containerColumnOne);
      //------------------------------ SECOND COLUMN ----------------------------------
      const containerColumnTwo = document.createElement('div');
      containerColumnTwo.className = 'col-6';

      const graphTemperature = document.createElement('canvas');
      graphTemperature.id = "insideTemperatureChart";
      graphTemperature.setAttribute("style",
        "height: 200px; width:50%");
      this.renderChart(graphTemperature, 'HOME')
      containerColumnTwo.appendChild(graphTemperature);

      const temperatureValue = document.createElement('span');
      temperatureValue.textContent = this.#homeTemperature.toString();
      temperatureValue.className = 'temperature';
      weatherTemperatureValue.id = 'homeTemperatureLabel';
      containerColumnTwo.appendChild(temperatureValue);

      containerGraph.appendChild(containerColumnTwo);

      this.#element.appendChild(containerGraph);

      return this.#element;
    }

    renderChart(canvas, type) {
      const labels = [];

      const data = {
        labels: labels,
        datasets: [
          {
            id: 'WEATHER',
            label: type === 'WEATHER' ? 'Weather Temperature' : 'Home Temperature',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [],
          },
        ]
      };
      const config = {
        type: 'line',
        data: data,
        options: {}
      };
      const chart = new Chart(
        canvas,
        config
      );
      if(type === 'WEATHER')
        this.#weatherChart = chart;
      else
        this.#temperatureChart = chart;
    }

    addData(chart, label, data) {
      if(chart.data.labels.length === 10){
        chart.data.labels.shift();
        chart.data.datasets.forEach((dataset) => {
          dataset.data.shift();
        });
      }
      chart.data.labels.push(label);
      chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
      });
      chart.update();
    }

    update(payload) {
      let observerObj = {};
      if(payload.serviceType === 'thermometer'){
        this.addData(this.#temperatureChart, payload.lastScanAt.substring(11,19), Number(payload.value.toFixed(2)))
        observerObj.homeTemperature = payload.value;
      }
      else if(payload.serviceType === 'weather'){
        this.addData(this.#weatherChart,payload.lastScanAt.substring(11,19), Number(payload.value.toFixed(2)))
        observerObj.weatherTemperature = payload.weatherTemperature;
      }
      else return
      this.#statusObserver.next(observerObj);
    }
    registerRenderComponents() {
      const { BehaviorSubject } = rxjs;
      const statusObserver = new BehaviorSubject({homeTemperature: this.#homeTemperature, weatherTemperature: this.#weatherTemperature}); //initialValue
      const statusSubscription = statusObserver.subscribe(payload => {
        if(!!payload.homeTemperature && payload.homeTemperature !== this.#homeTemperature){
          let elementToUpdate = document.querySelector('#homeTemperatureLabel');
          elementToUpdate.textContent = payload.homeTemperature.toFixed(2);
          this.#homeTemperature = payload.homeTemperature;
        }
        if(!!payload.weatherTemperature && payload.weatherTemperature !== this.#weatherTemperature){
          let elementToUpdate = document.querySelector('#weatherTemperatureLabel');
          elementToUpdate.textContent = payload.weatherTemperature.toFixed(2);
          this.#weatherTemperature = payload.weatherTemperature;
        }
      });
      this.#rxjsSubscriptions.push(statusSubscription)
      this.#statusObserver = statusObserver;
    }
  }

  /* Exporting component */
  win.WeatherCard ||= WeatherCard;

})(window);
