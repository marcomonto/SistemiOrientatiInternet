/**
 * A card component to display window information.
 */
(function (win) {
  class WindowCardComponent extends EventEmitter{
    /** @type {HTMLElement} */
    #element;
    /** @type {number} */
    #totalWindows;
    /** @type {number} */
    #openedWindows;
    /** @type {Handler[]} */
    #handlers = [];

    /**
     * Creates a new instance of `WindowCardComponent`.
     * @param totalWindows {number} The total number of windows.
     * @param openedWindows {number} The count of opened windows.
     */
    constructor(totalWindows, openedWindows) {
      super();
      this.#totalWindows = totalWindows;
      this.#openedWindows = openedWindows;
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

      const totalValue = document.createElement('span');
      totalValue.textContent = this.#totalWindows.toString();
      this.#element.appendChild(totalValue);

      const openedLabel = document.createElement('span');
      openedLabel.textContent = 'Opened Windows:';
      this.#element.appendChild(openedLabel);

      const openedValue = document.createElement('span');
      openedValue.textContent = this.#openedWindows.toString();
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
      this.#openedWindows++;
      this.updateWindowCount();
    }

    /**
     * Closes a window and updates the displayed count.
     */
    closeWindow() {
      if (this.#openedWindows > 0) {
        this.#openedWindows--;
        this.updateWindowCount();
      }
    }

    /**
     * Updates the displayed count of opened windows.
     */
    updateWindowCount() {
      const openedValue = this.#element.querySelector('.opened-value');
      openedValue.textContent = this.#openedWindows.toString();
    }
  }

  /* Exporting component */
  win.WindowCardComponent ||= WindowCardComponent;

})(window);
/*// Example usage
const totalWindows = 5;
const openedWindows = 2;

const windowCard = new WindowCardComponent(totalWindows, openedWindows);
const windowCardElement = windowCard.init();

document.getElementById('window-card-container').appendChild(windowCardElement);*/
