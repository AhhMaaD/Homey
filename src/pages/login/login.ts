import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { ImageServiceProvider } from "./../../providers/image-service/image-service";
import { ModalController } from "ionic-angular/components/modal/modal-controller";
import { LoadingServiceProvider } from "./../../providers/loading-service/loading-service";
import { SignUpPage } from "./../sign-up/sign-up";
import { AlertController } from "ionic-angular/components/alert/alert-controller";
import { AccueilPage } from "./../accueil/accueil";
import { FireBaseDataBaseProvider } from "./../../providers/fire-base-data-base/fire-base-data-base";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  loginForm: FormGroup;
  // user: User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrlService: LoadingServiceProvider,
    public platform: Platform,
    public FireBase_DB: FireBaseDataBaseProvider,
    public modelCtrl: ModalController,
    public image_service: ImageServiceProvider,
    private formBuilder: FormBuilder,
    public alertCtrl: AlertController
  ) {
    this.loginForm = this.formBuilder.group({
      /**
   *       user: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(10),
            Validators.pattern("^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$")
          ])
        ],
   *
   *
   *
   */
      mail: [null, Validators.compose([Validators.required, Validators.email])],
      pass: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(12)
        ])
      ]
    });
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad home");
  }

  signIn() {
    this.loadingCtrlService.showLoading("Veuillez Patienter...");

    this.FireBase_DB.loginUser(
      this.loginForm.value["mail"],
      this.loginForm.value["pass"]
    ).then(a => {
      //ici je vais stocker la donnée d'un user dans un variable en utilisant la fonction getUser
       this.FireBase_DB.getUser()
        .then(us => {
          let user = us;
          console.log("user form signIn() login", user);
          this.navCtrl.setRoot(AccueilPage, { user: user });
          //userId: this.user.userId
        })
        .catch(err => {
          this.loadingCtrlService.alertAdmin(
            "Homey Admin ",
            "veuillez corriger vos données \n" + err
          );
        });
    });

    this.loadingCtrlService.hideLoading();
  }

  //fonction pour inscrire
  verSignUpPage() {
    this.loadingCtrlService.showLoading("Veuillez Patienter...");
    this.navCtrl.push(SignUpPage);
    this.loadingCtrlService.hideLoading();
  }

  //facebook login
  faceBookPass() {
    try {
      this.loadingCtrlService.alertAdmin(
        "Homey Admin",
        "Ca va venir à bientôt"
      );
    } catch (err) {
      console.log(err);
    }
  }

  //fonctions pour récupérer la mote de passe
  recupererPass() {
    //alert("recupererPass()");
    let al = this.alertCtrl.create({
      title: "Récupérer votre compte",
      subTitle: "Entrer votre email pur récupérer votre mote de pass",
      inputs: [
        {
          name: "email",
          placeholder: "votre mail"
        }
      ],
      buttons: [
        {
          text: "Annuler",
          role: "cansel",
          handler: data => {
            alert("Vous avez annulez la récupération de votre compte");
            console.log("Vous avez annulez la récupération de votre compte");
          }
        },
        {
          text: "Valider",
          handler: data => {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var test = re.test(data.email.toLowerCase());
            if (test) {
              console.log(test);
              console.log(data.email);
              this.FireBase_DB.getBass(data.email);
            } else {
              alert(
                "Erreur pendant récupérer votre mote de pass veuillez reessayer."
              );
            }
          }
        }
      ]
    });
    al.present();
  }
}
