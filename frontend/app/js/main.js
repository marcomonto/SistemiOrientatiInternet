'use strict';

(async function () {
  const client = new RestClient('/api');
  const root = document.querySelector('.content #root');
  /** @type {{init:()=>Promise<HTMLElement>,destroy:()=>void}[]} */
  let components = [];
  /** @type {{unsubscribe:() => void}|null} */
  let subscription = null;

  async function loadHomePage(tokenWs) {
    console.log(tokenWs)
    if (subscription) {
      subscription.unsubscribe();
    }
    subscription = null;
    let sidebar = document.createElement('div');
    if(!document.querySelector('#root #sidebarAppView')){
      sidebar.innerHTML = document.querySelector('script#appSideBar').textContent;
      await root.appendChild(sidebar);
    }
    let comp = new HomePageView(client,tokenWs);
    let elem = await comp.init();
    const mainView = document.querySelector('#mainAppView');
    components.forEach(c => c.destroy());
    components = [];
    await mainView.appendChild(elem);
    document.getElementById('historicalDataBtn').addEventListener('click',
      () => loadHistoricalData(), {once: true}
    );
    components.push(comp);
  }

  async function loadHistoricalData() {
    console.log(components)
    if (subscription) {
      subscription.unsubscribe();
    }
    subscription = null;
    let sidebar = document.createElement('div');
    if(!document.querySelector('#root #sidebarAppView')){
      sidebar.innerHTML = document.querySelector('script#appSideBar').textContent;
      await root.appendChild(sidebar);
    }
    let comp = new HistoricalDataView(client);
    let elem = await comp.init();
    const mainView = document.querySelector('#mainAppView');
    components.forEach(c => c.destroy());
    components = [];
    await mainView.appendChild(elem);
    document.getElementById('dashboardBtn').addEventListener('click',
      () => loadHomePage(), {once: true}
    );
    components.push(comp);
  }

  async function init() {
    let elem, /** @type {{init:()=>Promise<HTMLElement>,destroy:()=>void}} */ comp;
    try {
      let response = await client.get('wsAuthToken', {})
      if (!!response)
        await loadHomePage(response.payload);
    } catch (e) {
      console.log(e.message)
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
