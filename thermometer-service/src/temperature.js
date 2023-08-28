export default class Temperature {

  windows;
  doors;
  heatPump;
  /** @type {number} */
  outsideTemperature;
  /** @type {number} */
  insideTemperature;
  serviceTypes = {
    WINDOW: 'window',
    DOOR: 'door',
    HEAT_PUMP: 'heatPump',
    THERMOMETER: 'thermometer',
    WEATHER: 'weather',
    ACTUATOR: 'actuator',
  };
  statusEnum = {
    ON: 'on',
    OFF: 'off',
    ERROR: 'error'
  };

  constructor(activeServices) {
    this.windows = [];
    this.doors = [];
    this.generateParams(activeServices);
  }

  calcTemperature() {
    try {
      if (!this.outsideTemperature)
        return
      if (this.insideTemperature != null) {
        this.insideTemperature *=
          (
            this.insideTemperature < this.outsideTemperature ? 0.1 : -0.1
            + (this.insideTemperature < this.outsideTemperature ?
                this.windows.filter(el => el.status === this.statusEnum.ON).length * 0.1 :
                this.windows.filter(el => el.status === this.statusEnum.ON).length * -0.1)
            + (this.insideTemperature < this.outsideTemperature ?
                this.doors.filter(el => el.status === this.statusEnum.ON).length * 0.2 :
                this.doors.filter(el => el.status === this.statusEnum.ON).length * -0.2)
          )
        if (this.heatPump?.status === this.statusEnum.ON && this.heatPump.value > this.insideTemperature) {
          this.insideTemperature += (this.heatPump.value - this.insideTemperature) * 0.3
        }
      } else {
        this.insideTemperature = this.outsideTemperature + 2; // base case
      }
      console.log({
        success: true,
        value: this.insideTemperature,
        lastScanAt: new Date().toISOString()
      })
      return {
        type: 'thermometer',
        payload: {
          value: this.insideTemperature,
          lastScanAt: new Date().toISOString()
        }
      }
    } catch (e) {
      return {
        success: false
      }
    }
  }

  generateParams(activeServices) {
    for (const service of activeServices) {
      if (service.serviceType === this.serviceTypes.WEATHER) {
        this.outsideTemperature = service.value;
      } else if (service.serviceType === this.serviceTypes.DOOR) {
        this.doors.push(service);
      } else if (service.serviceType === this.serviceTypes.WINDOW) {
        this.windows.push(service);
      } else if (service.serviceType === this.serviceTypes.HEAT_PUMP) {
        this.heatPump = service
      } else if (service.serviceType === this.serviceTypes.THERMOMETER) {
        this.insideTemperature = service.value;
      } else continue;
    }
  }
}