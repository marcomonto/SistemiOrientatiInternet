class MemoryService {

  connections;
  serviceTypes = {
    WINDOW: 'window',
    DOOR: 'door',
    HEAT_PUMP: 'heatPump',
    THERMOMETER: 'thermometer',
    WEATHER: 'weather'
  };
  activeServices = [];
  notActiveServices = [];

  constructor() {
    this.connections = [
      { address: 'ws://127.0.0.1:8001', serviceType: this.serviceTypes.WINDOW, id: 1},
      { address: 'ws://127.0.0.1:8002', serviceType: this.serviceTypes.WEATHER, id: 2},
      { address: 'ws://127.0.0.1:8003', serviceType: this.serviceTypes.DOOR, id: 3}
    ];
  }

  addService(params){
    const {address, serviceType} = params;
    if(!this.serviceTypes[serviceType])
      return 'nope';
    this.connections.push({address: address, serviceType: serviceType})
  }

  gatherInfos(){

  }

} export default new MemoryService()

