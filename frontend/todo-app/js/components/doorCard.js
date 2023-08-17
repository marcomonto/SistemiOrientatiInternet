/**
 * A card component to display door information.
 */

(function (win) {

  class DoorCard extends EventEmitter {
    /** @type {HTMLElement} */
    #element;
    /** @type {string} */
    #status;
    /** @type {number} */
    #serviceId;
    /** @type {Handler[]} */
    #handlers = [];
    #client;
    /** @type {[]} */
    #rxjsSubscriptions = [];
    #statusObserver;
    #waitingForResponse = false;


    /**
     * Creates a new instance of `DoorCardComponent`.
     */
    constructor(client, params) {
      super();
      this.#client = client;
      this.#status = params.status;
      this.#serviceId = params.id;
      this.registerRenderComponents()
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
      this.#element.className = 'card';
      this.#element.id = 'card_' + this.#serviceId;
      this.#element.setAttribute("style",
        (this.#status === 'CLOSED' || this.#status === 'ERROR') ?
          "border-radius: 25px; border: 2px solid yellow;" :
          "border-radius: 25px; border: 2px solid #73AD21;");

      // TITLE
      const title = document.createElement('div');
      title.className = 'd-flex align-items-center';


      const totalLabel = document.createElement('h5');
      totalLabel.className = 'card-title mr-5';
      totalLabel.textContent = 'Door'
      totalLabel.setAttribute("style", "margin-right: 5px;");
      title.appendChild(totalLabel);

      const icon = document.createElement('i');
      icon.id = "iconCard_" + this.#serviceId;
      icon.className = (this.#status === 'CLOSED' || this.#status === 'ERROR') ? "bi bi-door-closed" : 'bi bi-door-open';
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
      openedLabel.id = 'buttonCard_' + this.#serviceId;
      openedLabel.className = 'btn btn-primary';
      openedLabel.textContent = (this.#status === 'CLOSED' || this.#status === 'ERROR') ? 'Open' : 'Close Door';
      this.#element.appendChild(openedLabel);

      return this.#element;
    }
    async buttonStatusClicked() {
      try{
        if(this.#waitingForResponse)
          return;
        this.#waitingForResponse = true;
        //let response = await axios.put();
        this.#waitingForResponse = false;
      }
      catch (e) {
        console.log(e)
        this.#waitingForResponse = false;
      }
    }
    update(payload) {
      if(!!payload.status)
        this.#statusObserver.next({
          valueType: 'STATUS',
          value: payload.status
        })
    }
    registerRenderComponents() {
      const { BehaviorSubject } = rxjs;
      const statusObserver = new BehaviorSubject(this.#status); //initialValue
      const statusSubscription = statusObserver.subscribe(newValue => {
        if(newValue.valueType === 'STATUS' && newValue.value !== this.#status){
          let elementToUpdate = document.querySelector('#card_' + this.#serviceId);
          let iconToUpdate = document.querySelector('#iconCard_' + this.#serviceId);
          let buttonToUpdate = document.querySelector('#buttonCard_' + this.#serviceId);
          switch (newValue.valueType) {
            case 'on':
              elementToUpdate.setAttribute("style", "border-radius: 25px; border: 2px solid #73AD21;");
              iconToUpdate.className = 'bi bi-door-open';
              buttonToUpdate.textContent = 'Close'
              break;
            case 'off':
              elementToUpdate.setAttribute("style", "border-radius: 25px; border: 2px solid red;");
              iconToUpdate.className = 'bi bi-door-close';
              buttonToUpdate.textContent = 'Open'
              break;
            case 'error':
              elementToUpdate.setAttribute("style", "border-radius: 25px; border: 2px solid red;");
              iconToUpdate.className = 'bi bi-door-open';
              buttonToUpdate.textContent = 'Open'
              break;
          }
        }
      });
      this.#rxjsSubscriptions.push(statusSubscription)
      this.#statusObserver = statusObserver;
    }
  }

  /* Exporting component */
  win.DoorCard ||= DoorCard;

})(window);
