'use strict';

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
export class WindowHandler extends EventEmitter {
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

    // @formatter:off
    switch (json.type) {
      case 'subscribe':
        this._onSubscribe();
        break;
      case 'unsubscribe':
        this._onUnsubscribe();
        break;
    }
    // @formatter:on
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

    if (this.#config.failures && this.#config.timeToLive > 0) {
      //this._scheduleDeath();
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

  /**
   * Generates a random delay in milliseconds.
   * @return {number} Milliseconds
   * @private
   */

  /*
  _someMillis() {
    return anIntegerWithPrecision(this.#config.frequency, 0.2);
  }
*/

  /**
   * Sends the temperature message.
   * @private
   */
  _sendData() {
    const msg = {
      type: 'door', payload: {
        dateTime: (new Date()).toISOString(),
        status: memoryService.getStatus()
      }
    };
    this.#buffer.push(msg);

    if (!this.#config.delays || Math.random() > this.#config.delayProb) {
      for (const bMsg of this.#buffer) {
        this._send(bMsg);
      }
      this.#buffer = [];
    } else {
      console.info(`💤 Due to network delays, ${this.#buffer.length} messages are still queued`, {handler: this.#name});
    }
  }

  /**
   * Sends any message through the WebSocket channel.
   * @param msg Any message
   * @private
   */
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

    console.debug('🌡  Subscribing to temperature', {handler: this.#name});
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
    var extendStatics = function (e, t) {
      return extendStatics = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
        e.__proto__ = t
      } || function (e, t) {
        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
      }, extendStatics(e, t)
    };

    function __extends(e, t) {
      if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

      function __() {
        this.constructor = e
      }

      extendStatics(e, t), e.prototype = null === t ? Object.create(t) : (__.prototype = t.prototype, new __)
    }

    var __assign = function () {
      return __assign = Object.assign || function __assign(e) {
        for (var t, n = 1, i = arguments.length; n < i; n++) for (var o in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
        return e
      }, __assign.apply(this, arguments)
    };

    function __awaiter(e, t, n, i) {
      return new (n || (n = Promise))((function (o, r) {
        function fulfilled(e) {
          try {
            step(i.next(e))
          } catch (e) {
            r(e)
          }
        }

        function rejected(e) {
          try {
            step(i.throw(e))
          } catch (e) {
            r(e)
          }
        }

        function step(e) {
          e.done ? o(e.value) : function adopt(e) {
            return e instanceof n ? e : new n((function (t) {
              t(e)
            }))
          }(e.value).then(fulfilled, rejected)
        }

        step((i = i.apply(e, t || [])).next())
      }))
    }

    function __generator(e, t) {
      var n, i, o, r, s = {
        label: 0, sent: function () {
          if (1 & o[0]) throw o[1];
          return o[1]
        }, trys: [], ops: []
      };
      return r = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" == typeof Symbol && (r[Symbol.iterator] = function () {
        return this
      }), r;

      function verb(a) {
        return function (c) {
          return function step(a) {
            if (n) throw new TypeError("Generator is already executing.");
            for (; r && (r = 0, a[0] && (s = 0)), s;) try {
              if (n = 1, i && (o = 2 & a[0] ? i.return : a[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, a[1])).done) return o;
              switch (i = 0, o && (a = [2 & a[0], o.value]), a[0]) {
                case 0:
                case 1:
                  o = a;
                  break;
                case 4:
                  return s.label++, {value: a[1], done: !1};
                case 5:
                  s.label++, i = a[1], a = [0];
                  continue;
                case 7:
                  a = s.ops.pop(), s.trys.pop();
                  continue;
                default:
                  if (!(o = s.trys, (o = o.length > 0 && o[o.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                    s = 0;
                    continue
                  }
                  if (3 === a[0] && (!o || a[1] > o[0] && a[1] < o[3])) {
                    s.label = a[1];
                    break
                  }
                  if (6 === a[0] && s.label < o[1]) {
                    s.label = o[1], o = a;
                    break
                  }
                  if (o && s.label < o[2]) {
                    s.label = o[2], s.ops.push(a);
                    break
                  }
                  o[2] && s.ops.pop(), s.trys.pop();
                  continue
              }
              a = t.call(e, s)
            } catch (e) {
              a = [6, e], i = 0
            } finally {
              n = o = 0
            }
            if (5 & a[0]) throw a[1];
            return {value: a[0] ? a[1] : void 0, done: !0}
          }([a, c])
        }
      }
    }

    var e, t = function (e) {
      function ClientResponseError(t) {
        var n, i, o, r, s = this;
        return (s = e.call(this, "ClientResponseError") || this).url = "", s.status = 0, s.response = {}, s.isAbort = !1, s.originalError = null, Object.setPrototypeOf(s, ClientResponseError.prototype), null !== t && "object" == typeof t && (s.url = "string" == typeof t.url ? t.url : "", s.status = "number" == typeof t.status ? t.status : 0, s.isAbort = !!t.isAbort, s.originalError = t.originalError, null !== t.response && "object" == typeof t.response ? s.response = t.response : null !== t.data && "object" == typeof t.data ? s.response = t.data : s.response = {}), s.originalError || t instanceof ClientResponseError || (s.originalError = t), "undefined" != typeof DOMException && t instanceof DOMException && (s.isAbort = !0), s.name = "ClientResponseError " + s.status, s.message = null === (n = s.response) || void 0 === n ? void 0 : n.message, s.message || (s.isAbort ? s.message = "The request was autocancelled. You can find more info in https://github.com/pocketbase/js-sdk#auto-cancellation." : (null === (r = null === (o = null === (i = s.originalError) || void 0 === i ? void 0 : i.cause) || void 0 === o ? void 0 : o.message) || void 0 === r ? void 0 : r.includes("ECONNREFUSED ::1")) ? s.message = "Failed to connect to the PocketBase server. Try changing the SDK URL from localhost to 127.0.0.1 (https://github.com/pocketbase/js-sdk/issues/21)." : s.message = "Something went wrong while processing your request."), s
      }

      return __extends(ClientResponseError, e), Object.defineProperty(ClientResponseError.prototype, "data", {
        get: function () {
          return this.response
        }, enumerable: !1, configurable: !0
      }), ClientResponseError.prototype.toJSON = function () {
        return __assign({}, this)
      }, ClientResponseError
    }(Error), n = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

    function cookieSerialize(e, t, i) {
      var o = Object.assign({}, i || {}), r = o.encode || defaultEncode;
      if (!n.test(e)) throw new TypeError("argument name is invalid");
      var s = r(t);
      if (s && !n.test(s)) throw new TypeError("argument val is invalid");
      var a = e + "=" + s;
      if (null != o.maxAge) {
        var c = o.maxAge - 0;
        if (isNaN(c) || !isFinite(c)) throw new TypeError("option maxAge is invalid");
        a += "; Max-Age=" + Math.floor(c)
      }
      if (o.domain) {
        if (!n.test(o.domain)) throw new TypeError("option domain is invalid");
        a += "; Domain=" + o.domain
      }
      if (o.path) {
        if (!n.test(o.path)) throw new TypeError("option path is invalid");
        a += "; Path=" + o.path
      }
      if (o.expires) {
        if (!function isDate(e) {
          return "[object Date]" === Object.prototype.toString.call(e) || e instanceof Date
        }(o.expires) || isNaN(o.expires.valueOf())) throw new TypeError("option expires is invalid");
        a += "; Expires=" + o.expires.toUTCString()
      }
      if (o.httpOnly && (a += "; HttpOnly"), o.secure && (a += "; Secure"), o.priority) switch ("string" == typeof o.priority ? o.priority.toLowerCase() : o.priority) {
        case"low":
          a += "; Priority=Low";
          break;
        case"medium":
          a += "; Priority=Medium";
          break;
        case"high":
          a += "; Priority=High";
          break;
        default:
          throw new TypeError("option priority is invalid")
      }
      if (o.sameSite) switch ("string" == typeof o.sameSite ? o.sameSite.toLowerCase() : o.sameSite) {
        case!0:
          a += "; SameSite=Strict";
          break;
        case"lax":
          a += "; SameSite=Lax";
          break;
        case"strict":
          a += "; SameSite=Strict";
          break;
        case"none":
          a += "; SameSite=None";
          break;
        default:
          throw new TypeError("option sameSite is invalid")
      }
      return a
    }

    function defaultDecode(e) {
      return -1 !== e.indexOf("%") ? decodeURIComponent(e) : e
    }

    function defaultEncode(e) {
      return encodeURIComponent(e)
    }

    function getTokenPayload(t) {
      if (t) try {
        var n = decodeURIComponent(e(t.split(".")[1]).split("").map((function (e) {
          return "%" + ("00" + e.charCodeAt(0).toString(16)).slice(-2)
        })).join(""));
        return JSON.parse(n) || {}
      } catch (e) {
      }
      return {}
    }

    function isTokenExpired(e, t) {
      void 0 === t && (t = 0);
      var n = getTokenPayload(e);
      return !(Object.keys(n).length > 0 && (!n.exp || n.exp - t > Date.now() / 1e3))
    }

    e = "function" == typeof atob ? atob : function (e) {
      var t = String(e).replace(/=+$/, "");
      if (t.length % 4 == 1) throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
      for (var n, i, o = 0, r = 0, s = ""; i = t.charAt(r++); ~i && (n = o % 4 ? 64 * n + i : i, o++ % 4) ? s += String.fromCharCode(255 & n >> (-2 * o & 6)) : 0) i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(i);
      return s
    };
    var i = function () {
      function BaseModel(e) {
        void 0 === e && (e = {}), this.$load(e || {})
      }

      return BaseModel.prototype.load = function (e) {
        return this.$load(e)
      }, BaseModel.prototype.$load = function (e) {
        for (var t = 0, n = Object.entries(e); t < n.length; t++) {
          var i = n[t], o = i[0], r = i[1];
          this[o] = r
        }
        this.id = void 0 !== e.id ? e.id : "", this.created = void 0 !== e.created ? e.created : "", this.updated = void 0 !== e.updated ? e.updated : ""
      }, Object.defineProperty(BaseModel.prototype, "$isNew", {
        get: function () {
          return !this.id
        }, enumerable: !1, configurable: !0
      }), BaseModel.prototype.clone = function () {
        return this.$clone()
      }, BaseModel.prototype.$clone = function () {
        var e = "function" == typeof structuredClone ? structuredClone(this) : JSON.parse(JSON.stringify(this));
        return new this.constructor(e)
      }, BaseModel.prototype.export = function () {
        return this.$export()
      }, BaseModel.prototype.$export = function () {
        return "function" == typeof structuredClone ? structuredClone(this) : Object.assign({}, this)
      }, BaseModel
    }(), o = function (e) {
      function Record() {
        return null !== e && e.apply(this, arguments) || this
      }

      return __extends(Record, e), Record.prototype.$load = function (t) {
        e.prototype.$load.call(this, t), this.collectionId = "string" == typeof t.collectionId ? t.collectionId : "", this.collectionName = "string" == typeof t.collectionName ? t.collectionName : "", this._loadExpand(t.expand)
      }, Record.prototype._loadExpand = function (e) {
        for (var t in e = e || {}, this.expand = {}, e) Array.isArray(e[t]) ? this.expand[t] = e[t].map((function (e) {
          return new Record(e || {})
        })) : this.expand[t] = new Record(e[t] || {})
      }, Record
    }(i), r = function (e) {
      function Admin() {
        return null !== e && e.apply(this, arguments) || this
      }

      return __extends(Admin, e), Admin.prototype.$load = function (t) {
        e.prototype.$load.call(this, t), this.avatar = "number" == typeof t.avatar ? t.avatar : 0, this.email = "string" == typeof t.email ? t.email : ""
      }, Admin
    }(i), s = "pb_auth", a = function () {
      function BaseAuthStore() {
        this.baseToken = "", this.baseModel = null, this._onChangeCallbacks = []
      }

      return Object.defineProperty(BaseAuthStore.prototype, "token", {
        get: function () {
          return this.baseToken
        }, enumerable: !1, configurable: !0
      }), Object.defineProperty(BaseAuthStore.prototype, "model", {
        get: function () {
          return this.baseModel
        }, enumerable: !1, configurable: !0
      }), Object.defineProperty(BaseAuthStore.prototype, "isValid", {
        get: function () {
          return !isTokenExpired(this.token)
        }, enumerable: !1, configurable: !0
      }), BaseAuthStore.prototype.save = function (e, t) {
        this.baseToken = e || "", this.baseModel = null !== t && "object" == typeof t ? void 0 !== t.collectionId ? new o(t) : new r(t) : null, this.triggerChange()
      }, BaseAuthStore.prototype.clear = function () {
        this.baseToken = "", this.baseModel = null, this.triggerChange()
      }, BaseAuthStore.prototype.loadFromCookie = function (e, t) {
        void 0 === t && (t = s);
        var n = function cookieParse(e, t) {
          var n = {};
          if ("string" != typeof e) return n;
          for (var i = Object.assign({}, t || {}).decode || defaultDecode, o = 0; o < e.length;) {
            var r = e.indexOf("=", o);
            if (-1 === r) break;
            var s = e.indexOf(";", o);
            if (-1 === s) s = e.length; else if (s < r) {
              o = e.lastIndexOf(";", r - 1) + 1;
              continue
            }
            var a = e.slice(o, r).trim();
            if (void 0 === n[a]) {
              var c = e.slice(r + 1, s).trim();
              34 === c.charCodeAt(0) && (c = c.slice(1, -1));
              try {
                n[a] = i(c)
              } catch (e) {
                n[a] = c
              }
            }
            o = s + 1
          }
          return n
        }(e || "")[t] || "", i = {};
        try {
          (null === typeof (i = JSON.parse(n)) || "object" != typeof i || Array.isArray(i)) && (i = {})
        } catch (e) {
        }
        this.save(i.token || "", i.model || null)
      }, BaseAuthStore.prototype.exportToCookie = function (e, t) {
        var n, i, r;
        void 0 === t && (t = s);
        var a = {secure: !0, sameSite: !0, httpOnly: !0, path: "/"}, c = getTokenPayload(this.token);
        (null == c ? void 0 : c.exp) ? a.expires = new Date(1e3 * c.exp) : a.expires = new Date("1970-01-01"), e = Object.assign({}, a, e);
        var u = {token: this.token, model: (null === (n = this.model) || void 0 === n ? void 0 : n.export()) || null},
          l = cookieSerialize(t, JSON.stringify(u), e), d = "undefined" != typeof Blob ? new Blob([l]).size : l.length;
        return u.model && d > 4096 && (u.model = {
          id: null === (i = null == u ? void 0 : u.model) || void 0 === i ? void 0 : i.id,
          email: null === (r = null == u ? void 0 : u.model) || void 0 === r ? void 0 : r.email
        }, this.model instanceof o && (u.model.username = this.model.username, u.model.verified = this.model.verified, u.model.collectionId = this.model.collectionId), l = cookieSerialize(t, JSON.stringify(u), e)), l
      }, BaseAuthStore.prototype.onChange = function (e, t) {
        var n = this;
        return void 0 === t && (t = !1), this._onChangeCallbacks.push(e), t && e(this.token, this.model), function () {
          for (var t = n._onChangeCallbacks.length - 1; t >= 0; t--) if (n._onChangeCallbacks[t] == e) return delete n._onChangeCallbacks[t], void n._onChangeCallbacks.splice(t, 1)
        }
      }, BaseAuthStore.prototype.triggerChange = function () {
        for (var e = 0, t = this._onChangeCallbacks; e < t.length; e++) {
          var n = t[e];
          n && n(this.token, this.model)
        }
      }, BaseAuthStore
    }(), c = function (e) {
      function LocalAuthStore(t) {
        void 0 === t && (t = "pocketbase_auth");
        var n = e.call(this) || this;
        return n.storageFallback = {}, n.storageKey = t, n
      }

      return __extends(LocalAuthStore, e), Object.defineProperty(LocalAuthStore.prototype, "token", {
        get: function () {
          return (this._storageGet(this.storageKey) || {}).token || ""
        }, enumerable: !1, configurable: !0
      }), Object.defineProperty(LocalAuthStore.prototype, "model", {
        get: function () {
          var e, t = this._storageGet(this.storageKey) || {};
          return null === t || "object" != typeof t || null === t.model || "object" != typeof t.model ? null : void 0 === (null === (e = t.model) || void 0 === e ? void 0 : e.collectionId) ? new r(t.model) : new o(t.model)
        }, enumerable: !1, configurable: !0
      }), LocalAuthStore.prototype.save = function (t, n) {
        this._storageSet(this.storageKey, {token: t, model: n}), e.prototype.save.call(this, t, n)
      }, LocalAuthStore.prototype.clear = function () {
        this._storageRemove(this.storageKey), e.prototype.clear.call(this)
      }, LocalAuthStore.prototype._storageGet = function (e) {
        if ("undefined" != typeof window && (null === window || void 0 === window ? void 0 : window.localStorage)) {
          var t = window.localStorage.getItem(e) || "";
          try {
            return JSON.parse(t)
          } catch (e) {
            return t
          }
        }
        return this.storageFallback[e]
      }, LocalAuthStore.prototype._storageSet = function (e, t) {
        if ("undefined" != typeof window && (null === window || void 0 === window ? void 0 : window.localStorage)) {
          var n = t;
          "string" != typeof t && (n = JSON.stringify(t)), window.localStorage.setItem(e, n)
        } else this.storageFallback[e] = t
      }, LocalAuthStore.prototype._storageRemove = function (e) {
        var t;
        "undefined" != typeof window && (null === window || void 0 === window ? void 0 : window.localStorage) && (null === (t = window.localStorage) || void 0 === t || t.removeItem(e)), delete this.storageFallback[e]
      }, LocalAuthStore
    }(a), u = function u(e) {
      this.client = e
    }, l = function (e) {
      function SettingsService() {
        return null !== e && e.apply(this, arguments) || this
      }

      return __extends(SettingsService, e), SettingsService.prototype.getAll = function (e) {
        return void 0 === e && (e = {}), this.client.send("/api/settings", {
          method: "GET",
          params: e
        }).then((function (e) {
          return e || {}
        }))
      }, SettingsService.prototype.update = function (e, t) {
        return void 0 === e && (e = {}), void 0 === t && (t = {}), this.client.send("/api/settings", {
          method: "PATCH",
          params: t,
          body: e
        }).then((function (e) {
          return e || {}
        }))
      }, SettingsService.prototype.testS3 = function (e, t) {
        void 0 === e && (e = "storage"), void 0 === t && (t = {});
        var n = {filesystem: e};
        return this.client.send("/api/settings/test/s3", {method: "POST", params: t, body: n}).then((function () {
          return !0
        }))
      }, SettingsService.prototype.testEmail = function (e, t, n) {
        void 0 === n && (n = {});
        var i = {email: e, template: t};
        return this.client.send("/api/settings/test/email", {method: "POST", params: n, body: i}).then((function () {
          return !0
        }))
      }, SettingsService.prototype.generateAppleClientSecret = function (e, t, n, i, o, r, s) {
        return void 0 === r && (r = {}), void 0 === s && (s = {}), r = Object.assign({
          clientId: e,
          teamId: t,
          keyId: n,
          privateKey: i,
          duration: o
        }, r), this.client.send("/api/settings/apple/generate-client-secret", {method: "POST", params: s, body: r})
      }, SettingsService
    }(u), d = function d(e, t, n, i, o) {
      this.page = e > 0 ? e : 1, this.perPage = t >= 0 ? t : 0, this.totalItems = n >= 0 ? n : 0, this.totalPages = i >= 0 ? i : 0, this.items = o || []
    }, h = function (e) {
      function CrudService() {
        return null !== e && e.apply(this, arguments) || this
      }

      return __extends(CrudService, e), CrudService.prototype.getFullList = function (e, t) {
        if ("number" == typeof e) return this._getFullList(this.baseCrudPath, e, t);
        var n = Object.assign({}, e, t), i = 500;
        return n.batch && (i = n.batch, delete n.batch), this._getFullList(this.baseCrudPath, i, n)
      }, CrudService.prototype.getList = function (e, t, n) {
        return void 0 === e && (e = 1), void 0 === t && (t = 30), void 0 === n && (n = {}), this._getList(this.baseCrudPath, e, t, n)
      }, CrudService.prototype.getFirstListItem = function (e, t) {
        return void 0 === t && (t = {}), this._getFirstListItem(this.baseCrudPath, e, t)
      }, CrudService.prototype.getOne = function (e, t) {
        return void 0 === t && (t = {}), this._getOne(this.baseCrudPath, e, t)
      }, CrudService.prototype.create = function (e, t) {
        return void 0 === e && (e = {}), void 0 === t && (t = {}), this._create(this.baseCrudPath, e, t)
      }, CrudService.prototype.update = function (e, t, n) {
        return void 0 === t && (t = {}), void 0 === n && (n = {}), this._update(this.baseCrudPath, e, t, n)
      }, CrudService.prototype.delete = function (e, t) {
        return void 0 === t && (t = {}), this._delete(this.baseCrudPath, e, t)
      }, CrudService
    }(function (e) {
      function BaseCrudService() {
        return null !== e && e.apply(this, arguments) || this
      }

      return __extends(BaseCrudService, e), BaseCrudService.prototype._getFullList = function (e, t, n) {
        var i = this;
        void 0 === t && (t = 500), void 0 === n && (n = {}), n = Object.assign({skipTotal: 1}, n);
        var o = [], request = function (r) {
          return __awaiter(i, void 0, void 0, (function () {
            return __generator(this, (function (i) {
              return [2, this._getList(e, r, t || 500, n).then((function (e) {
                var t = e.items;
                return o = o.concat(t), t.length == e.perPage ? request(r + 1) : o
              }))]
            }))
          }))
        };
        return request(1)
      }, BaseCrudService.prototype._getList = function (e, t, n, i) {
        var o = this;
        return void 0 === t && (t = 1), void 0 === n && (n = 30), void 0 === i && (i = {}), i = Object.assign({
          page: t,
          perPage: n
        }, i), this.client.send(e, {method: "GET", params: i}).then((function (e) {
          var t = [];
          if (null == e ? void 0 : e.items) {
            e.items = e.items || [];
            for (var n = 0, i = e.items; n < i.length; n++) {
              var r = i[n];
              t.push(o.decode(r))
            }
          }
          return new d((null == e ? void 0 : e.page) || 1, (null == e ? void 0 : e.perPage) || 0, (null == e ? void 0 : e.totalItems) || 0, (null == e ? void 0 : e.totalPages) || 0, t)
        }))
      }, BaseCrudService.prototype._getOne = function (e, t, n) {
        var i = this;
        return void 0 === n && (n = {}), this.client.send(e + "/" + encodeURIComponent(t), {
          method: "GET",
          params: n
        }).then((function (e) {
          return i.decode(e)
        }))
      }, BaseCrudService.prototype._getFirstListItem = function (e, n, i) {
        return void 0 === i && (i = {}), i = Object.assign({
          filter: n,
          skipTotal: 1,
          $cancelKey: "one_by_filter_" + e + "_" + n
        }, i), this._getList(e, 1, 1, i).then((function (e) {
          var n;
          if (!(null === (n = null == e ? void 0 : e.items) || void 0 === n ? void 0 : n.length)) throw new t({
            status: 404,
            data: {code: 404, message: "The requested resource wasn't found.", data: {}}
          });
          return e.items[0]
        }))
      }, BaseCrudService.prototype._create = function (e, t, n) {
        var i = this;
        return void 0 === t && (t = {}), void 0 === n && (n = {}), this.client.send(e, {
          method: "POST",
          params: n,
          body: t
        }).then((function (e) {
          return i.decode(e)
        }))
      }, BaseCrudService.prototype._update = function (e, t, n, i) {
        var o = this;
        return void 0 === n && (n = {}), void 0 === i && (i = {}), this.client.send(e + "/" + encodeURIComponent(t), {
          method: "PATCH",
          params: i,
          body: n
        }).then((function (e) {
          return o.decode(e)
        }))
      }, BaseCrudService.prototype._delete = function (e, t, n) {
        return void 0 === n && (n = {}), this.client.send(e + "/" + encodeURIComponent(t), {
          method: "DELETE",
          params: n
        }).then((function () {
          return !0
        }))
      }, BaseCrudService
    }(u)), p = function (e) {
      function AdminService() {
        return null !== e && e.apply(this, arguments) || this
      }

      return __extends(AdminService, e), AdminService.prototype.decode = function (e) {
        return new r(e)
      }, Object.defineProperty(AdminService.prototype, "baseCrudPath", {
        get: function () {
          return "/api/admins"
        }, enumerable: !1, configurable: !0
      }), AdminService.prototype.update = function (t, n, i) {
        var o = this;
        return void 0 === n && (n = {}), void 0 === i && (i = {}), e.prototype.update.call(this, t, n, i).then((function (e) {
          var t, n;
          return o.client.authStore.model && void 0 === (null === (t = o.client.authStore.model) || void 0 === t ? void 0 : t.collectionId) && (null === (n = o.client.authStore.model) || void 0 === n ? void 0 : n.id) === (null == e ? void 0 : e.id) && o.client.authStore.save(o.client.authStore.token, e), e
        }))
      }, AdminService.prototype.delete = function (t, n) {
        var i = this;
        return void 0 === n && (n = {}), e.prototype.delete.call(this, t, n).then((function (e) {
          var n, o;
          return e && i.client.authStore.model && void 0 === (null === (n = i.client.authStore.model) || void 0 === n ? void 0 : n.collectionId) && (null === (o = i.client.authStore.model) || void 0 === o ? void 0 : o.id) === t && i.client.authStore.clear(), e
        }))
      }, AdminService.prototype.authResponse = function (e) {
        var t = this.decode((null == e ? void 0 : e.admin) || {});
        return (null == e ? void 0 : e.token) && (null == e ? void 0 : e.admin) && this.client.authStore.save(e.token, t), Object.assign({}, e, {
          token: (null == e ? void 0 : e.token) || "",
          admin: t
        })
      }, AdminService.prototype.authWithPassword = function (e, t, n, i) {
        return void 0 === n && (n = {}), void 0 === i && (i = {}), n = Object.assign({
          identity: e,
          password: t
        }, n), this.client.send(this.baseCrudPath + "/auth-with-password", {
          method: "POST",
          params: i,
          body: n
        }).then(this.authResponse.bind(this))
      }, AdminService.prototype.authRefresh = function (e, t) {
        return void 0 === e && (e = {}), void 0 === t && (t = {}), this.client.send(this.baseCrudPath + "/auth-refresh", {
          method: "POST",
          params: t,
          body: e
        }).then(this.authResponse.bind(this))
      }, AdminService.prototype.requestPasswordReset = function (e, t, n) {
        return void 0 === t && (t = {}), void 0 === n && (n = {}), t = Object.assign({email: e}, t), this.client.send(this.baseCrudPath + "/request-password-reset", {
          method: "POST",
          params: n,
          body: t
        }).then((function () {
          return !0
        }))
      }, AdminService.prototype.confirmPasswordReset = function (e, t, n, i, o) {
        return void 0 === i && (i = {}), void 0 === o && (o = {}), i = Object.assign({
          token: e,
          password: t,
          passwordConfirm: n
        }, i), this.client.send(this.baseCrudPath + "/confirm-password-reset", {
          method: "POST",
          params: o,
          body: i
        }).then((function () {
          return !0
        }))
      }, AdminService
    }(h), v = function (e) {
      function ExternalAuth() {
        return null !== e && e.apply(this, arguments) || this
      }

      return __extends(ExternalAuth, e), ExternalAuth.prototype.$load = function (t) {
        e.prototype.$load.call(this, t), this.recordId = "string" == typeof t.recordId ? t.recordId : "", this.collectionId = "string" == typeof t.collectionId ? t.collectionId : "", this.provider = "string" == typeof t.provider ? t.provider : "", this.providerId = "string" == typeof t.providerId ? t.providerId : ""
      }, ExternalAuth
    }(i), f = function (e) {
      function RecordService(t, n) {
        var i = e.call(this, t) || this;
        return i.collectionIdOrName = n, i
      }

      return __extends(RecordService, e), RecordService.prototype.decode = function (e) {
        return new o(e)
      }, Object.defineProperty(RecordService.prototype, "baseCrudPath", {
        get: function () {
          return this.baseCollectionPath + "/records"
        }, enumerable: !1, configurable: !0
      }), Object.defineProperty(RecordService.prototype, "baseCollectionPath", {
        get: function () {
          return "/api/collections/" + encodeURIComponent(this.collectionIdOrName)
        }, enumerable: !1, configurable: !0
      }), RecordService.prototype.subscribeOne = function (e, t) {
        return __awaiter(this, void 0, void 0, (function () {
          return __generator(this, (function (n) {
            return console.warn("PocketBase: subscribeOne(recordId, callback) is deprecated. Please replace it with subscribe(recordId, callback)."), [2, this.client.realtime.subscribe(this.collectionIdOrName + "/" + e, t)]
          }))
        }))
      }, RecordService.prototype.subscribe = function (e, t) {
        return __awaiter(this, void 0, void 0, (function () {
          var n;
          return __generator(this, (function (i) {
            if ("function" == typeof e) return console.warn("PocketBase: subscribe(callback) is deprecated. Please replace it with subscribe('*', callback)."), [2, this.client.realtime.subscribe(this.collectionIdOrName, e)];
            if (!t) throw new Error("Missing subscription callback.");
            if ("" === e) throw new Error("Missing topic.");
            return n = this.collectionIdOrName, "*" !== e && (n += "/" + e), [2, this.client.realtime.subscribe(n, t)]
          }))
        }))
      }, RecordService.prototype.unsubscribe = function (e) {
        return __awaiter(this, void 0, void 0, (function () {
          return __generator(this, (function (t) {
            return "*" === e ? [2, this.client.realtime.unsubscribe(this.collectionIdOrName)] : e ? [2, this.client.realtime.unsubscribe(this.collectionIdOrName + "/" + e)] : [2, this.client.realtime.unsubscribeByPrefix(this.collectionIdOrName)]
          }))
        }))
      }, RecordService.prototype.getFullList = function (t, n) {
        if ("number" == typeof t) return e.prototype.getFullList.call(this, t, n);
        var i = Object.assign({}, t, n);
        return e.prototype.getFullList.call(this, i)
      }, RecordService.prototype.getList = function (t, n, i) {
        return void 0 === t && (t = 1), void 0 === n && (n = 30), void 0 === i && (i = {}), e.prototype.getList.call(this, t, n, i)
      }, RecordService.prototype.getFirstListItem = function (t, n) {
        return void 0 === n && (n = {}), e.prototype.getFirstListItem.call(this, t, n)
      }, RecordService.prototype.getOne = function (t, n) {
        return void 0 === n && (n = {}), e.prototype.getOne.call(this, t, n)
      }, RecordService.prototype.create = function (t, n) {
        return void 0 === t && (t = {}), void 0 === n && (n = {}), e.prototype.create.call(this, t, n)
      }, RecordService.prototype.update = function (t, n, i) {
        var o = this;
        return void 0 === n && (n = {}), void 0 === i && (i = {}), e.prototype.update.call(this, t, n, i).then((function (e) {
          var t, n, i;
          return (null === (t = o.client.authStore.model) || void 0 === t ? void 0 : t.id) !== (null == e ? void 0 : e.id) || (null === (n = o.client.authStore.model) || void 0 === n ? void 0 : n.collectionId) !== o.collectionIdOrName && (null === (i = o.client.authStore.model) || void 0 === i ? void 0 : i.collectionName) !== o.collectionIdOrName || o.client.authStore.save(o.client.authStore.token, e), e
        }))
      }, RecordService.prototype.delete = function (t, n) {
        var i = this;
        return void 0 === n && (n = {}), e.prototype.delete.call(this, t, n).then((function (e) {
          var n, o, r;
          return !e || (null === (n = i.client.authStore.model) || void 0 === n ? void 0 : n.id) !== t || (null === (o = i.client.authStore.model) || void 0 === o ? void 0 : o.collectionId) !== i.collectionIdOrName && (null === (r = i.client.authStore.model) || void 0 === r ? void 0 : r.collectionName) !== i.collectionIdOrName || i.client.authStore.clear(), e
        }))
      }, RecordService.prototype.authResponse = function (e) {
        var t = this.decode((null == e ? void 0 : e.record) || {});
        return this.client.authStore.save(null == e ? void 0 : e.token, t), Object.assign({}, e, {
          token: (null == e ? void 0 : e.token) || "",
          record: t
        })
      }, RecordService.prototype.listAuthMethods = function (e) {
        return void 0 === e && (e = {}), this.client.send(this.baseCollectionPath + "/auth-methods", {
          method: "GET",
          params: e
        }).then((function (e) {
          return Object.assign({}, e, {
            usernamePassword: !!(null == e ? void 0 : e.usernamePassword),
            emailPassword: !!(null == e ? void 0 : e.emailPassword),
            authProviders: Array.isArray(null == e ? void 0 : e.authProviders) ? null == e ? void 0 : e.authProviders : []
          })
        }))
      }, RecordService.prototype.authWithPassword = function (e, t, n, i) {
        var o = this;
        return void 0 === n && (n = {}), void 0 === i && (i = {}), n = Object.assign({
          identity: e,
          password: t
        }, n), this.client.send(this.baseCollectionPath + "/auth-with-password", {
          method: "POST",
          params: i,
          body: n
        }).then((function (e) {
          return o.authResponse(e)
        }))
      }, RecordService.prototype.authWithOAuth2Code = function (e, t, n, i, o, r, s) {
        var a = this;
        return void 0 === o && (o = {}), void 0 === r && (r = {}), void 0 === s && (s = {}), r = Object.assign({
          provider: e,
          code: t,
          codeVerifier: n,
          redirectUrl: i,
          createData: o
        }, r), this.client.send(this.baseCollectionPath + "/auth-with-oauth2", {
          method: "POST",
          params: s,
          body: r
        }).then((function (e) {
          return a.authResponse(e)
        }))
      }, RecordService.prototype.authWithOAuth2 = function () {
        for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
        return __awaiter(this, void 0, void 0, (function () {
          var n, i, o, r, s = this;
          return __generator(this, (function (a) {
            switch (a.label) {
              case 0:
                return e.length > 1 || "string" == typeof (null == e ? void 0 : e[0]) ? (console.warn("PocketBase: This form of authWithOAuth2() is deprecated and may get removed in the future. Please replace with authWithOAuth2Code() OR use the authWithOAuth2() realtime form as shown in https://pocketbase.io/docs/authentication/#oauth2-integration."), [2, this.authWithOAuth2Code((null == e ? void 0 : e[0]) || "", (null == e ? void 0 : e[1]) || "", (null == e ? void 0 : e[2]) || "", (null == e ? void 0 : e[3]) || "", (null == e ? void 0 : e[4]) || {}, (null == e ? void 0 : e[5]) || {}, (null == e ? void 0 : e[6]) || {})]) : (n = (null == e ? void 0 : e[0]) || {}, [4, this.listAuthMethods()]);
              case 1:
                if (i = a.sent(), !(o = i.authProviders.find((function (e) {
                  return e.name === n.provider
                })))) throw new t(new Error('Missing or invalid provider "'.concat(n.provider, '".')));
                return r = this.client.buildUrl("/api/oauth2-redirect"), [2, new Promise((function (e, i) {
                  return __awaiter(s, void 0, void 0, (function () {
                    var s, a, c, u, l, d = this;
                    return __generator(this, (function (h) {
                      switch (h.label) {
                        case 0:
                          return h.trys.push([0, 3, , 4]), [4, this.client.realtime.subscribe("@oauth2", (function (a) {
                            return __awaiter(d, void 0, void 0, (function () {
                              var c, u, l;
                              return __generator(this, (function (d) {
                                switch (d.label) {
                                  case 0:
                                    c = this.client.realtime.clientId, d.label = 1;
                                  case 1:
                                    if (d.trys.push([1, 3, , 4]), s(), !a.state || c !== a.state) throw new Error("State parameters don't match.");
                                    return [4, this.authWithOAuth2Code(o.name, a.code, o.codeVerifier, r, n.createData, n.body, n.query)];
                                  case 2:
                                    return u = d.sent(), e(u), [3, 4];
                                  case 3:
                                    return l = d.sent(), i(new t(l)), [3, 4];
                                  case 4:
                                    return [2]
                                }
                              }))
                            }))
                          }))];
                        case 1:
                          return s = h.sent(), a = {state: this.client.realtime.clientId}, (null === (l = n.scopes) || void 0 === l ? void 0 : l.length) && (a.scope = n.scopes.join(" ")), c = this._replaceQueryParams(o.authUrl + r, a), [4, n.urlCallback ? n.urlCallback(c) : this._defaultUrlCallback(c)];
                        case 2:
                          return h.sent(), [3, 4];
                        case 3:
                          return u = h.sent(), i(new t(u)), [3, 4];
                        case 4:
                          return [2]
                      }
                    }))
                  }))
                }))]
            }
          }))
        }))
      }, RecordService.prototype.authRefresh = function (e, t) {
        var n = this;
        return void 0 === e && (e = {}), void 0 === t && (t = {}), this.client.send(this.baseCollectionPath + "/auth-refresh", {
          method: "POST",
          params: t,
          body: e
        }).then((function (e) {
          return n.authResponse(e)
        }))
      }, RecordService.prototype.requestPasswordReset = function (e, t, n) {
        return void 0 === t && (t = {}), void 0 === n && (n = {}), t = Object.assign({email: e}, t), this.client.send(this.baseCollectionPath + "/request-password-reset", {
          method: "POST",
          params: n,
          body: t
        }).then((function () {
          return !0
        }))
      }, RecordService.prototype.confirmPasswordReset = function (e, t, n, i, o) {
        return void 0 === i && (i = {}), void 0 === o && (o = {}), i = Object.assign({
          token: e,
          password: t,
          passwordConfirm: n
        }, i), this.client.send(this.baseCollectionPath + "/confirm-password-reset", {
          method: "POST",
          params: o,
          body: i
        }).then((function () {
          return !0
        }))
      }, RecordService.prototype.requestVerification = function (e, t, n) {
        return void 0 === t && (t = {}), void 0 === n && (n = {}), t = Object.assign({email: e}, t), this.client.send(this.baseCollectionPath + "/request-verification", {
          method: "POST",
          params: n,
          body: t
        }).then((function () {
          return !0
        }))
      }, RecordService.prototype.confirmVerification = function (e, t, n) {
        return void 0 === t && (t = {}), void 0 === n && (n = {}), t = Object.assign({token: e}, t), this.client.send(this.baseCollectionPath + "/confirm-verification", {
          method: "POST",
          params: n,
          body: t
        }).then((function () {
          return !0
        }))
      }, RecordService.prototype.requestEmailChange = function (e, t, n) {
        return void 0 === t && (t = {}), void 0 === n && (n = {}), t = Object.assign({newEmail: e}, t), this.client.send(this.baseCollectionPath + "/request-email-change", {
          method: "POST",
          params: n,
          body: t
        }).then((function () {
          return !0
        }))
      }, RecordService.prototype.confirmEmailChange = function (e, t, n, i) {
        return void 0 === n && (n = {}), void 0 === i && (i = {}), n = Object.assign({
          token: e,
          password: t
        }, n), this.client.send(this.baseCollectionPath + "/confirm-email-change", {
          method: "POST",
          params: i,
          body: n
        }).then((function () {
          return !0
        }))
      }, RecordService.prototype.listExternalAuths = function (e, t) {
        return void 0 === t && (t = {}), this.client.send(this.baseCrudPath + "/" + encodeURIComponent(e) + "/external-auths", {
          method: "GET",
          params: t
        }).then((function (e) {
          var t = [];
          if (Array.isArray(e)) for (var n = 0, i = e; n < i.length; n++) {
            var o = i[n];
            t.push(new v(o))
          }
          return t
        }))
      }, RecordService.prototype.unlinkExternalAuth = function (e, t, n) {
        return void 0 === n && (n = {}), this.client.send(this.baseCrudPath + "/" + encodeURIComponent(e) + "/external-auths/" + encodeURIComponent(t), {
          method: "DELETE",
          params: n
        }).then((function () {
          return !0
        }))
      }, RecordService.prototype._replaceQueryParams = function (e, t) {
        void 0 === t && (t = {});
        var n = e, i = "";
        e.indexOf("?") >= 0 && (n = e.substring(0, e.indexOf("?")), i = e.substring(e.indexOf("?") + 1));
        for (var o = {}, r = 0, s = i.split("&"); r < s.length; r++) {
          var a = s[r];
          if ("" != a) {
            var c = a.split("=");
            o[decodeURIComponent(c[0].replace(/\+/g, " "))] = decodeURIComponent((c[1] || "").replace(/\+/g, " "))
          }
        }
        for (var u in t) t.hasOwnProperty(u) && (null == t[u] ? delete o[u] : o[u] = t[u]);
        for (var u in i = "", o) o.hasOwnProperty(u) && ("" != i && (i += "&"), i += encodeURIComponent(u.replace(/%20/g, "+")) + "=" + encodeURIComponent(o[u].replace(/%20/g, "+")));
        return "" != i ? n + "?" + i : n
      }, RecordService.prototype._defaultUrlCallback = function (e) {
        if ("undefined" == typeof window || !(null === window || void 0 === window ? void 0 : window.open)) throw new t(new Error("Not in a browser context - please pass a custom urlCallback function."));
        var n = 1024, i = 768, o = window.innerWidth, r = window.innerHeight, s = o / 2 - (n = n > o ? o : n) / 2,
          a = r / 2 - (i = i > r ? r : i) / 2;
        window.open(e, "oauth2-popup", "width=" + n + ",height=" + i + ",top=" + a + ",left=" + s + ",resizable,menubar=no")
      }, RecordService
    }(h), m = function m(e) {
      void 0 === e && (e = {}), this.id = void 0 !== e.id ? e.id : "", this.name = void 0 !== e.name ? e.name : "", this.type = void 0 !== e.type ? e.type : "text", this.system = !!e.system, this.required = !!e.required, this.options = "object" == typeof e.options && null !== e.options ? e.options : {}
    }, b = function (e) {
      function Collection() {
        return null !== e && e.apply(this, arguments) || this
      }

      return __extends(Collection, e), Collection.prototype.$load = function (t) {
        e.prototype.$load.call(this, t), this.system = !!t.system, this.name = "string" == typeof t.name ? t.name : "", this.type = "string" == typeof t.type ? t.type : "base", this.options = void 0 !== t.options && null !== t.options ? t.options : {}, this.indexes = Array.isArray(t.indexes) ? t.indexes : [], this.listRule = "string" == typeof t.listRule ? t.listRule : null, this.viewRule = "string" == typeof t.viewRule ? t.viewRule : null, this.createRule = "string" == typeof t.createRule ? t.createRule : null, this.updateRule = "string" == typeof t.updateRule ? t.updateRule : null, this.deleteRule = "string" == typeof t.deleteRule ? t.deleteRule : null, t.schema = Array.isArray(t.schema) ? t.schema : [], this.schema = [];
        for (var n = 0, i = t.schema; n < i.length; n++) {
          var o = i[n];
          this.schema.push(new m(o))
        }
      }, Object.defineProperty(Collection.prototype, "isBase", {
        get: function () {
          return this.$isBase
        }, enumerable: !1, configurable: !0
      }), Object.defineProperty(Collection.prototype, "$isBase", {
        get: function () {
          return "base" === this.type
        }, enumerable: !1, configurable: !0
      }), Object.defineProperty(Collection.prototype, "isAuth", {
        get: function () {
          return this.$isAuth
        }, enumerable: !1, configurable: !0
      }), Object.defineProperty(Collection.prototype, "$isAuth", {
        get: function () {
          return "auth" === this.type
        }, enumerable: !1, configurable: !0
      }), Object.defineProperty(Collection.prototype, "isView", {
        get: function () {
          return this.$isView
        }, enumerable: !1, configurable: !0
      }), Object.defineProperty(Collection.prototype, "$isView", {
        get: function () {
          return "view" === this.type
        }, enumerable: !1, configurable: !0
      }), Collection
    }(i), y = function (e) {
      function CollectionService() {
        return null !== e && e.apply(this, arguments) || this
      }

      return __extends(CollectionService, e), CollectionService.prototype.decode = function (e) {
        return new b(e)
      }, Object.defineProperty(CollectionService.prototype, "baseCrudPath", {
        get: function () {
          return "/api/collections"
        }, enumerable: !1, configurable: !0
      }), CollectionService.prototype.import = function (e, t, n) {
        return void 0 === t && (t = !1), void 0 === n && (n = {}), __awaiter(this, void 0, void 0, (function () {
          return __generator(this, (function (i) {
            return [2, this.client.send(this.baseCrudPath + "/import", {
              method: "PUT",
              params: n,
              body: {collections: e, deleteMissing: t}
            }).then((function () {
              return !0
            }))]
          }))
        }))
      }, CollectionService
    }(h), g = function (e) {
      function LogRequest() {
        return null !== e && e.apply(this, arguments) || this
      }

      return __extends(LogRequest, e), LogRequest.prototype.$load = function (t) {
        e.prototype.$load.call(this, t), t.remoteIp = t.remoteIp || t.ip, this.url = "string" == typeof t.url ? t.url : "", this.method = "string" == typeof t.method ? t.method : "GET", this.status = "number" == typeof t.status ? t.status : 200, this.auth = "string" == typeof t.auth ? t.auth : "guest", this.remoteIp = "string" == typeof t.remoteIp ? t.remoteIp : "", this.userIp = "string" == typeof t.userIp ? t.userIp : "", this.referer = "string" == typeof t.referer ? t.referer : "", this.userAgent = "string" == typeof t.userAgent ? t.userAgent : "", this.meta = "object" == typeof t.meta && null !== t.meta ? t.meta : {}
      }, LogRequest
    }(i), S = function (e) {
      function LogService() {
        return null !== e && e.apply(this, arguments) || this
      }

      return __extends(LogService, e), LogService.prototype.getRequestsList = function (e, t, n) {
        return void 0 === e && (e = 1), void 0 === t && (t = 30), void 0 === n && (n = {}), n = Object.assign({
          page: e,
          perPage: t
        }, n), this.client.send("/api/logs/requests", {method: "GET", params: n}).then((function (e) {
          var t = [];
          if (null == e ? void 0 : e.items) {
            e.items = (null == e ? void 0 : e.items) || [];
            for (var n = 0, i = e.items; n < i.length; n++) {
              var o = i[n];
              t.push(new g(o))
            }
          }
          return new d((null == e ? void 0 : e.page) || 1, (null == e ? void 0 : e.perPage) || 0, (null == e ? void 0 : e.totalItems) || 0, (null == e ? void 0 : e.totalPages) || 0, t)
        }))
      }, LogService.prototype.getRequest = function (e, t) {
        return void 0 === t && (t = {}), this.client.send("/api/logs/requests/" + encodeURIComponent(e), {
          method: "GET",
          params: t
        }).then((function (e) {
          return new g(e)
        }))
      }, LogService.prototype.getRequestsStats = function (e) {
        return void 0 === e && (e = {}), this.client.send("/api/logs/requests/stats", {
          method: "GET",
          params: e
        }).then((function (e) {
          return e
        }))
      }, LogService
    }(u), w = function (e) {
      function RealtimeService() {
        var t = null !== e && e.apply(this, arguments) || this;
        return t.clientId = "", t.eventSource = null, t.subscriptions = {}, t.lastSentTopics = [], t.maxConnectTimeout = 15e3, t.reconnectAttempts = 0, t.maxReconnectAttempts = 1 / 0, t.predefinedReconnectIntervals = [200, 300, 500, 1e3, 1200, 1500, 2e3], t.pendingConnects = [], t
      }

      return __extends(RealtimeService, e), Object.defineProperty(RealtimeService.prototype, "isConnected", {
        get: function () {
          return !!this.eventSource && !!this.clientId && !this.pendingConnects.length
        }, enumerable: !1, configurable: !0
      }), RealtimeService.prototype.subscribe = function (e, t) {
        var n;
        return __awaiter(this, void 0, void 0, (function () {
          var i, o = this;
          return __generator(this, (function (r) {
            switch (r.label) {
              case 0:
                if (!e) throw new Error("topic must be set.");
                return i = function (e) {
                  var n, i = e;
                  try {
                    n = JSON.parse(null == i ? void 0 : i.data)
                  } catch (e) {
                  }
                  t(n || {})
                }, this.subscriptions[e] || (this.subscriptions[e] = []), this.subscriptions[e].push(i), this.isConnected ? [3, 2] : [4, this.connect()];
              case 1:
                return r.sent(), [3, 5];
              case 2:
                return 1 !== this.subscriptions[e].length ? [3, 4] : [4, this.submitSubscriptions()];
              case 3:
                return r.sent(), [3, 5];
              case 4:
                null === (n = this.eventSource) || void 0 === n || n.addEventListener(e, i), r.label = 5;
              case 5:
                return [2, function () {
                  return __awaiter(o, void 0, void 0, (function () {
                    return __generator(this, (function (t) {
                      return [2, this.unsubscribeByTopicAndListener(e, i)]
                    }))
                  }))
                }]
            }
          }))
        }))
      }, RealtimeService.prototype.unsubscribe = function (e) {
        var t;
        return __awaiter(this, void 0, void 0, (function () {
          var n, i, o;
          return __generator(this, (function (r) {
            switch (r.label) {
              case 0:
                if (!this.hasSubscriptionListeners(e)) return [2];
                if (e) {
                  for (n = 0, i = this.subscriptions[e]; n < i.length; n++) o = i[n], null === (t = this.eventSource) || void 0 === t || t.removeEventListener(e, o);
                  delete this.subscriptions[e]
                } else this.subscriptions = {};
                return this.hasSubscriptionListeners() ? [3, 1] : (this.disconnect(), [3, 3]);
              case 1:
                return this.hasSubscriptionListeners(e) ? [3, 3] : [4, this.submitSubscriptions()];
              case 2:
                r.sent(), r.label = 3;
              case 3:
                return [2]
            }
          }))
        }))
      }, RealtimeService.prototype.unsubscribeByPrefix = function (e) {
        var t;
        return __awaiter(this, void 0, void 0, (function () {
          var n, i, o, r, s;
          return __generator(this, (function (a) {
            switch (a.label) {
              case 0:
                for (i in n = !1, this.subscriptions) if (i.startsWith(e)) {
                  for (n = !0, o = 0, r = this.subscriptions[i]; o < r.length; o++) s = r[o], null === (t = this.eventSource) || void 0 === t || t.removeEventListener(i, s);
                  delete this.subscriptions[i]
                }
                return n ? this.hasSubscriptionListeners() ? [4, this.submitSubscriptions()] : [3, 2] : [2];
              case 1:
                return a.sent(), [3, 3];
              case 2:
                this.disconnect(), a.label = 3;
              case 3:
                return [2]
            }
          }))
        }))
      }, RealtimeService.prototype.unsubscribeByTopicAndListener = function (e, t) {
        var n;
        return __awaiter(this, void 0, void 0, (function () {
          var i, o;
          return __generator(this, (function (r) {
            switch (r.label) {
              case 0:
                if (!Array.isArray(this.subscriptions[e]) || !this.subscriptions[e].length) return [2];
                for (i = !1, o = this.subscriptions[e].length - 1; o >= 0; o--) this.subscriptions[e][o] === t && (i = !0, delete this.subscriptions[e][o], this.subscriptions[e].splice(o, 1), null === (n = this.eventSource) || void 0 === n || n.removeEventListener(e, t));
                return i ? (this.subscriptions[e].length || delete this.subscriptions[e], this.hasSubscriptionListeners() ? [3, 1] : (this.disconnect(), [3, 3])) : [2];
              case 1:
                return this.hasSubscriptionListeners(e) ? [3, 3] : [4, this.submitSubscriptions()];
              case 2:
                r.sent(), r.label = 3;
              case 3:
                return [2]
            }
          }))
        }))
      }, RealtimeService.prototype.hasSubscriptionListeners = function (e) {
        var t, n;
        if (this.subscriptions = this.subscriptions || {}, e) return !!(null === (t = this.subscriptions[e]) || void 0 === t ? void 0 : t.length);
        for (var i in this.subscriptions) if (null === (n = this.subscriptions[i]) || void 0 === n ? void 0 : n.length) return !0;
        return !1
      }, RealtimeService.prototype.submitSubscriptions = function () {
        return __awaiter(this, void 0, void 0, (function () {
          return __generator(this, (function (e) {
            return this.clientId ? (this.addAllSubscriptionListeners(), this.lastSentTopics = this.getNonEmptySubscriptionTopics(), [2, this.client.send("/api/realtime", {
              method: "POST",
              body: {clientId: this.clientId, subscriptions: this.lastSentTopics},
              params: {$cancelKey: this.getSubscriptionsCancelKey()}
            }).catch((function (e) {
              if (!(null == e ? void 0 : e.isAbort)) throw e
            }))]) : [2]
          }))
        }))
      }, RealtimeService.prototype.getSubscriptionsCancelKey = function () {
        return "realtime_" + this.clientId
      }, RealtimeService.prototype.getNonEmptySubscriptionTopics = function () {
        var e = [];
        for (var t in this.subscriptions) this.subscriptions[t].length && e.push(t);
        return e
      }, RealtimeService.prototype.addAllSubscriptionListeners = function () {
        if (this.eventSource) for (var e in this.removeAllSubscriptionListeners(), this.subscriptions) for (var t = 0, n = this.subscriptions[e]; t < n.length; t++) {
          var i = n[t];
          this.eventSource.addEventListener(e, i)
        }
      }, RealtimeService.prototype.removeAllSubscriptionListeners = function () {
        if (this.eventSource) for (var e in this.subscriptions) for (var t = 0, n = this.subscriptions[e]; t < n.length; t++) {
          var i = n[t];
          this.eventSource.removeEventListener(e, i)
        }
      }, RealtimeService.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, (function () {
          var e = this;
          return __generator(this, (function (t) {
            return this.reconnectAttempts > 0 ? [2] : [2, new Promise((function (t, n) {
              e.pendingConnects.push({resolve: t, reject: n}), e.pendingConnects.length > 1 || e.initConnect()
            }))]
          }))
        }))
      }, RealtimeService.prototype.initConnect = function () {
        var e = this;
        this.disconnect(!0), clearTimeout(this.connectTimeoutId), this.connectTimeoutId = setTimeout((function () {
          e.connectErrorHandler(new Error("EventSource connect took too long."))
        }), this.maxConnectTimeout), this.eventSource = new EventSource(this.client.buildUrl("/api/realtime")), this.eventSource.onerror = function (t) {
          e.connectErrorHandler(new Error("Failed to establish realtime connection."))
        }, this.eventSource.addEventListener("PB_CONNECT", (function (t) {
          var n = t;
          e.clientId = null == n ? void 0 : n.lastEventId, e.submitSubscriptions().then((function () {
            return __awaiter(e, void 0, void 0, (function () {
              var e;
              return __generator(this, (function (t) {
                switch (t.label) {
                  case 0:
                    e = 3, t.label = 1;
                  case 1:
                    return this.hasUnsentSubscriptions() && e > 0 ? (e--, [4, this.submitSubscriptions()]) : [3, 3];
                  case 2:
                    return t.sent(), [3, 1];
                  case 3:
                    return [2]
                }
              }))
            }))
          })).then((function () {
            for (var t = 0, n = e.pendingConnects; t < n.length; t++) {
              n[t].resolve()
            }
            e.pendingConnects = [], e.reconnectAttempts = 0, clearTimeout(e.reconnectTimeoutId), clearTimeout(e.connectTimeoutId)
          })).catch((function (t) {
            e.clientId = "", e.connectErrorHandler(t)
          }))
        }))
      }, RealtimeService.prototype.hasUnsentSubscriptions = function () {
        var e = this.getNonEmptySubscriptionTopics();
        if (e.length != this.lastSentTopics.length) return !0;
        for (var t = 0, n = e; t < n.length; t++) {
          var i = n[t];
          if (!this.lastSentTopics.includes(i)) return !0
        }
        return !1
      }, RealtimeService.prototype.connectErrorHandler = function (e) {
        var n = this;
        if (clearTimeout(this.connectTimeoutId), clearTimeout(this.reconnectTimeoutId), !this.clientId && !this.reconnectAttempts || this.reconnectAttempts > this.maxReconnectAttempts) {
          for (var i = 0, o = this.pendingConnects; i < o.length; i++) {
            o[i].reject(new t(e))
          }
          return this.pendingConnects = [], void this.disconnect()
        }
        this.disconnect(!0);
        var r = this.predefinedReconnectIntervals[this.reconnectAttempts] || this.predefinedReconnectIntervals[this.predefinedReconnectIntervals.length - 1];
        this.reconnectAttempts++, this.reconnectTimeoutId = setTimeout((function () {
          n.initConnect()
        }), r)
      }, RealtimeService.prototype.disconnect = function (e) {
        var t;
        if (void 0 === e && (e = !1), clearTimeout(this.connectTimeoutId), clearTimeout(this.reconnectTimeoutId), this.removeAllSubscriptionListeners(), this.client.cancelRequest(this.getSubscriptionsCancelKey()), null === (t = this.eventSource) || void 0 === t || t.close(), this.eventSource = null, this.clientId = "", !e) {
          this.reconnectAttempts = 0;
          for (var n = 0, i = this.pendingConnects; n < i.length; n++) {
            i[n].resolve()
          }
          this.pendingConnects = []
        }
      }, RealtimeService
    }(u), C = function (e) {
      function HealthService() {
        return null !== e && e.apply(this, arguments) || this
      }

      return __extends(HealthService, e), HealthService.prototype.check = function (e) {
        return void 0 === e && (e = {}), this.client.send("/api/health", {method: "GET", params: e})
      }, HealthService
    }(u), _ = function (e) {
      function FileService() {
        return null !== e && e.apply(this, arguments) || this
      }

      return __extends(FileService, e), FileService.prototype.getUrl = function (e, t, n) {
        void 0 === n && (n = {});
        var i = [];
        i.push("api"), i.push("files"), i.push(encodeURIComponent(e.collectionId || e.collectionName)), i.push(encodeURIComponent(e.id)), i.push(encodeURIComponent(t));
        var o = this.client.buildUrl(i.join("/"));
        if (Object.keys(n).length) {
          !1 === n.download && delete n.download;
          var r = new URLSearchParams(n);
          o += (o.includes("?") ? "&" : "?") + r
        }
        return o
      }, FileService.prototype.getToken = function (e) {
        return void 0 === e && (e = {}), this.client.send("/api/files/token", {
          method: "POST",
          params: e
        }).then((function (e) {
          return (null == e ? void 0 : e.token) || ""
        }))
      }, FileService
    }(u), R = function (e) {
      function BackupService() {
        return null !== e && e.apply(this, arguments) || this
      }

      return __extends(BackupService, e), BackupService.prototype.getFullList = function (e) {
        return void 0 === e && (e = {}), this.client.send("/api/backups", {method: "GET", params: e})
      }, BackupService.prototype.create = function (e, t) {
        void 0 === t && (t = {});
        var n = {name: e};
        return this.client.send("/api/backups", {method: "POST", params: t, body: n}).then((function () {
          return !0
        }))
      }, BackupService.prototype.delete = function (e, t) {
        return void 0 === t && (t = {}), this.client.send("/api/backups/".concat(encodeURIComponent(e)), {
          method: "DELETE",
          params: t
        }).then((function () {
          return !0
        }))
      }, BackupService.prototype.restore = function (e, t) {
        return void 0 === t && (t = {}), this.client.send("/api/backups/".concat(encodeURIComponent(e), "/restore"), {
          method: "POST",
          params: t
        }).then((function () {
          return !0
        }))
      }, BackupService.prototype.getDownloadUrl = function (e, t) {
        return this.client.buildUrl("/api/backups/".concat(encodeURIComponent(t), "?token=").concat(encodeURIComponent(e)))
      }, BackupService
    }(u), O = function () {
      function Client(e, t, n) {
        void 0 === e && (e = "/"), void 0 === n && (n = "en-US"), this.cancelControllers = {}, this.recordServices = {}, this.enableAutoCancellation = !0, this.baseUrl = e, this.lang = n, this.authStore = t || new c, this.admins = new p(this), this.collections = new y(this), this.files = new _(this), this.logs = new S(this), this.settings = new l(this), this.realtime = new w(this), this.health = new C(this), this.backups = new R(this)
      }

      return Client.prototype.collection = function (e) {
        return this.recordServices[e] || (this.recordServices[e] = new f(this, e)), this.recordServices[e]
      }, Client.prototype.autoCancellation = function (e) {
        return this.enableAutoCancellation = !!e, this
      }, Client.prototype.cancelRequest = function (e) {
        return this.cancelControllers[e] && (this.cancelControllers[e].abort(), delete this.cancelControllers[e]), this
      }, Client.prototype.cancelAllRequests = function () {
        for (var e in this.cancelControllers) this.cancelControllers[e].abort();
        return this.cancelControllers = {}, this
      }, Client.prototype.send = function (e, n) {
        var i, o, r, s, a, c, u, l;
        return __awaiter(this, void 0, void 0, (function () {
          var d, h, p, v, f, m, b, y, g, S = this;
          return __generator(this, (function (w) {
            switch (w.label) {
              case 0:
                return d = Object.assign({method: "GET"}, n), this.isFormData(d.body) || (d.body && "string" != typeof d.body && (d.body = JSON.stringify(d.body)), void 0 === (null === (i = null == d ? void 0 : d.headers) || void 0 === i ? void 0 : i["Content-Type"]) && (d.headers = Object.assign({}, d.headers, {"Content-Type": "application/json"}))), void 0 === (null === (o = null == d ? void 0 : d.headers) || void 0 === o ? void 0 : o["Accept-Language"]) && (d.headers = Object.assign({}, d.headers, {"Accept-Language": this.lang})), (null === (r = this.authStore) || void 0 === r ? void 0 : r.token) && void 0 === (null === (s = null == d ? void 0 : d.headers) || void 0 === s ? void 0 : s.Authorization) && (d.headers = Object.assign({}, d.headers, {Authorization: this.authStore.token})), this.enableAutoCancellation && !1 !== (null === (a = d.params) || void 0 === a ? void 0 : a.$autoCancel) && (h = (null === (c = d.params) || void 0 === c ? void 0 : c.$cancelKey) || (d.method || "GET") + e, this.cancelRequest(h), p = new AbortController, this.cancelControllers[h] = p, d.signal = p.signal), null === (u = d.params) || void 0 === u || delete u.$autoCancel, null === (l = d.params) || void 0 === l || delete l.$cancelKey, v = this.buildUrl(e), void 0 !== d.params && ((f = this.serializeQueryParams(d.params)) && (v += (v.includes("?") ? "&" : "?") + f), delete d.params), this.beforeSend ? (y = (b = Object).assign, g = [{}], [4, this.beforeSend(v, d)]) : [3, 2];
              case 1:
                void 0 !== (m = y.apply(b, g.concat([w.sent()]))).url || void 0 !== m.options ? (v = m.url || v, d = m.options || d) : Object.keys(m).length && (d = m, (null === console || void 0 === console ? void 0 : console.warn) && console.warn("Deprecated format of beforeSend return: please use `return { url, options }`, instead of `return options`.")), w.label = 2;
              case 2:
                return [2, fetch(v, d).then((function (e) {
                  return __awaiter(S, void 0, void 0, (function () {
                    var n;
                    return __generator(this, (function (i) {
                      switch (i.label) {
                        case 0:
                          n = {}, i.label = 1;
                        case 1:
                          return i.trys.push([1, 3, , 4]), [4, e.json()];
                        case 2:
                          return n = i.sent(), [3, 4];
                        case 3:
                          return i.sent(), [3, 4];
                        case 4:
                          return this.afterSend ? [4, this.afterSend(e, n)] : [3, 6];
                        case 5:
                          n = i.sent(), i.label = 6;
                        case 6:
                          if (e.status >= 400) throw new t({url: e.url, status: e.status, data: n});
                          return [2, n]
                      }
                    }))
                  }))
                })).catch((function (e) {
                  throw new t(e)
                }))]
            }
          }))
        }))
      }, Client.prototype.getFileUrl = function (e, t, n) {
        return void 0 === n && (n = {}), this.files.getUrl(e, t, n)
      }, Client.prototype.buildUrl = function (e) {
        var t, n = this.baseUrl;
        return "undefined" == typeof window || !window.location || n.startsWith("https://") || n.startsWith("http://") || (n = (null === (t = window.location.origin) || void 0 === t ? void 0 : t.endsWith("/")) ? window.location.origin.substring(0, window.location.origin.length - 1) : window.location.origin || "", this.baseUrl.startsWith("/") || (n += window.location.pathname || "/", n += n.endsWith("/") ? "" : "/"), n += this.baseUrl), e && (n += n.endsWith("/") ? "" : "/", n += e.startsWith("/") ? e.substring(1) : e), n
      }, Client.prototype.isFormData = function (e) {
        return e && ("FormData" === e.constructor.name || "undefined" != typeof FormData && e instanceof FormData)
      }, Client.prototype.serializeQueryParams = function (e) {
        var t = [];
        for (var n in e) if (null !== e[n]) {
          var i = e[n], o = encodeURIComponent(n);
          if (Array.isArray(i)) for (var r = 0, s = i; r < s.length; r++) {
            var a = s[r];
            t.push(o + "=" + encodeURIComponent(a))
          } else i instanceof Date ? t.push(o + "=" + encodeURIComponent(i.toISOString())) : null !== typeof i && "object" == typeof i ? t.push(o + "=" + encodeURIComponent(JSON.stringify(i))) : t.push(o + "=" + encodeURIComponent(i))
        }
        return t.join("&")
      }, Client
    }();
    export {
      r as Admin,
      p as AdminService,
      a as BaseAuthStore,
      i as BaseModel,
      t as ClientResponseError,
      b as Collection,
      y as CollectionService,
      h as CrudService,
      v as ExternalAuth,
      d as ListResult,
      c as LocalAuthStore,
      g as LogRequest,
      S as LogService,
      w as RealtimeService,
      o as Record,
      f as RecordService,
      m as SchemaField,
      l as SettingsService,
      O as default,
      getTokenPayload,
      isTokenExpired
    };

  }
}
