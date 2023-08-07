/**
 * A card component to display door information.
 */
(function (win) {

  class DoorCard extends EventEmitter {
    /** @type {HTMLElement} */
    #element;
    /** @type {boolean} */
    #isOpen;
    /** @type {Handler[]} */
    #handlers = [];

    /**
     * Creates a new instance of `DoorCardComponent`.
     */
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
    /**
     * Initializes the component.
     * @return {HTMLElement} The root element for this component.
     */
    async init() {
      this.#element = document.createElement('div');
      this.#element.className = 'door-card';

      const icon = document.createElement('i');
      icon.className = 'bi-door';
      this.#element.appendChild(icon);

      const circle = document.createElement('div');
      circle.className = 'circle';
      this.#element.appendChild(circle);

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
      this.#element.appendChild(cardBody);

      const totalLabel = document.createElement('h5');
      totalLabel.className = 'card-title';
      totalLabel.textContent = 'Door'
      this.#element.appendChild(totalLabel);

      const openedLabel = document.createElement('a');
      openedLabel.className = 'btn btn-primary';
      openedLabel.textContent = 'Opened Doors:';
      this.#element.appendChild(openedLabel);

      const openedValue = document.createElement('span');
      openedValue.textContent = this.#isOpen ? 'Opened' : 'Closed';
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
  win.DoorCard ||= DoorCard;

})(window);
/*// Example usage
const totalDoors = 3;
const openedDoors = 1;

const doorCard = new DoorCardComponent(totalDoors, openedDoors);
const doorCardElement = doorCard.init();

document.getElementById('door-card-container').appendChild(doorCardElement);*/
