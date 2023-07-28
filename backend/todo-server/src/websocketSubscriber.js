import {WebSocket} from 'ws';
import memoryService from "./memoryService.js";

export function subscribeToServices(services) {
  for (const service of services) {
    const ws = new WebSocket(service.address);
    // Event: WebSocket connection opened
    ws.on('open', () => {
      console.log('Connected to the websocket server with address ' + service.serviceType);
      if (service.serviceType === memoryService.serviceTypes.WEATHER) {
        ws.send(JSON.stringify({type:'subscribe', target: 'temperature'}));
      }
      else if (service.serviceType === memoryService.serviceTypes.DOOR) {
        ws.send(JSON.stringify({type:'subscribe'}));
      }
      else if (service.serviceType === memoryService.serviceTypes.WINDOW) {
        ws.send(JSON.stringify({type:'subscribe'}));
      }
    });
    ws.on('message', (data) => {
      const message = JSON.parse(data);
      if(!memoryService.activeServices.find(el => el.id === service.id)){
        memoryService.notActiveServices = memoryService.notActiveServices.filter(el => el.id !== service.id)
        memoryService.activeServices.push(service);
      }
      if(!!message.payload){
        const payload = message.payload;
        if(service.serviceType === memoryService.serviceTypes.WEATHER){
          let activeServiceStored = memoryService.activeServices.find(el => el.id === service.id);
          activeServiceStored.lastScanAt = payload.dateTime;
          activeServiceStored.value = payload.value;
        }
        else if (service.serviceType === memoryService.serviceTypes.DOOR){
          let activeServiceStored = memoryService.activeServices.find(el => el.id === service.id);
          activeServiceStored.lastScanAt = payload.dateTime;
          activeServiceStored.status = payload.status;
        }
        else if (service.serviceType === memoryService.serviceTypes.WINDOW){
          let activeServiceStored = memoryService.activeServices.find(el => el.id === service.id);
          activeServiceStored.lastScanAt = payload.dateTime;
          activeServiceStored.status = payload.status;
        }
      }
    });
    ws.on('close', (code) => {
      console.log('connection closed for ' + service.id)
      memoryService.activeServices = memoryService.activeServices.filter(el => el.id !== service.id)
      memoryService.notActiveServices.push(service);
      //setTimeout(() => subscribeToServices([{...service}]), 5000);
    });
    ws.on('error', (error) => {
      if (error.code === 'ECONNREFUSED') {
        if(!service.tries || service.tries < 3){
          console.log('I will retry to connect in 30s...')
          setTimeout(() => subscribeToServices([{...service, tries: !!service.tries ? (service.tries + 1) : 1}]), 30000);
        }
        else
          console.log('too many tries for' + service.serviceType)
      }
    });
  }
}
