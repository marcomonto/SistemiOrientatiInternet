import {Observable} from 'rxjs';
class MemoryService {

  connections = [];
  serviceTypes = {
    WINDOW: 'window',
    DOOR: 'door',
    HEAT_PUMP: 'heatPump',
    THERMOMETER: 'thermometer',
    WEATHER: 'weather'
  };
  messageType = {
    SERVICE: 'service',
  };
  activeServices = [];
  notActiveServices = [];
  websocketClientHandler;
  #databaseConnection = null;

  constructor() {
    this.connections = [
      {address: 'ws://127.0.0.1:8001', serviceType: this.serviceTypes.WINDOW, id: 1},
      {address: 'ws://127.0.0.1:8002', serviceType: this.serviceTypes.WEATHER, id: 2},
      {address: 'ws://127.0.0.1:8003', serviceType: this.serviceTypes.DOOR, id: 3}
    ];
  }
  addService(params){
    const {address, serviceType} = params;
    if(!this.serviceTypes[serviceType])
      return 'nope';
    this.connections.push({address: address, serviceType: serviceType})
  }
  setWebsocketHandlerToClient(handler){
    this.websocketClientHandler = handler;
  }
  sendMessageToClient(msg){
    this.websocketClientHandler._send(JSON.stringify(msg))
  }
  updateWebsocketClients(idServiceUpdated){
    let service = this.activeServices.find(el => el.id === service.id);
    this.websocketClientHandler._send(JSON.stringify({
      type: this.messageType.SERVICE,
      payload: {
        serviceType: service.serviceType,
        value: service.value, // it will be undefined if not weatherService
        lastScanAt: service.lastScanAt,
        status: service.status, // it will be undefined if it is weatherService
      }
    }))
  }
  getActiveServicesForUser(){
    let servicesFiltered = [];
    for (const service of this.activeServices){
      let serviceToShow = {};
      for (const [key, value] of Object.entries(service)) {
        if(!['address','id'].includes(key))
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

} export default new MemoryService()

