'use strict';

import {WebSocketHandler} from './webSocketHandler.js';
import {v4 as uuid} from 'uuid';
import memoryService from "./memoryService.js";
import axios from "axios";

/**
 * Registers a new handler for the WS channel.
 * @param ws {WebSocket} The WebSocket client
 * @param handler {WeatherHandler} The WebSocket handler
 */
function registerHandler(ws, handler) {

  const removeAllListeners = () => {
    ws.removeListener('handler', handlerCb);
    ws.removeListener('ping', pingCb);
    ws.removeListener('close', closeCb);
    ws.removeListener('error', errorCb);
  };

  function pingCb() {
    console.trace('🏐 Ping-Pong', {handler:handler.name},);
    ws.pong();
  }

  function handlerCb(msg) {
    try {
      handler.onMessage(msg);
    } catch (e) {
      console.error('💢 Unexpected error while handling inbound message', {handler:handler.name}, e);
    }
  }

  function closeCb() {
    console.info('⛔ WebSocket closed', {handler:handler.name},);
    handler.stop();
    removeAllListeners();
  }

  function errorCb(err) {
    console.error('💥 Error occurred', {handler:handler.name}, err);
    handler.stop();
    removeAllListeners();
    ws.close();
  }

  ws.on('message', handlerCb);
  ws.on('ping', pingCb);
  ws.on('close', closeCb);
  ws.on('error', errorCb);

  handler.on('error', (err) => {
    errorCb(err);
  });

  // starts the handler
  handler.start();
}

/**
 * Initializes routes.
 * @param {Express} app Express application
 * @param {WebSocketServer} wss WebSocket server
 * @param {{iface: string, port: number}} config Configuration options
 */
export function routes(app, wss, config) {

/*  wss.on('connection', ws => {
    try {
      const handler = new WebSocketHandler(ws, config, `weather:${uuid()}`);
      registerHandler(ws, handler);
    } catch (e) {
      console.error('💥 Failed to register WS handler, closing connection', e);
      ws.close();
    }
  });*/

  app.patch('/api/sensor/:id',async (req, res) => {
    try{
      let serviceToCall = memoryService.connections.find(el => el.id == req.params.id);
      const payload = req.body;
      if(!serviceToCall){
        return res.status(400).json({
          success: false,
          message: 'invalid parameters'
        });
      }
      const address = serviceToCall.address
      let responseFromService = await axios.put("http://" + address.replace("ws://", "") +'/api/status' ,{
        newStatus: payload.newStatus,
        workingTemperature: payload.workingTemperature
      });
      res.json({
        success: true
      })
    }
    catch (e) {
      res.status(500).json({
        success: false
      })
    }
  });

}
