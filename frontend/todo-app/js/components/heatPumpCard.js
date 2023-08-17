/**
 * A card component to display door information.
 */
(function (win) {

  class HeatPumpCard extends EventEmitter {
    /** @type {HTMLElement} */
    #element;
    /** @type {string} */
    #status;
    /** @type {number} */
    #serviceId;
    /** @type {Handler[]} */
    #handlers = [];
    #client;

    constructor(client, params) {
      super();
      this.#client = client;
      this.#status = params.status;
      this.#serviceId = params.id;
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
      this.#element.className = 'card';
      this.#element.setAttribute("style",
        "  border-radius: 25px; border: 2px solid #73AD21;");

      // TITLE
      const title = document.createElement('div');
      title.className = 'd-flex align-items-center';


      const totalLabel = document.createElement('h5');
      totalLabel.className = 'card-title mr-5';
      totalLabel.textContent = 'Door'
      totalLabel.setAttribute("style", "margin-right: 5px;");
      title.appendChild(totalLabel);

      const icon = document.createElement('i');
      icon.className = "bbi bi-fuel-pump-fill";
      icon.className = "bbi bi-fire";
      icon.setAttribute("style", "margin-right: 5px;");
      title.appendChild(icon);

      const circle = document.createElement('div');
      circle.className = 'circle';
      title.appendChild(circle);

      this.#element.appendChild(title);

      //CARD BODY
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
      this.#element.appendChild(cardBody);

      const openedLabel = document.createElement('a');
      openedLabel.className = 'btn btn-primary';
      openedLabel.textContent = (this.#status === 'CLOSED' || this.#status === 'ERROR') ? 'Open' : 'close';
      this.#element.appendChild(openedLabel);

      return this.#element;
    }

    /**
     * Opens a door and updates the displayed count.
     */
    openDoor() {
      this.updateDoorCount();
    }

    /**
     * Closes a door and updates the displayed count.
     */
    closeDoor() {
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
