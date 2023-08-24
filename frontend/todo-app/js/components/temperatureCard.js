(function (win) {
  class WeatherCard extends EventEmitter {
    /** @type {HTMLElement} */
    #element;
    /** @type {number} */
    #currentTemperature;
    /** @type {Handler[]} */
    #handlers = [];
    #client;

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

      const graphHome = document.createElement('canvas');
      graphHome.id = "weatherTemperatureChart";
      graphHome.setAttribute("style",
        "height: 200px; width:50%");
      this.renderChart(graphHome, 'HOME')
      containerGraph.appendChild(graphHome);

      this.#element.appendChild(containerGraph);

      const title = document.createElement('h3');
      title.textContent = 'Temperature Information';
      title.className = 'card-header';
      this.#element.appendChild(title);

      const temperatureLabel = document.createElement('span');
      temperatureLabel.textContent = 'Current Temperature:';
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

      const myChart = new Chart(
        canvas,
        config
      );
      const startTime = Date.now();
      setInterval(() => {
        let currentTime = Date.now() - startTime;
        let value = Math.random() * 100; // Generate a random value for demonstration
        this.addData(myChart, currentTime, value);
      }, 3000); // Update every 1 second
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
      console.log(chart.data.labels, chart.data.datasets[0])
      chart.update();
    }

    updateTemperature(newTemperature) {
      return;
      this.#currentTemperature = newTemperature
      const temperatureValue = this.#element.querySelector('.temperature-value');
      temperatureValue.textContent = this.#currentTemperature.toFixed(2);
    }
  }

  /* Exporting component */
  win.WeatherCard ||= WeatherCard;

})(window);
