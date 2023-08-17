/**
 * A card component to display window information.
 */
(function (win) {
  class WindowCard extends EventEmitter{
    /** @type {HTMLElement} */
    #element;
    /** @type {string} */
    #status;
    /** @type {number} */
    #serviceId;
    /** @type {Handler[]} */
    #handlers = [];
    #client;

    /**
     * Creates a new instance of `WindowCardComponent`.
     */
    constructor(client, params) {
      super();
      this.#client = client;
      this.#status = params.status;
      this.#serviceId = params.id;
    }

    /**
     * Initializes the component.
     * @return {HTMLElement} The root element for this component.
     */
    init() {
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
      icon.className = "bi bi-shop-window";
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
     * Opens a window and updates the displayed count.
     */
    openWindow() {
    }

    /**
     * Closes a window and updates the displayed count.
     */
    closeWindow() {
    }

    /**
     * Updates the displayed count of opened windows.
     */
    updateWindowCount() {
      const openedValue = this.#element.querySelector('.opened-value');
    }
  }

  /* Exporting component */
  win.WindowCard ||= WindowCard;

})(window);
