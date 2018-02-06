import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { LoadingServiceProvider } from "./../../providers/loading-service/loading-service";
import { ImageServiceProvider } from "./../../providers/image-service/image-service";
import { Logement } from "./../../Model/Logement";
import { User } from "./../../Model/User";
import { AccueilPage } from "./../accueil/accueil";
import { FireBaseDataBaseProvider } from "../../providers/fire-base-data-base/fire-base-data-base";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
 

@IonicPage()
@Component({
  selector: "page-modifier-profil",
  templateUrl: "modifier-profil.html"
})
export class ModifierProfilPage {
  signUpForm: FormGroup;
  imageUser: any;
  user_valide: User;
  logement_valide: Logement;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrlService: LoadingServiceProvider,
    public fireBaseDataBase: FireBaseDataBaseProvider,
    public image_service: ImageServiceProvider,
    private formBuilder: FormBuilder
  ) {
    this.user_valide = this.navParams.get("user");
    this.logement_valide = this.navParams.get("logement");

    this.signUpForm = formBuilder.group({
      mail: [null, Validators.compose([Validators.required, Validators.email])],
      passWord: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(12)
        ])
      ],
      ville: [null, Validators.compose([Validators.required])],
      codePostal: [null, Validators.compose([Validators.required])],
      adresse: [null, Validators.compose([Validators.required])],
      userSex: [null, Validators.compose([Validators.required])],
      userName: [null, Validators.compose([Validators.required])],
      phone: [null, Validators.compose([Validators.nullValidator])],
      dateDeNaissance: [null, Validators.compose([Validators.required])]
    });
  }

  //upload la photo ver la cache por la telecharge en firebase par la suite
  selectPhoto() {
    this.image_service.telechargeImage().then(a => {
      this.imageUser = a;
      ///je stocke l'image   uploadToFirebase
      this.fireBaseDataBase.uploadImageUser(this.imageUser);
    });
  }

  upDate() {
    this.loadingCtrlService.showLoading("Veuillez patienter!");

    let _user: User = {
      ville: this.signUpForm.value["ville"],
      codePostal: this.signUpForm.value["codePostal"],
      adresse: this.signUpForm.value["adresse"],
      userSex: this.signUpForm.value["userSex"],
      mail: this.signUpForm.value["mail"],
      passWord: this.signUpForm.value["passWord"],
      userName: this.signUpForm.value["userName"],
      photoUser: this.fireBaseDataBase.getPhotoUser(),
      dateDeNaissance: this.signUpForm.value["dateDeNaissance"],
      userLogement: this.logement_valide.logementid,
      phone: this.signUpForm.value["phone"]
    };
console.log(
  "this.logement_valide.proprietaire_id",
  this.logement_valide.proprietaire_id
);

    //je le stocke dans ma bases
    this.fireBaseDataBase.updateUser(this.logement_valide.proprietaire_id, _user).then(a => {
        //let id =  this.fireBaseDataBase.getIdUser();
        //je le derige ver page l'accueil
        this.navCtrl.setRoot(AccueilPage, {
          user: _user
        });

        //  console.log("image user form signUp", this.imageUser);
      })
      .catch(err => {
        console.log("err en function upDate en modifierUser.ts", err);
      });
    this.loadingCtrlService.hideLoading();
  }
}
