'use strict';
import jwt from 'jsonwebtoken';
import {WebsocketHandler} from "./websocketHandler.js";
import memoryService from "./memoryService.js";
import {auth} from "google-auth-library";
import axios from "axios";

/**
 * Initializes routes.
 * @param {Express} app Express application
 * @param {WebSocketServer} wss WebSocket server
 * @param {{iface: string, port: number, auth: boolean, oidc: {redirect: string, clientId: string, secret: string}}} config Configuration options
 */
export function routes(app,wss,  config) {
  const authenticated = (req, res, next) => req.cookies?.tokenLookout ?
    (jwt.verify(req.cookies.tokenLookout , config.jwtSecretKey) ? next() : res.sendStatus(401)) :
    res.sendStatus(401);

  app.post('/api/login', (req, res) => {
    const {username, password} = req.body;
    if (!username || !password)
      return res.status(403).json({
        success: false,
        message: 'user or password not provided'
      })
    if (username === 'marcomonto' && password === 'password') {
      let jwtSecretKey = process.env.JWT_SECRET_KEY;
      let data = {
        time: Date(),
        user: username,
      }
      const token = jwt.sign(data, jwtSecretKey);
      return res
        .cookie("tokenLookout", token, {
          httpOnly: true,
          //secure: true,
          maxAge: 365 * 24 * 60 * 60 * 1000
        }).json({
          success: true,
          payload: 'ciao'
        })
    } else
      res.status(403).json({
        success: false,
        message: 'CREDENTIALS_NOT_CORRECT'
      })
  });

  app.get('/api/home', authenticated, (req, res) => {
    try {
      return res.json({
        success: true,
      })
    } catch (e) {
      console.log(e)
    }
  });

  app.get('/api/user/details', authenticated, (req, res) => {
    try {
      return res.json({
        success: true
      })
    } catch (e) {
      console.log(e)
    }
  });

  app.get('/api/sensors' ,(req, res) => {
    try {
      return res.json({
        success: true,
        payload: memoryService.activeServices
      })
    } catch (e) {
      console.log(e)
    }
  });

  app.put('/api/sensor/:id', authenticated, async (req, res) => {
    try{
      const payload = req.body;
      let responseFromService = axios.post(
        process.env.ACTUATOR_ADDRESS + '/api/sensor/' + req.params.id,{
        newStatus: payload.newStatus
      });
      return res.json({
        success: true,
        message: 'COMMAND_SENT'
      })
    }
    catch (e) {
      console.log(e.message)
      res.json({
        success: false
      })
    }
  });

  wss.on('connection', (ws, req) => {
    try {
      const handler = new WebsocketHandler(ws, config, 'client');
      memoryService.setWebsocketHandlerToClient(handler);
      registerHandler(ws, handler);
    } catch (e) {
      console.error('💥 Failed to register WS handler, closing connection', e);
      ws.close();
    }
  });
}

/**
 * Registers a new handler for the WS channel.
 * @param ws {WebSocket} The WebSocket client
 * @param handler {WebsocketHandler} The WebSocket handler
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
  // piu client allo stesso websocket che poi dovrà con rxjs tornare i cambiamenti =>
  // implementazione frontend => implementazione heat Pump => logica temperatura =>
  // grafici? gestione caduta servizi?
  // starts the handler
  handler.start();
}
