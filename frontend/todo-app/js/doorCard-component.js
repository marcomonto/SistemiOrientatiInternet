/**
 * A card component to display door information.
 */
(function (win) {

  class DoorCardComponent extends EventEmitter {
    /** @type {HTMLElement} */
    #element;
    /** @type {number} */
    #totalDoors;
    /** @type {number} */
    #openedDoors;
    /** @type {Handler[]} */
    #handlers = [];

    /**
     * Creates a new instance of `DoorCardComponent`.
     * @param totalDoors {number} The total number of doors.
     * @param openedDoors {number} The count of opened doors.
     */
    constructor(totalDoors, openedDoors) {
      super();
      this.#totalDoors = totalDoors;
      this.#openedDoors = openedDoors;
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
     * @return {HTMLElement} The root element for this component.
     */
    async init() {
      this.#element = document.createElement('div');
      this.#element.className = 'door-card';

      const title = document.createElement('h3');
      title.textContent = 'Door Information';
      this.#element.appendChild(title);

      const totalLabel = document.createElement('span');
      totalLabel.textContent = 'Total Doors:';
      this.#element.appendChild(totalLabel);

      const totalValue = document.createElement('span');
      totalValue.textContent = this.#totalDoors.toString();
      this.#element.appendChild(totalValue);

      const openedLabel = document.createElement('span');
      openedLabel.textContent = 'Opened Doors:';
      this.#element.appendChild(openedLabel);

      const openedValue = document.createElement('span');
      openedValue.textContent = this.#openedDoors.toString();
      openedValue.className = 'opened-doors-value';
      this.#element.appendChild(openedValue);

      const openButton = document.createElement('button');
      openButton.textContent = 'Open Door';
      const openHandler = new Handler('click', openButton, () => this.openDoor());
      this.#handlers.push(openHandler);
      this.#element.appendChild(openButton);

      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close Door';
      const closeHandler = new Handler('click', closeButton, () => this.closeDoor());
      this.#handlers.push(closeHandler);
      this.#element.appendChild(closeButton);

      return this.#element;
    }

    /**
     * Opens a door and updates the displayed count.
     */
    openDoor() {
      this.#openedDoors++;
      this.updateDoorCount();
    }

    /**
     * Closes a door and updates the displayed count.
     */
    closeDoor() {
      if (this.#openedDoors > 0) {
        this.#openedDoors--;
        this.updateDoorCount();
      }
    }

    /**
     * Updates the displayed count of opened doors.
     */
    updateDoorCount() {
      const openedValue = this.#element.querySelector('.opened-doors-value');
      openedValue.textContent = this.#openedDoors.toString();
    }
  }

  /* Exporting component */
  win.DoorCardComponent ||= DoorCardComponent;

})(window);
/*// Example usage
const totalDoors = 3;
const openedDoors = 1;

const doorCard = new DoorCardComponent(totalDoors, openedDoors);
const doorCardElement = doorCard.init();

document.getElementById('door-card-container').appendChild(doorCardElement);*/
