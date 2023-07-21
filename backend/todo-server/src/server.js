'use strict';

import util from 'util';

// utilities
import { v4 as uuid } from 'uuid';

// express
import express from 'express';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import compression from 'compression';
import {WebSocketServer} from 'ws';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// own modules
import opts from './options.js';
import { routes } from './routes.js';
import { subscribeToServices } from './websocketSubscriber.js'
import memoryService from './memoryService.js';

/**
 * Initializes the application middlewares.
 *
 * @param {Express} app Express application
 */
function init(app) {
    app.use(compression());
    app.use(methodOverride());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(cors({
        origin: 'http://localhost:8080',
        credentials: true
    }));
/*    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });*/
    // sets the correlation id of any incoming requests
    app.use((req, res, next) => {
        req.correlationId = req.get('X-Request-ID') || uuid();
        res.set('X-Request-ID', req.id);
        next();
    });
}

/**
 * Installs fallback error handlers.
 *
 * @param app Express application
 * @returns {void}
 */
function fallbacks(app) {
    // generic error handler => err.status || 500 + json
    // NOTE keep the `next` parameter even if unused, this is mandatory for Expres
    app.use((err, req, res, next) => {
        const errmsg = err.message || util.inspect(err);
        console.error(`💥 Unexpected error occurred while calling ${req.path}: ${errmsg}`);
        res.status(err.status || 500);
        res.json({ error: err.message || 'Internal server error' });
    });

    // if we are here, then there's no valid route => 400 + json
    // NOTE keep the `next` parameter even if unused, this is mandatory for Express 4
    app.use((req, res, next) => {
        console.error(`💥 Route not found to ${req.path}`);
        res.status(404);
        res.json({ error: 'Not found' });
    });
}

async function run() {
    // creates the configuration options and the logger
    const options = opts();
   /* const oidc = new OIDCMiddleware(options.config.oidc);
    await oidc.init();*/

    const app = express();
    init(app);

    const { iface, port } = options.config;
    const server = app.listen(port, iface, () => {
        // noinspection HttpUrlsUsage
        console.info(`🏁 Server listening: http://${iface}:${port}`);
    });

    //`🔧 Initializing WSS...
    const wss = initWss(server, options.config);

    //`🔧 Initializing routes...`);
    routes(app, wss, options.config);
    fallbacks(app);

    subscribeToServices(memoryService.connections)
}

/**
 * Initializes the WebSocket server.
 * @param {Server} server HTTP server
 * @param {{iface: string, port: number}} config Configuration options
 * @return {WebSocketServer} A WebSocket server
 */
function initWss(server, config) {
    // configuration taken from: https://www.npmjs.com/package/ws#websocket-compression
    const perMessageDeflate = {
        zlibDeflateOptions: {
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        clientNoContextTakeover: true, // Defaults to negotiated value
        serverNoContextTakeover: true, // Defaults to negotiated value
        serverMaxWindowBits: 10, // Defaults to negotiated value
        concurrencyLimit: 10, // Limits zlib concurrency for perf
        threshold: 1024 // Size (in bytes) below which messages should not be compressed if context takeover is disabled
    };

    const verifyClient = function(info) {
        //console.log(info.req)
        return true;
    };

    const opts = {server, perMessageDeflate, verifyClient};
    return new WebSocketServer(opts);
}

// noinspection JSIgnoredPromiseFromCall
run();
