`use strict`;

(function (win) {

  /**
   * A login component.
   */
  class LoginComponent extends EventEmitter {
    /** @type {HTMLElement} */
    #element;
    /** @type {RestClient} */
    #client;
    /** @type {Handler[]} */
    #handlers = [];

    /**
     * Instances a new `LoginComponent`.
     * @param client {RestClient} The REST client
     */
    constructor(client) {
      super();
      this.#client = client;
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
     * @return {Promise<HTMLElement>} The root element for this component.
     */
    async init() {
      this.#element = document.createElement('div');
      this.#element.innerHTML = document.querySelector('script#login-template').textContent;

      const btn = this.#element.querySelector('button');
      const hdlr = new Handler('click', btn, () => this.login());
      this.#handlers.push(hdlr);

      return this.#element;
    }

    async login() {
      try{
        const usernameInput = document.querySelector('#userLogin');
        const passwordInput = document.querySelector('#passwordLogin');
        const username = usernameInput.value;
        const password = passwordInput.value;
        let response = await this.#client.post('login',{
          username: username,
          password: password
        })
        if(!!response.success)
          this.emit('logged')
      }
      catch (err) {
       if(err.status === 403)
         this.showAlert('Credentials are not correct', 'warning');
       else
        this.showAlert('Server Error', 'danger');
      }
    }

    showAlert(message, criticality) {
      let alertContainer = document.querySelector('.alert-container');
      let alertElement = document.createElement('div');
      alertElement.classList.add('alert', criticality === 'danger' ? 'alert-danger' : 'alert-warning', 'show');
      alertElement.textContent = message;
      alertContainer.appendChild(alertElement);

      setTimeout(function() {
        alertContainer.removeChild(alertElement);
      }, 5000);
    }
  }

  /* Exporting component */
  win.LoginComponent ||= LoginComponent;

})(window);
