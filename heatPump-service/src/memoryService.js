class MemoryService {

  statusEnum = {
    ON: 'on',
    OFF: 'off',
    ERROR: 'error'
  };
  #status = this.statusEnum.OFF
  #workingTemperature = 30;

  constructor() {}

  getStatus(){
    return this.#status;
  }

  getWorkingTemperature(){
    return this.#workingTemperature;
  }
  /**
   Sets the new status.
   @param {statusEnum} newStatus - The new status to be set.
   @throws {Error} If the provided status is not a valid statusEnum value.
   */
  setStatus(newStatus){
    this.#status = newStatus;
  }

} export default new MemoryService()
