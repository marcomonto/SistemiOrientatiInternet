
async function loadHomePage() {
  comp = new LoginComponent(client);ì
  elem = await comp.init();
  //components.forEach(c => c.destroy());
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
