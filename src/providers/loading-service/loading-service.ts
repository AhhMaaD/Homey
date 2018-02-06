import { LoadingController } from "ionic-angular";
import { Injectable } from "@angular/core";
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
@Injectable()
export class LoadingServiceProvider {
  private loading: any;
  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {}

  //function pour afficher un notification de loading
  showLoading(content: string): void {
    this.loading = this.loadingCtrl.create({
      content: content
    });
    this.loading.present();
  }

  //pour le cache
  hideLoading(): void {
    this.loading.dismiss();
  }

  alertAdmin(title:string, subTitle?:string) {
    //alert("recupererPass()");
    let al = this.alertCtrl.create({
      title: `${title}`,
      subTitle: `${subTitle}`,
      buttons: [
        {
          text: `D'accord`,
          handler: data => {
            console.log("Vous avez clickez sur ok");
          }
        }
      ]
    });
    al.present();
  }
}
