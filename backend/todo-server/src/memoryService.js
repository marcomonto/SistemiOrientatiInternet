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
  messageType = {
    SERVICE: 'service',
  };
  activeServices = [];
  notActiveServices = [];
  websocketClientHandler = [];
  #databaseConnection = null;

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

  addWebsocketHandler(handler) {
    this.websocketClientHandler.push(handler);
  }

  updateWebsocketClients(idServiceUpdated) {
    let service = this.activeServices.find(el => el.id === idServiceUpdated);
    if (!!this.websocketClientHandler && this.websocketClientHandler.length > 0) {
      this.websocketClientHandler.forEach(el => el.send(
        {
          type: this.messageType.SERVICE,
          payload: {
            serviceType: service.serviceType,
            value: service.value, // it will be undefined if not weatherService
            lastScanAt: service.lastScanAt,
            status: service.status, // it will be undefined if it is weatherService
            workingTemperature: service.workingTemperature, // it will be undefined if it isn't heatPumpService
            id: service.id
          }
        }
      ));
    }
  }

  getActiveServicesForUser() {
    let servicesFiltered = [];
    for (const service of this.activeServices) {
      let serviceToShow = {};
      for (const [key, value] of Object.entries(service)) {
        if (!['address', 'id'].includes(key))
          serviceToShow[key] = value;
      }
    }
    return servicesFiltered;
  }

  getDatabaseConnection() {
    return this.#databaseConnection;
  }

  setDatabaseConnection(value) {
    this.#databaseConnection = value;
  }

  async setServicesFromDatabase(){
    const response = await this.#databaseConnection.get('availableServices');
    this.connections = response.payload.map(el => ({
      address: el.address,
      id: el.id,
      serviceType: el.type
    }));
  }
}

export default new MemoryService()

