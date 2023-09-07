
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

        let differenceTemperature = (this.outsideTemperature - this.insideTemperature) * 0.4;

        if(differenceTemperature < 0.5)
          differenceTemperature = 0.5;

        let variationPercentage =
          (
            (this.insideTemperature < this.outsideTemperature ? 0.1 : -0.1)
            +
            (
              this.insideTemperature < this.outsideTemperature ?
              this.windows.filter(el => el.status === this.statusEnum.ON).length * 0.1 :
              this.windows.filter(el => el.status === this.statusEnum.ON).length * -0.1
            )
            +
            (
              this.insideTemperature < this.outsideTemperature ?
              this.doors.filter(el => el.status === this.statusEnum.ON).length * 0.2 :
              this.doors.filter(el => el.status === this.statusEnum.ON).length * -0.2
            )
          )
        this.insideTemperature += (Math.abs(differenceTemperature) * variationPercentage);
        /*if (this.heatPump?.status === this.statusEnum.ON) {TODO error in logic to rivisit
          this.insideTemperature += this.heatPump.workingTemperature * (() => {
            if(this.heatPump.workingTemperature < this.insideTemperature + 7.5 )
              return 0
            else if(this.heatPump.workingTemperature < this.insideTemperature + 5)
              return 0.02;
            else if(this.heatPump.workingTemperature < this.insideTemperature + 2.5)
                return 0.04;
            else if(this.heatPump.workingTemperature < this.insideTemperature)
              return 0.05;
            else return 0;
          })()
        }*/
      } else {
        this.insideTemperature = this.outsideTemperature + 2; // base case
      }
      return {
        success: true,
        type: 'thermometer',
        payload: {
          value: this.insideTemperature,
          lastScanAt: new Date().toISOString()
        }
      }
    } catch (e) {
      console.log(e)
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