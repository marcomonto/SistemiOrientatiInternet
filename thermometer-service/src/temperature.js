class Temperature {

  windows;
  door;
  heatPump;
  outsideTemperature;
  insideTemperature;

  constructor() {
    this.windows = [];
    this.doors = [];
    this.heatPump = null;
    this.outsideTemperature = null;
    this.insideTemperature = null;
  }

  calcTemperature() {
    if (!this.outsideTemperature)
      return
    if (this.outsideTemperature) {
      if (this.insideTemperature != null) {
        this.insideTemperature *= 
        (
          this.insideTemperature < this.outsideTemperature ? 0.1 : -0.1 
          + this.insideTemperature < this.outsideTemperature ? this.windows.filter(el => el.status == statusEnum.ON).length * 0.1 : this.windows.filter(el => el.status == statusEnum.ON).length * -0.1
          + this.insideTemperature < this.outsideTemperature ? this.doors.filter(el => el.status == statusEnum.ON).length * 0.2 : this.doors.filter(el => el.status == statusEnum.ON).length * -0.2
        )
        if(this.heatPump?.status == statusEnum.ON && this.heatPump.temperature > this.insideTemperature){
          this.insideTemperature += (this.heatPump.temperature - this.insideTemperature) * 0.3
        }
      }
      else this.insideTemperature = this.outsideTemperature - 2; // base case
    }
  }
} export default new Temperature()

class Window {
  status;

  constructor(status) {
    this._status = statusEnum.OFF
  }
}
class Door {
  status;

  constructor(status) {
    this._status = statusEnum.OFF
  }
}
class HeatPump {
  status;
  temperature;

  constructor(status) {
    this._status = statusEnum.OFF
  }
}
const statusEnum = {
  ON: 'on',
  OFF: 'off',
  ERROR: 'error'
};