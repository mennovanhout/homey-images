import Homey, { FlowCardAction, Image } from 'homey';

class MyDriver extends Homey.Driver {

  private _setImageCard: FlowCardAction|undefined;
  private _setImageFromUrlCard: FlowCardAction|undefined;

  async onInit() {
    this._setImageCard = this.homey.flow.getActionCard('set-image');
    this._setImageCard.registerRunListener((args, state) => {
      args.device.setCameraImage(args.identifier, args.name, args.droptoken);
    });

    this._setImageFromUrlCard = this.homey.flow.getActionCard('set-image-from-url');
    this._setImageFromUrlCard.registerRunListener(async (args, state) => {
      const imageId = this.homey.settings.get(args.identifier);
      const realImage = await this.getImage(imageId);

      if (realImage) {
        realImage.setUrl(args.url);
        await realImage.update();

        await args.device.setCameraImage(args.identifier, args.name, realImage);
      } else {
        const image = await this.homey.images.createImage();
        image.setUrl(args.url);

        this.homey.settings.set(args.identifier, image.id);

        await args.device.setCameraImage(args.identifier, args.name, image);
      }
    });
  }

  async onPairListDevices() {
    return [
      {
        name: 'Image',
        data: {
          id: this.makeId(12),
        },
      },
    ];
  }

  private async getImage(imageId: string) {
    let realImage: Image|undefined;

    if (!imageId) {
      return undefined;
    }

    try {
      realImage = await this.homey.images.getImage(imageId);
    } catch (error) {
      realImage = undefined;
    }

    return realImage;
  }

  makeId(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

}

module.exports = MyDriver;
