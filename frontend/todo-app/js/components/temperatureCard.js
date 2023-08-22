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

      const graph = document.createElement('canvas');
      graph.id = "weatherTemperatureChart";
      this.renderChart(graph)
      this.#element.appendChild(graph);

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

    renderChart(canvas) {
      //const canvas = document.getElementById('weatherTemperatureChart');
      console.log(canvas);
      canvas.height = 75;

      const labels = [
        'dju32',
        'ad6b2',
        '0f23f',
        'asd4c',
      ];

      const data = {
        labels: labels,
        datasets: [{
          label: 'Test',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [0, 10, 5, 4],
        }]
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
      setInterval(() => {
        const newLabel = (Math.random() + 1).toString(36).substring(7);
        const newData = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
        this.addData(myChart, newLabel, newData);
      }, 1000);
    }

    addData(chart, label, data) {
      chart.data.labels.push(label);
      chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
      });
      chart.update();
    }

    updateTemperature(newTemperature) {
      this.#currentTemperature = newTemperature
      const temperatureValue = this.#element.querySelector('.temperature-value');
      temperatureValue.textContent = this.#currentTemperature.toFixed(2);
    }
  }

  /* Exporting component */
  win.WeatherCard ||= WeatherCard;

})(window);
