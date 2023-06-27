class MemoryService {

  connections;
  serviceTypes = {
    WINDOW: 'window',
    DOOR: 'door',
    HEAT_PUMP: 'heatPump',
    THERMOMETER: 'thermometer',
    WEATHER: 'weather'
  };
  activeServices= [];

  constructor() {
    this.connections = [
      { address: 'ws://127.0.0.1:8001', serviceType: this.serviceTypes.WINDOW},
      { address: 'ws://127.0.0.1:8002', serviceType: this.serviceTypes.WEATHER},
      { address: 'ws://127.0.0.1:8003', serviceType: this.serviceTypes.DOOR}
    ];
  }

  addService(params){
    const {address, serviceType} = params;
    if(!this.serviceTypes[serviceType])
      return 'nope';
    this.connections.push({address: address, serviceType: serviceType})
  }

} export default new MemoryService()
