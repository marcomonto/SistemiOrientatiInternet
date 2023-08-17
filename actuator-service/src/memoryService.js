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
    this.connections = [
      {address: 'ws://127.0.0.1:8001', serviceType: this.serviceTypes.WINDOW, id: 1},
      {address: 'ws://127.0.0.1:8002', serviceType: this.serviceTypes.WEATHER, id: 2},
      {address: 'ws://127.0.0.1:8003', serviceType: this.serviceTypes.DOOR, id: 3},
      {address: 'ws://127.0.0.1:8004', serviceType: this.serviceTypes.HEAT_PUMP, id: 4},
      {address: 'ws://127.0.0.1:8005', serviceType: this.serviceTypes.THERMOMETER, id: 5},
      {address: 'ws://127.0.0.1:8006', serviceType: this.serviceTypes.ACTUATOR, id: 6},
    ];
  }


} export default new MemoryService()

