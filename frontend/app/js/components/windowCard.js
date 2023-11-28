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
    #buttonLoader;
    #buttonLoaderTimeOut;

    /**
     * Creates a new instance of `WindowCardComponent`.
     */
    constructor(client, params) {
      super();
      this.#client = client;
      this.#status = params.status;
      this.#serviceId = params.id;
      this.#lastScanAt = params.lastScanAt;
    }

    /**
     * Initializes the component.
     * @return {HTMLElement} The root element for this component.
     */
    init() {
      this.#element = document.createElement('div');
      this.#element.className = 'card';
      this.#element.id = 'card_' + this.#serviceId;

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
      circle.id = 'circle_' + this.#serviceId;
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

      const button = document.createElement('a');
      button.id = 'buttonCard_' + this.#serviceId;
      button.className = 'btn btn-primary';
      button.textContent = (this.#status === 'off' || this.#status === 'error') ? 'Open' : 'Close';
      this.#element.appendChild(button);

      let hdlr = new Handler('click', button, () => this.buttonStatusClicked());
      this.#handlers.push(hdlr);

      switch (this.#status) {
        case 'on':
          this.#element.setAttribute("style", "border-radius: 25px; border: 2px solid #73AD21;");
          button.textContent = 'Close'
          break;
        case 'off':
          this.#element.setAttribute("style", "border-radius: 25px; border: 2px solid grey;");
          button.textContent = 'Open';
          break;
        case 'error':
          this.#element.setAttribute("style", "border-radius: 25px; border: 2px solid red;");
          button.textContent = 'Try to reconnect'
          break;
      }

      return this.#element;
    }


    async buttonStatusClicked() {
      try{
        if(this.#waitingForResponse)
          return;
        this.#waitingForResponse = true;
        this.buttonLoader();
        if(this.#status == 'error'){
          let response = await this.#client.put('sensors/tryToReconnect/' + this.#serviceId);
        }
        else{
          let response = await this.#client.put('sensor/' + this.#serviceId, {
            newStatus: (this.#status === 'on') ? 'off' : 'on'
          });
        }
      }
      catch (e) {
        console.log(e)
        this.#waitingForResponse = false;
      }
    }
    buttonLoader(){
      try{
        let element = document.getElementById('buttonCard_' + this.#serviceId)
        let div = document.createElement('div');
        div.className = 'spinner-border text-primary';
        div.style['background-color'] = 'white';
        div.style['z-index'] = '30';
        element.appendChild(div);
        this.#buttonLoader = div
        this.#buttonLoaderTimeOut = setTimeout(() => {
          this.#waitingForResponse = false;
          div.remove();
        }, 30000);
      }
      catch (e) {
        console.log(e.message)
      }
    }
    update(payload) {
      if(!!payload.status)
        this.#statusObserver.next({
          status: payload.status,
          lastScanAt: payload.lastScanAt
        })
      if(this.#waitingForResponse && this.#buttonLoader){
        clearTimeout(this.#buttonLoaderTimeOut);
        this.#buttonLoader.remove()
        this.#waitingForResponse = false;
      }
      return this.#element;
    }
    registerRenderComponents() {
      const { BehaviorSubject } = rxjs;
      const statusObserver = new BehaviorSubject({status: this.#status, lastScanAt: this.#lastScanAt}); //initialValue
      const statusSubscription = statusObserver.subscribe(payload => {
        if(payload.status !== this.#status){
          let elementToUpdate = document.querySelector('#card_' + this.#serviceId);
          let iconToUpdate = document.querySelector('#iconCard_' + this.#serviceId);
          let buttonToUpdate = document.querySelector('#buttonCard_' + this.#serviceId);
          switch (payload.status) {
            case 'on':
              elementToUpdate.setAttribute("style", "border-radius: 25px; border: 2px solid #73AD21;");
              document.getElementById('circle_' + this.#serviceId).style.display = 'inline'
              buttonToUpdate.textContent = 'Close'
              break;
            case 'off':
              elementToUpdate.setAttribute("style", "border-radius: 25px; border: 2px solid grey;");
              document.getElementById('circle_' + this.#serviceId).style.display = 'inline'
              buttonToUpdate.textContent = 'Open'
              break;
            case 'error':
              elementToUpdate.setAttribute("style", "border-radius: 25px; border: 2px solid red;");
              document.getElementById('circle_' + this.#serviceId).style.display = 'none'
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
