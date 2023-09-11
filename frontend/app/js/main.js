'use strict';

(async function () {
  const client = new RestClient('/api');
  const root = document.querySelector('.content #root');
  /** @type {{init:()=>Promise<HTMLElement>,destroy:()=>void}[]} */
  const components = [];
  /** @type {{unsubscribe:() => void}|null} */
  let subscription = null;

  async function loadHomePage() {
    if (subscription) {
      subscription.unsubscribe();
    }
    subscription = null;
    let comp = new HomePageComponent(client);
    let elem = await comp.init();
    components.forEach(c => c.destroy());
    await root.appendChild(elem);
    components.push(comp);
  }

  async function init() {
    let elem, /** @type {{init:()=>Promise<HTMLElement>,destroy:()=>void}} */ comp;
    try {
      let response = await client.get('user/details', {})
      if (!!response)
        await loadHomePage();
    } catch (e) {
      if (e.status === 401) {
        comp = new LoginComponent(client);
        subscription = comp.on('logged', () => loadHomePage());
        elem = await comp.init();
        components.forEach(c => c.destroy());
        await root.appendChild(elem);
        components.push(comp);
      }
    }
  }

  await init();
  console.info('🏁 Application initialized');


})();
