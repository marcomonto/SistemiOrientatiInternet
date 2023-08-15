
  (function (win) {
  class WeatherCard extends EventEmitter {
    /** @type {HTMLElement} */
    #element;
    /** @type {number} */
    #currentTemperature;
    /** @type {Handler[]} */
    #handlers = [];

    /**
     * Creates a new instance of `TemperatureCardComponent`.
     * @params {} Payload.
     */
    constructor(params) {
      super();
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
    /**
     * Updates the displayed temperature value.
     */
    updateTemperature(newTemperature) {
      this.#currentTemperature = newTemperature
      const temperatureValue = this.#element.querySelector('.temperature-value');
      temperatureValue.textContent = this.#currentTemperature.toFixed(2);
    }
  }

  /* Exporting component */
  win.WeatherCard ||= WeatherCard;

})(window);
