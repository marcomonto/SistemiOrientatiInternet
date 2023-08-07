/**
 * A card component to display window information.
 */
(function (win) {
  class WindowCard extends EventEmitter{
    /** @type {HTMLElement} */
    #element;
    /** @type {boolean} */
    #isOpened;
    /** @type {Handler[]} */
    #handlers = [];

    /**
     * Creates a new instance of `WindowCardComponent`.
     */
    constructor( isOpen= true) {
      super();
      this.#isOpened = isOpen;
    }

    /**
     * Initializes the component.
     * @return {HTMLElement} The root element for this component.
     */
    init() {
      this.#element = document.createElement('div');
      this.#element.className = 'window-card';

      const title = document.createElement('h3');
      title.textContent = 'Window Information';
      this.#element.appendChild(title);

      const totalLabel = document.createElement('span');
      totalLabel.textContent = 'Total Windows:';
      this.#element.appendChild(totalLabel);

      const openedLabel = document.createElement('span');
      openedLabel.textContent = 'Opened Windows:';
      this.#element.appendChild(openedLabel);

      const openedValue = document.createElement('span');
      openedValue.textContent = this.#isOpened ? 'Open' : 'Closed';
      this.#element.appendChild(openedValue);

      const openButton = document.createElement('button');
      openButton.textContent = 'Open Window';
      const openHandler = new Handler('click', openButton, () => this.openWindow());
      this.#handlers.push(openHandler);
      this.#element.appendChild(openButton);

      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close Window';
      const closeHandler = new Handler('click', closeButton, () => this.closeWindow());
      this.#handlers.push(closeHandler);
      this.#element.appendChild(closeButton);

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
