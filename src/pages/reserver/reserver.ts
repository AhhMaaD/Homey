import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { AccueilPage } from './../accueil/accueil';
import { Logement } from "./../../Model/Logement";
import { User } from "./../../Model/User";
import { ImageServiceProvider } from "./../../providers/image-service/image-service";
import { FireBaseDataBaseProvider } from "./../../providers/fire-base-data-base/fire-base-data-base";
import { LoadingServiceProvider } from "./../../providers/loading-service/loading-service";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";

//femail
import { EmailComposer } from "@ionic-native/email-composer";

@IonicPage()
@Component({
  selector: "page-reserver",
  templateUrl: "reserver.html"
})
export class ReserverPage {
  public Form: FormGroup;
  _attachment: "../assets/imgs/back.png";
  user_valide: User;
  user_proprite;
  logement_valide: Logement;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrlService: LoadingServiceProvider,
    public fireBaseDataBase: FireBaseDataBaseProvider,
    public image_service: ImageServiceProvider,
    private _EMAIL: EmailComposer,
    private _FORM: FormBuilder,
    public alertCtrl: AlertController
  ) {
    this.Form = this._FORM.group({
      to: ['', Validators.compose([Validators.required, Validators.email])],
      phone:  ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      nomUser: ["", Validators.required],
      subject: ["", Validators.required],
      message: ["", Validators.required]
    });

    this.user_valide = navParams.get("user");
    console.log("this.user_valide from ReserverPage", this.user_valide);
    this.logement_valide = navParams.get("logement");
    console.log("this.logement_valide from ReserverPage", this.logement_valide);
    this.showContract();
    this.ionViewDidLoad();
  }

  getPropritaire_async() {
    return this.fireBaseDataBase.getUserParSonId(
      this.logement_valide.proprietaire_id
    );
  }

  async ionViewDidLoad() {
    console.log("ionViewDidLoad ReserverPage");
    let a = this.getPropritaire_async();
    await a.then(a => {
      this.user_proprite = a;
      console.log("this.user_proprite from ReserverPage 2", a);
    });
    console.log("this.user_proprite from ReserverPage", this.user_proprite);
  }

  sendEmail(
    to: string,
    cc: string,
    bcc: string,
    attachment: string,
    subject: string,
    message: string
  ): void {
    this._EMAIL
      .isAvailable()
      .then((available: boolean) => {
            let email = {
              app: "mailto",
              to: to,
              cc: '',
              bcc: '',
              attachments: [attachment],
              subject: subject,
              body: message
            };
            this._EMAIL.open(email);

      })
      .catch((error: any) => {
        console.log("User does not appear to have device e-mail account");
        console.dir(error);
      });
  }

  sendMessage(): void {
    this.loadingCtrlService.showLoading('Veuillez Patienter...')
    let to: string = this.Form.controls["to"].value,
      cc: string = '',
      bcc: string = '',
      subject: string = this.Form.controls["subject"].value,
      message: string = this.Form.controls["message"].value;

    this.sendEmail(to, cc, bcc, this._attachment, subject, message);
    this.loadingCtrlService.alertAdmin('Homey Admin','Votre message a bien envoyé');
    this.navCtrl.setRoot(AccueilPage, {
      user:this.user_valide
    });
    this.loadingCtrlService.hideLoading();
  }


  showContract(){
      //alert("recupererPass()");
      let al = this.alertCtrl.create({
        title: "Contrat de hébergement",
        subTitle: `Selon la charte juridique de Homey, vous êtes hebergé à titre gratuit, et vous engagez à respecter le contrat entre vous et le propritaire.
        Selon le contract le propritaire aura le droit d'être heberger chez vous quand il aura besoin, et la période d'herbergement sera equivalent à votre période de loger chez lui.
        Il est possible que nous modifiions la présente Charte de confidentialité en temps utile et vous conseillons donc de consulter cette page régulièrement afin de rester informé.`,
        inputs: [
          {

            placeholder: `${this.user_valide.userName}`
          }
        ],
        buttons: [

          {
            text: "Lu et conformer et je signe",
            handler: data => {
              console.log(data);
            }
          }
        ]
      });
      al.present();
    }




    veraccueil(){
      this.navCtrl.setRoot(AccueilPage,{
        user:this.user_valide
      })
    }

}
