
import { WebSocket } from 'ws';
import memoryService from './memoryService';

export function subscribeToServices(services) {
  for (const service of services) {

    const ws = new WebSocket(service.address);

    // Event: WebSocket connection opened
    ws.on('open', () => {
      console.log('Connected to the websocket server with address' + service.serviceType);
      if(service.serviceType == memoryService.typeService.WEATHER){
        
      }
        
    });

    ws.on('message', (data) => {
      const message = JSON.parse(data);
      console.log('Received message:', message);
      // Handle the received message as needed
    });

    ws.on('close', () => {
      console.log('Disconnected from the websocket server.');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }
}

  /**
   * Sends any message through the WebSocket channel.
   * @param msg Any message
   * @private
   */
  function _send(msg) {
    if (this.#config.failures && Math.random() < this.#config.errorProb) {
      console.info('🐛 There\'s a bug preventing the message to be sent', {handler: this.#name});
      return;
    }

    console.debug('💬 Dispatching message', {handler: this.#name});
    this.#ws.send(JSON.stringify(msg));
  }
