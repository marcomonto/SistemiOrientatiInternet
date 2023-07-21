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
  activeServices = [];
  notActiveServices = [];
  websocketClientHandler;

  constructor() {
    this.connections = [
      { address: 'ws://127.0.0.1:8001', serviceType: this.serviceTypes.WINDOW, id: 1},
      { address: 'ws://127.0.0.1:8002', serviceType: this.serviceTypes.WEATHER, id: 2},
      { address: 'ws://127.0.0.1:8003', serviceType: this.serviceTypes.DOOR, id: 3}
    ];
    const { Subject } = require('rxjs');

    const arraySubject = new Subject();

    const myArray = [1, 2, 3];

    function handleArrayChanges(newArray) {
      console.log('Array changed:', newArray);
    }

    const arraySubscription = arraySubject.subscribe(handleArrayChanges);

    function updateArray(newValue) {
      myArray.push(newValue);
      arraySubject.next(myArray);
    }

    updateArray(4);
    updateArray(5);

    arraySubscription.unsubscribe();
  }

  addService(params){
    const {address, serviceType} = params;
    if(!this.serviceTypes[serviceType])
      return 'nope';
    this.connections.push({address: address, serviceType: serviceType})
  }

  gatherInfos(){

  }

  setWebsocketHandlerToClient(handler){
    this.websocketClientHandler = handler;
  }

} export default new MemoryService()

