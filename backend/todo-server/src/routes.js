'use strict';

function sequencer() {
    let i = 1;
    return function () {
        const n = i;
        i++;
        return n;
    }
}

class Task {
    constructor(id, description) {
        this._id = id;
        this._description = description;
        this._timestamp = new Date();
    }

    //@formatter:off
    get id() { return this._id; }
    get description() { return this._description; }
    set description(description) { this._description = description; }
    get timestamp() { return this._timestamp; }
    //@formatter:on
}

const seq = sequencer();
const tasks = [];

for (let i = 0; i < 5; i++) {
    const id = seq();
    tasks.push(new Task(id, `Spend more time hacking #${id}`));
}

function toDTO(task) {
    return {
        id: task.id,
        description: task.description,
        timestamp: task.timestamp // should be converted according to ISO8601
    };
}

function isNonBlank(str) {
    return typeof str === 'string' && str.trim();
}

function isInteger(n) {
    if (typeof n === 'number') {
        return true;
    }
    if (typeof n === 'string') {
        try {
            parseInt(n, 10);
            return true;
        } catch (_) {
            return false;
        }
    }
    return false;
}

/**
 * Initializes routes.
 * @param {Express} app Express application
 * @param {OIDCMiddleware} oidc OpenID Connect middleware
 * @param {{iface: string, port: number, auth: boolean, oidc: {redirect: string, clientId: string, secret: string}}} config Configuration options
 */
export function routes(app, config) {
    const authenticate = config.auth ? (req, res, next) => oidc.validate(req, res, next) : (_req, _res, next) => next();

    app.get('/login', (req, resp) => {
        //oidc.login(req, resp);
    });

    app.get('/tokens', (req, resp) => {
        // noinspection JSIgnoredPromiseFromCall
        //oidc.tokens(req, resp);
    });


    app.post("/user/generateToken", (req, res) => {
        // Validate User Here
        // Then generate JWT Token
      
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
            time: Date(),
            userId: 12,
        }
      
        const token = jwt.sign(data, jwtSecretKey);
      
        res.send(token);
    });

    app.get("/user/validateToken", (req, res) => {
        // Tokens are generally passed in the header of the request
        // Due to security reasons.
    
        let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
    
        try {
            const token = req.header(tokenHeaderKey);
    
            const verified = jwt.verify(token, jwtSecretKey);
            if(verified){
                return res.send("Successfully Verified");
            }else{
                // Access Denied
                return res.status(401).send(error);
            }
        } catch (error) {
            // Access Denied
            return res.status(401).send(error);
        }
    });
    
}
