import PocketBase from 'pocketbase';
import fetch from "node-fetch";
import memoryService from "./memoryService.js";

export default class DatabaseHandler {

  #url;
  #username;
  #password;
  #pb;

  constructor(url, username, password) {
    this.#url = url;
    this.#username = username;
    this.#password = password;
  }

  async connect() {
    try{
      globalThis.fetch = fetch
      this.#pb = new PocketBase(this.#url);
      await this.#pb.admins.authWithPassword(this.#username, this.#password);
    }
    catch (e){
      throw Error('CANT CONNECT TO DATABASE')
    }
  }

  async get(collection, filters) {
    try {
      if (!filters) {
        let response = await this.#pb.collection(collection).getFullList();
        return {
          success: true,
          payload: response
        }
      }
    } catch (e) {
      console.log(e)
      return [];
    }
  }

  async store(collection, data){
    try {
      const record = await this.#pb.collection(collection).create(data);
      return {
        success: true,
        payload: record
      }
    }
    catch (e) {
      return {
        success: false
      }
    }
  }

}
