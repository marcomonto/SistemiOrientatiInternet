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
    /** @type {string} */
    #lastScanAt;
    /** @type {Handler[]} */
    #handlers = [];
    #client;
    #rxjsSubscriptions = [];
    #statusObserver;
    #waitingForResponse = false;

    /**
     * Creates a new instance of `WindowCardComponent`.
     */
    constructor(client, params) {
      super();
      this.#client = client;
      this.#status = params.status;
      this.#serviceId = params.id;
      this.#lastScanAt = params.lastScanAt;
      this.registerRenderComponents()
    }

    /**
     * Initializes the component.
     * @return {HTMLElement} The root element for this component.
     */
    init() {
      this.#element = document.createElement('div');
      this.#element.className = 'card';
      this.#element.id = 'card_' + this.#serviceId;
      this.#element.setAttribute("style",
        "  border-radius: 25px; border: 2px solid #73AD21;");

      // TITLE
      const title = document.createElement('div');
      title.className = 'd-flex align-items-center';
      title.setAttribute("style",
        "padding: 5px;");


      const totalLabel = document.createElement('h5');
      totalLabel.className = 'card-title mr-5';
      totalLabel.textContent = 'Window #' + this.#serviceId;
      totalLabel.setAttribute("style", "margin-right: 5px;");
      title.appendChild(totalLabel);

      const icon = document.createElement('i');
      icon.id = "iconCard_" + this.#serviceId;
      icon.className = "bi bi-shop-window";
      icon.setAttribute("style", "margin-right: 5px;");
      title.appendChild(icon);

      const circle = document.createElement('div');
      circle.className = 'circle';
      title.appendChild(circle);

      const labelLastScanAt = document.createElement('div');
      labelLastScanAt.id = "lastScanAtCard_" + this.#serviceId;
      labelLastScanAt.setAttribute("style", "margin-left: 30px;");
      labelLastScanAt.textContent = this.#lastScanAt.substring(11,19);
      title.appendChild(labelLastScanAt);

      this.#element.appendChild(title);

      //CARD BODY
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
      cardBody.setAttribute("style",
        "padding-bottom: 5px;");
      this.#element.appendChild(cardBody);

      const openedLabel = document.createElement('a');
      openedLabel.id = 'buttonCard_' + this.#serviceId;
      openedLabel.className = 'btn btn-primary';
      openedLabel.textContent = (this.#status === 'off' || this.#status === 'error') ? 'Open' : 'close';
      this.#element.appendChild(openedLabel);

      return this.#element;
    }


    async buttonStatusClicked() {
      try{
        if(this.#waitingForResponse)
          return;
        this.#waitingForResponse = true;
        let response = await this.#client.put('sensor/' + this.#serviceId, {
          newStatus: (this.#status === 'on') ? 'off' : 'on'
        });
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
          status: payload.status,
          lastScanAt: payload.lastScanAt
        })
    }
    registerRenderComponents() {
      const { BehaviorSubject } = rxjs;
      const statusObserver = new BehaviorSubject(this.#status); //initialValue
      const statusSubscription = statusObserver.subscribe(payload => {
        if(payload.status !== this.#status){
          let elementToUpdate = document.querySelector('#card_' + this.#serviceId);
          let iconToUpdate = document.querySelector('#iconCard_' + this.#serviceId);
          let buttonToUpdate = document.querySelector('#buttonCard_' + this.#serviceId);
          switch (payload.status) {
            case 'on':
              elementToUpdate.setAttribute("style", "border-radius: 25px; border: 2px solid #73AD21;");
              //iconToUpdate.className = 'bi bi-door-open';
              buttonToUpdate.textContent = 'Close'
              break;
            case 'off':
              elementToUpdate.setAttribute("style", "border-radius: 25px; border: 2px solid grey;");
              //iconToUpdate.className = 'bi bi-door-closed';
              buttonToUpdate.textContent = 'Open'
              break;
            case 'error':
              elementToUpdate.setAttribute("style", "border-radius: 25px; border: 2px solid red;");
              //iconToUpdate.className = 'bi bi-door-open';
              buttonToUpdate.textContent = 'Try to reconnect'
              break;
          }
          this.#status = payload.status
        }
        let lastScanToUpdate = document.querySelector('#lastScanAtCard_' + this.#serviceId);
        lastScanToUpdate.textContent = payload.lastScanAt.substring(11,19);
        this.#lastScanAt = payload.lastScanAt.substring(11,19);
      });
      this.#rxjsSubscriptions.push(statusSubscription)
      this.#statusObserver = statusObserver;
    }
  }

  /* Exporting component */
  win.WindowCard ||= WindowCard;

})(window);
