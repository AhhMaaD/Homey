
import { Injectable } from "@angular/core";
import { Camera, CameraOptions } from "@ionic-native/camera";

@Injectable()
export class ImageServiceProvider {
  public photoTelecharge: string;
  constructor(private camera: Camera) {}

  telechargeImage(): Promise<any> {
    //on crée un nouveaux promis du donnée
    return new Promise(resolve => {
      //on choisit les parametre qui nous intéresses
      let cameraOptions: CameraOptions = {
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY, //on le dis le source de donnée sera la carte de telephone ou galery de  telephone
        destinationType: this.camera.DestinationType.DATA_URL, //ici je le dis on vas stocker les données dans un url
        quality: 100,
        targetHeight: 720,
        targetWidth: 720,
        encodingType: this.camera.EncodingType.PNG, //j'accepte eulement le type jpeg
        correctOrientation: true
      };
      this.camera.getPicture(cameraOptions).then(image => {
        //je le code en formet base 64
           
        this.photoTelecharge = image;

        //resolve comme return mais ici on stocke les resultat final de le Promise après vérifier les erreures
        resolve(this.photoTelecharge);
      });
    });
  } 
}
