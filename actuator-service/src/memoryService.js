import PocketBase from 'pocketbase';

class MemoryService {

  connections = [];

  serviceTypes = {
    WINDOW: 'window',
    DOOR: 'door',
    HEAT_PUMP: 'heatPump',
    THERMOMETER: 'thermometer',
    WEATHER: 'weather',
    ACTUATOR: 'actuator',
  };

  constructor() {
    this.fetchConnections();
  }

  async fetchConnections(){
    try{
      if(process.env.IS_DOCKER_INSTANCE){
        globalThis.fetch = fetch
        const pb = new PocketBase(process.env.POCKETBASE_ADDRESS);
        await pb.admins.authWithPassword('prova@mail.com', 'provaprova');
        this.connections = await pb.collection('availableServices').getFullList();
      }
      else{
        this.connections = [
          {address: 'ws://127.0.0.1:8001', serviceType: this.serviceTypes.WINDOW, id: 1},
          {address: 'ws://127.0.0.1:8002', serviceType: this.serviceTypes.WEATHER, id: 2},
          {address: 'ws://127.0.0.1:8003', serviceType: this.serviceTypes.DOOR, id: 3},
          {address: 'ws://127.0.0.1:8004', serviceType: this.serviceTypes.HEAT_PUMP, id: 4},
          {address: 'ws://127.0.0.1:8005', serviceType: this.serviceTypes.THERMOMETER, id: 5},
          {address: 'ws://127.0.0.1:8006', serviceType: this.serviceTypes.ACTUATOR, id: 6},
        ];
      }
    }
    catch (e) {
      console.log(e.message);
      this.connections = [];
    }
  }

}

export default new MemoryService()
