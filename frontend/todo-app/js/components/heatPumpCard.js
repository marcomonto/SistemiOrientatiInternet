/**
 * A card component to display door information.
 */
(function (win) {

  class HeatPumpCard extends EventEmitter {
    /** @type {HTMLElement} */
    #element;
    /** @type {boolean} */
    #isOpen;
    /** @type {Handler[]} */
    #handlers = [];

    constructor(isOpen = true) {
      super();
      this.#isOpen = isOpen;
    }
    /**
     * Destroys this component, removing it from it's parent node.
     */
    destroy() {
      this.#handlers.forEach(h => h.unregister());
      this.#element.remove();
    }
    async init() {
      this.#element = document.createElement('div');
      this.#element.className = 'heat-pump-card';

      const icon = document.createElement('i');
      icon.className = 'bi-heat-pump';
      this.#element.appendChild(icon);

      const circle = document.createElement('div');
      circle.className = 'circle';
      this.#element.appendChild(circle);

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
      this.#element.appendChild(cardBody);

      const totalLabel = document.createElement('h5');
      totalLabel.className = 'card-title';
      totalLabel.textContent = 'Heat Pump'
      this.#element.appendChild(totalLabel);

      const openedLabel = document.createElement('a');
      openedLabel.className = 'btn btn-primary';
      this.#element.appendChild(openedLabel);

      const openedValue = document.createElement('span');
      openedValue.textContent = this.#isOpen ? 'Opened' : 'Closed';
      openedValue.className = 'opened-doors-value';
      this.#element.appendChild(openedValue);

      const openButton = document.createElement('button');
      openButton.textContent = 'Open Heat Pump';
      const openHandler = new Handler('click', openButton, () => this.openDoor());
      this.#handlers.push(openHandler);
      this.#element.appendChild(openButton);

      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close Heat Pump';
      const closeHandler = new Handler('click', closeButton, () => this.closeDoor());
      this.#handlers.push(closeHandler);
      this.#element.appendChild(closeButton);

      return this.#element;
    }

    /**
     * Opens a door and updates the displayed count.
     */
    openDoor() {
      this.#isOpen = !this.#isOpen;
      this.updateDoorCount();
    }

    /**
     * Closes a door and updates the displayed count.
     */
    closeDoor() {
      this.#isOpen = !this.#isOpen;
      this.updateDoorCount();
    }

    /**
     * Updates the displayed count of opened doors.
     */
    updateDoorCount() {
      const openedValue = this.#element.querySelector('.opened-doors-value');
    }
  }

  /* Exporting component */
  win.HeatPumpCard ||= HeatPumpCard;

})(window);
