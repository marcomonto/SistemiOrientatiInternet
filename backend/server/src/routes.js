'use strict';
import jwt from 'jsonwebtoken';
import {WebsocketHandler} from "./websocketHandler.js";
import memoryService from "./memoryService.js";
import validator from "validator";
import axios from "axios";
import {subscribeToServices} from "./websocketSubscriberToServices.js";
import {token} from "morgan";

/**
 * Initializes routes.
 * @param {Express} app Express application
 * @param {WebSocketServer} wss WebSocket server
 * @param {{iface: string, port: number, auth: boolean, oidc: {redirect: string, clientId: string, secret: string}}} config Configuration options
 */
export function routes(app, wss, config) {
  const authenticated = (req, res, next) => req.cookies?.tokenLookout ?
    (jwt.verify(req.cookies.tokenLookout, config.jwtSecretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({message: 'Failed to authenticate token'});
      }
      // Token is valid, decoded contains the user information
      req.user = decoded;
      next();
    })) : res.sendStatus(401);

  app.post('/api/login', (req, res) => {
    try {
      const {username, password} = req.body;
      if (!username || !password)
        return res.status(401).json({
          success: false,
          message: 'user or password not provided'
        })
      if (!validator.isAlpha(username))
        return res.status(400).json({
          success: false,
          message: 'invalid parameters'
        });
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
          })
      } else
        res.status(403).json({
          success: false,
          message: 'CREDENTIALS_NOT_CORRECT'
        })
    } catch (e) {
      console.log(e.message)
      return res.status(500).json({
        success: false,
      })
    }
  });

  app.get('/api/home', authenticated, (req, res) => {
    try {
      return res.json({
        success: true,
      })
    } catch (e) {
      console.log(e.message)
      return res.status(500).json({
        success: false,
      })
    }
  });

  app.get('/api/user/details', authenticated, (req, res) => {
    try {
      return res.json({
        success: true
      })
    } catch (e) {
      console.log(e)
      return res.status(500).json({
        success: false,
      })
    }
  });

  app.get('/api/sensors', (req, res) => {
    try {
      return res.json({
        success: true,
        payload: memoryService.activeServices
      })
    } catch (e) {
      console.log(e)
    }
  });

  app.put('/api/sensors/tryToReconnect/:id', authenticated, (req, res) => {
    try {
      if (!validator.isAlphanumeric(req.params.id)
        || !memoryService.activeServices.find(el => el.id == req.params.id)
        || memoryService.activeServices.find(el => el.id == req.params.id).status != 'error')
        return res.status(400).json({
          success: false,
          message: 'invalid parameters'
        });
      let serviceToRestore = memoryService.activeServices.find(el => el.id === req.params.id);
      subscribeToServices([{
        ...serviceToRestore
      }]);
      return res.json({
        success: true,
      });
    } catch (e) {
      console.log(e)
      return res.status(500).json({
        success: false,
      })
    }
  });

  app.get('/api/healthCheck', authenticated, async (req, res) => {
    //TODO call every active service to check if some children are lost
    res.status(200).json({
      success: true,
      payload: memoryService.activeServices.filter(el => el.status === 'error')
    })
  });

  app.get('/api/wsAuthToken', authenticated, (req, res) => {
    try {
      const token = jwt.sign({
        tokenForAuth: true,
        createdAt: new Date().toISOString(),
        user: req.user
      }, config.jwtSecretKey);
      res.status(200).json({
        success: true,
        payload: token
      })
    } catch (e) {
      console.log(e.message)
      res.status(500).json({
        success: false
      })
    }
  });

  app.get('/api/history', authenticated, async (req, res) => {
    try {
      let params = req.query;
      console.log(params.filters)
      let responseFromDB = await memoryService.getDatabaseConnection()
        .get(params.type === 'weather' ? 'weatherTemperatures' : 'homeTemperatures',
          {
            page: params.page,
            rowsPerPage: params.rowsPerPage,
            filters: params.filters
          });
      res.status(200).json(responseFromDB);
    } catch (e) {
      console.log(e.message)
      res.status(500).json({
        success: false
      })
    }
  });

  app.put('/api/sensor/:id', authenticated, async (req, res) => {
    try {
      const payload = req.body;
      if (!validator.isAlphanumeric(req.params.id) ||
        (!!payload.newStatus && !['on', 'off', 'error'].includes(payload.newStatus)) ||
        (!!payload.workingTemperature && !['30', '35', '40', '45', '50'].includes(payload.workingTemperature))
      )
        return res.status(400).json({
          success: false,
          message: 'invalid parameters'
        });
      let responseFromService = await axios.patch(
        process.env.ACTUATOR_ADDRESS + '/api/sensor/' + req.params.id, {
          newStatus: payload.newStatus,
          workingTemperature: payload.workingTemperature
        });
      return res.json({
        success: true,
        message: 'COMMAND_SENT'
      })
    } catch (e) {
      console.log(e.message)
      res.status(500).json({
        success: false
      })
    }
  });

  app.post('/api/sensor', authenticated, async (req, res) => {
    try {
      // docker run -p 9001:9001 --network app-network --ip 10.88.0.11 window-service
      const payload = req.body;
      if (!payload.type || !payload.address || !['window', 'door'].includes(payload.type)) {
        return res.status(400).json({
          success: false,
          message: 'invalid parameters'
        });
      }
      let databaseConnection = memoryService.getDatabaseConnection();
      let databaseResponse = await databaseConnection.store('availableServices', {
        address: payload.address,
        type: payload.type
      });
      if (databaseResponse.success) {
        let serviceToAdd = {
          id: databaseResponse.payload.id,
          address: payload.address,
          serviceType: payload.type,
          status: 'error'
        }
        await axios.get(process.env.ACTUATOR_ADDRESS + '/api/refreshListServices');
        memoryService.activeServices.push(serviceToAdd);
        subscribeToServices([serviceToAdd]);
      } else throw new Error('CANT_CONNECT_TO_DATABASE');

      return res.json({
        success: true
      })
    } catch (e) {
      console.log(e.message)
      res.json({
        success: false
      })
    }
  });

  wss.on('connection', (ws, req) => {
    try {
      const cookiesToParse = req.headers.cookie
      const startIndex = cookiesToParse.indexOf('tokenLookout=') + 'tokenLookout='.length;
      const endIndex = cookiesToParse.indexOf(';', startIndex);
      const tokenLookout = cookiesToParse.substring(startIndex, endIndex);
      console.log(tokenLookout)
      jwt.verify(tokenLookout, config.jwtSecretKey);
      const handler = new WebsocketHandler(ws, config, 'client');
      memoryService.addWebsocketHandler(handler);
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
    console.trace('🏐 Ping-Pong', {handler: handler.name},);
    ws.pong();
  }

  function handlerCb(msg) {
    try {
      handler.onMessage(msg);
    } catch (e) {
      console.error('💢 Unexpected error while handling inbound message', {handler: handler.name}, e);
    }
  }

  function closeCb() {
    console.info('⛔ WebSocket closed', {handler: handler.name},);
    handler.stop();
    removeAllListeners();
  }

  function errorCb(err) {
    console.error('💥 Error occurred', {handler: handler.name}, err);
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
