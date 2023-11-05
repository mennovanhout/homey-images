import Homey from 'homey';

class MyDevice extends Homey.Device {

  async onInit() {
    this.log('MyDevice has been initialized');
  }

}

module.exports = MyDevice;
