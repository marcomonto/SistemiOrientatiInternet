'use strict';

import {DateTime} from 'luxon';
import {EventEmitter} from 'events';
import memoryService from "./memoryService.js";

class ValidationError extends Error {
  #message;

  constructor(msg) {
    super(msg);
    this.#message = msg;
  }

  get message() {
    return this.#message;
  }
}

/**
 * A WebSocket handler to deal with weather subscriptions.
 */
export class WebSocketHandler extends EventEmitter {
  #ws;
  #config;
  #name;
  #timeout;
  #buffer;
  #death;


  /**
   * Instances a new weather handler.
   * @param ws {WebSocket} The WebSocket client
   * @param config {{iface:string,port:number,failures:boolean,delays:boolean,frequency:number,timeToLive:number}} Configuration
   * @param name {string} A name for this handler
   */
  constructor(ws, config, name) {
    super();
    this.#ws = ws;
    this.#config = config;
    this.#name = name;
    this.#buffer = [];
  }

  get name() {
    return this.#name;
  }

  /**
   * Handles incoming messages.
   * @param msg {string} An incoming JSON message
   */
  onMessage(msg) {
    let json;
    try {
      json = this._validateMessage(msg);
    } catch (e) {
      this._send({error: e.message});
      return;
    }
    switch (json.type) {
      case 'subscribe': this._onSubscribe(); break;
      case 'unsubscribe': this._onUnsubscribe(); break;
    }
  }

  stop() {
    if (this.#timeout) {
      clearTimeout(this.#timeout);
    }
    if (this.#death) {
      clearTimeout(this.#death);
    }
  }

  start() {
    console.debug('New connection received', {handler: this.#name});

    // simulate a client disconnection
    if (this.#config.failures && this.#config.timeToLive > 0) {
      this._scheduleDeath();
    }
  }

  _scheduleDeath() {
    const secs = (Math.random() * this.#config.timeToLive + 5).toFixed(0);
    console.info(`💣 Be ready for the fireworks in ${secs} seconds...`, {handler: this.#name});
    this.#death = setTimeout(() => {
      console.error('✝ Farewell and goodnight', {handler: this.#name});
      this.#ws.close();
      this.stop();
      this.emit('error', 'Simulated death', {handler: this.#name});
    }, secs * 1000);
  }

  /**
   * Validates an incoming message.
   * @param msg {string} Any message string that can be parsed as JSON
   * @return {any} An object representing the incoming message
   * @private
   */
  _validateMessage(msg) {
    if (!msg) {
      throw new ValidationError('Invalid inbound message');
    }
    const json = JSON.parse(msg);
    if (json.method || json.get) {
      throw new ValidationError('Invalid message type');
    }
    return json;
  }

  _sendData() {
    const msg = {
      type: 'door', payload: {
        lastScanAt: (new Date()).toISOString(),
        status: memoryService.getStatus(),
        workingTemperature: memoryService.getWorkingTemperature()
      }
    };
    // message is always appended to the buffer
    this.#buffer.push(msg);

    // messages are dispatched immediately if delays are disabled or a random number is
    // generated greater than `delayProb` messages
    if (!this.#config.delays || Math.random() > this.#config.delayProb) {
      for (const bMsg of this.#buffer) {
        this._send(bMsg);
      }
      this.#buffer = [];
    } else {
      console.info(`💤 Due to network delays, ${this.#buffer.length} messages are still queued`, {handler: this.#name});
    }
  }

  _send(msg) {
    if (this.#config.failures && Math.random() < this.#config.errorProb) {
      console.info('🐛 There\'s a bug preventing the message to be sent', {handler: this.#name});
      return;
    }

    console.debug('💬 Dispatching message', {handler: this.#name});
    this.#ws.send(JSON.stringify(msg));
  }

  _onSubscribe() {
    if (this.#timeout) {
      return;
    }

    const callback = () => {
      this._sendData();
      this.#timeout = setTimeout(callback, 5000);
    };
    this.#timeout = setTimeout(callback, 0);
  }

  _onUnsubscribe() {
    if (!this.#timeout) {
      return;
    }
    clearTimeout(this.#timeout);
    this.#timeout = 0;
    this._send({ack: true});
  }
}
