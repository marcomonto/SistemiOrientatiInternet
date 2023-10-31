import {WebSocket} from 'ws';
import memoryService from "./memoryService.js";

export function subscribeToServices(services) {
  for (const service of services) {
    const ws = new WebSocket(service.address);
    // Event: WebSocket connection opened
    ws.on('open', () => {
      console.log('Connected to the websocket server with address ' + service.serviceType);
      if (!memoryService.activeServices.find(el => el.id === service.id)) {
        memoryService.activeServices.push(service);
      }
      if (service.serviceType === memoryService.serviceTypes.WEATHER) {
        ws.send(JSON.stringify({type: 'subscribe', target: 'temperature'}));
      } else if (service.serviceType === memoryService.serviceTypes.DOOR) {
        ws.send(JSON.stringify({type: 'subscribe'}));
      } else if (service.serviceType === memoryService.serviceTypes.WINDOW) {
        ws.send(JSON.stringify({type: 'subscribe'}));
      } else if (service.serviceType === memoryService.serviceTypes.HEAT_PUMP) {
        ws.send(JSON.stringify({type: 'subscribe'}));
      } else if (service.serviceType === memoryService.serviceTypes.THERMOMETER) {
        ws.send(JSON.stringify({type: 'subscribe'}));
      }
    });
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        if (!!message.payload) {
          const payload = message.payload;
          let activeServiceStored = memoryService.activeServices.find(el => el.id === service.id);
          if (service.serviceType === memoryService.serviceTypes.WEATHER) {
            activeServiceStored.lastScanAt = payload.dateTime;
            activeServiceStored.value = payload.value;
            memoryService.getDatabaseConnection().store('weatherTemperatures', {value: Number(payload.value)});
            memoryService.updateWebsocketClients(service.id)
          } else if (service.serviceType === memoryService.serviceTypes.DOOR) {
            activeServiceStored.lastScanAt = payload.lastScanAt;
            activeServiceStored.status = payload.status;
            memoryService.updateWebsocketClients(service.id);
          } else if (service.serviceType === memoryService.serviceTypes.WINDOW) {
            activeServiceStored.lastScanAt = payload.lastScanAt;
            activeServiceStored.status = payload.status;
            memoryService.updateWebsocketClients(service.id);
          } else if (service.serviceType === memoryService.serviceTypes.HEAT_PUMP) {
            activeServiceStored.lastScanAt = payload.lastScanAt;
            activeServiceStored.status = payload.status;
            activeServiceStored.workingTemperature = payload.workingTemperature;
            memoryService.updateWebsocketClients(service.id);
          } else if (service.serviceType === memoryService.serviceTypes.THERMOMETER) {
            activeServiceStored.lastScanAt = payload.lastScanAt;
            activeServiceStored.value = payload.value;
            memoryService.getDatabaseConnection().store('homeTemperatures', {value: Number(payload.value)});
            memoryService.updateWebsocketClients(service.id);
          }
        }
      } catch (e) {
        console.log(e)
      }
    });
    ws.on('close', (code) => {
        let activeServiceStored = memoryService.activeServices.find(el => el.id === service.id);
        activeServiceStored.status = 'error';
        if (service.serviceType === memoryService.serviceTypes.DOOR
          || service.serviceType === memoryService.serviceTypes.WINDOW
          || service.serviceType === memoryService.serviceTypes.HEAT_PUMP
        )
          memoryService.updateWebsocketClients(service.id);
/*      setTimeout(() => subscribeToServices([{
        ...service,
        tries: !!service.tries ? (service.tries + 1) : 1
      }]), 30000);*/
    });
    ws.on('error', (error) => {
      console.log(error, error.code)
      let activeServiceStored = memoryService.activeServices.find(el => el.id === service.id);
      activeServiceStored.status = 'error';
      if (service.serviceType === memoryService.serviceTypes.DOOR
        || service.serviceType === memoryService.serviceTypes.WINDOW
        || service.serviceType === memoryService.serviceTypes.HEAT_PUMP
      )
        memoryService.updateWebsocketClients(service.id);
/*      if (error.code === 'ECONNREFUSED') {
        if (!service.tries || service.tries < 3) {
          setTimeout(() => subscribeToServices([{
            ...service,
            tries: !!service.tries ? (service.tries + 1) : 1
          }]), 30000);
        } else{
          console.log('too many tries for' + service.serviceType)
          memoryService.notActiveServices.push(service);
          ws.close();
        }
      }*/
    });
  }
}
