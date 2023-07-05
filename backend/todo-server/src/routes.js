'use strict';
import jwt from 'jsonwebtoken';

/**
 * Initializes routes.
 * @param {Express} app Express application
 * @param {OIDCMiddleware} oidc OpenID Connect middleware
 * @param {{iface: string, port: number, auth: boolean, oidc: {redirect: string, clientId: string, secret: string}}} config Configuration options
 */
export function routes(app, config) {
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
          maxAge: 100000
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
        payload: 'ciao'
      })
    } catch (e) {
      console.log(e)
    }
  });


}
