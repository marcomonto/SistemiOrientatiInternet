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
    //subscription = comp.on('logged',() => console.log('asdasdasdasd'));
    let elem = await comp.init();
    components.forEach(c => c.destroy());
    await root.appendChild(elem);
    components.push(comp);
  }
  async function init() {
    let elem, /** @type {{init:()=>Promise<HTMLElement>,destroy:()=>void}} */ comp;
    /*    if (token) {
      // initializes the tasks
      comp = new TasksComponent(client);
      if (subscription) {
        subscription.unsubscribe();
      }
      subscription = null;
    } else {
      // initializes the login panel
      comp = new LoginComponent(client);
      subscription = comp.on('authenticated', init);
    }*/
    comp = new LoginComponent(client);
    subscription = comp.on('logged',() => loadHomePage());
    elem = await comp.init();
    components.forEach(c => c.destroy());
    await root.appendChild(elem);
    components.push(comp);
 /*   comp = new WindowCardCom
    comp = new DoorCardComponent(2,1);
    elem = await comp.init();
    //components.forEach(c => c.destroy());
    await root.appendChild(elem);
    components.push(comp);
    comp = new WindowCardComponent(2,1);
    elem = await comp.init();
    await root.appendChild(elem);
    components.push(comp);
    console.log(components)*/
  }

  // initializes the components
  await init();
  console.info('🏁 Application initialized');


})();
