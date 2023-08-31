(function (win) {
  class WeatherCard extends EventEmitter {
    /** @type {HTMLElement} */
    #element;
    /** @type {number} */
    #currentTemperature;
    /** @type {number} */
    #weatherTemperature;
    /** @type {Handler[]} */
    #handlers = [];
    #client;
    #temperatureChart;
    #weatherChart;

    /**
     * Creates a new instance of `TemperatureCardComponent`.
     * @params {} Payload.
     */
    constructor(client, params) {
      super();
      this.#client = client;
      this.#currentTemperature = params.value;
    }

    /**
     * Initializes the component.
     * @return {HTMLElement} The root element for this component.
     */
    init() {
      this.#element = document.createElement('div');
      this.#element.className = 'card';
      this.#element.id = 'weatherCard';


      const containerGraph = document.createElement('div');
      containerGraph.className = 'd-flex';
      containerGraph.setAttribute("style",
        "max-width:400px");

      const graphWeather = document.createElement('canvas');
      graphWeather.id = "weatherTemperatureChart";
      graphWeather.setAttribute("style",
        "height: 200px; width:50%");
      this.renderChart(graphWeather, 'WEATHER')
      containerGraph.appendChild(graphWeather);

      const graphTemperature = document.createElement('canvas');
      graphTemperature.id = "insideTemperatureChart";
      graphTemperature.setAttribute("style",
        "height: 200px; width:50%");
      this.renderChart(graphTemperature, 'HOME')
      containerGraph.appendChild(graphTemperature);

      this.#element.appendChild(containerGraph);

      const titleWeather = document.createElement('h3');
      titleWeather.textContent = 'Temperature Information';
      titleWeather.className = 'card-header';
      this.#element.appendChild(titleWeather);

      const weatherTemperatureLabel = document.createElement('span');
      weatherTemperatureLabel.textContent = 'Current Weather Temperature:';
      this.#element.appendChild(weatherTemperatureLabel);

      const weatherTemperatureValue = document.createElement('span');
      weatherTemperatureValue.textContent = this.#currentTemperature.toString();
      weatherTemperatureValue.className = 'temperature-value card-text';
      this.#element.appendChild(weatherTemperatureValue);

      const titleTemperature = document.createElement('h3');
      titleTemperature.textContent = 'Temperature Information';
      titleTemperature.className = 'card-header';
      this.#element.appendChild(titleTemperature);

      const temperatureLabel = document.createElement('span');
      temperatureLabel.textContent = 'Current Home Temperature:';
      this.#element.appendChild(temperatureLabel);

      const temperatureValue = document.createElement('span');
      temperatureValue.textContent = this.#currentTemperature.toString();
      temperatureValue.className = 'temperature-value card-text';
      this.#element.appendChild(temperatureValue);

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
/*      const startTime = Date.now();
      setInterval(() => {
        let currentTime = Date.now() - startTime;
        let value = Math.random() * 100; // Generate a random value for demonstration
        this.addData(chart, currentTime, value);
      }, 3000); // Update every 1 second*/
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
      if(payload.serviceType === 'thermometer'){
        this.addData(this.#temperatureChart, payload.lastScanAt.substring(11,19), Number(payload.value.toFixed(2)))
      }
      else if(payload.serviceType === 'weather'){
        this.addData(this.#weatherChart,payload.lastScanAt.substring(11,19), Number(payload.value.toFixed(2)))
      }
      else return
      return;
      this.#currentTemperature = newTemperature
      const temperatureValue = this.#element.querySelector('.temperature-value');
      temperatureValue.textContent = this.#currentTemperature.toFixed(2);
    }
  }

  /* Exporting component */
  win.WeatherCard ||= WeatherCard;

})(window);
