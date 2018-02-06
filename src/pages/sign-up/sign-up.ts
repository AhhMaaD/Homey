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
  selector: "page-sign-up",
  templateUrl: "sign-up.html"
})
export class SignUpPage {
  signUpForm: FormGroup;
  imageUser: any;
  //je crée mon user en utilisant les inputs de ma form
  /*    user: User = {
      ville: this.signUpForm.value["ville"],
      codePostal: this.signUpForm.value["codePostal"],
      adresse: this.signUpForm.value["adresse"],
      userSex: this.signUpForm.value["userSex"],
      mail: this.signUpForm.value["mail"],
      passWord: this.signUpForm.value["passWord"],
      userName: this.signUpForm.value["userName"],
      //photoUser: this.signUpForm.value["photoUser"],
      dateDeNaissance: this.signUpForm.value["dateDeNaissance"]
    };  */

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrlService: LoadingServiceProvider,
    public fireBaseDataBase: FireBaseDataBaseProvider,
    public image_service: ImageServiceProvider,
    private formBuilder: FormBuilder
  ) {
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
      //   photoUser: [null, Validators.compose([Validators.nullValidator])],
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

   signUp() {
    this.loadingCtrlService.showLoading("Veuillez patienter!");

    let user: User = {
      ville: this.signUpForm.value["ville"],
      codePostal: this.signUpForm.value["codePostal"],
      adresse: this.signUpForm.value["adresse"],
      userSex: this.signUpForm.value["userSex"],
      mail: this.signUpForm.value["mail"],
      passWord: this.signUpForm.value["passWord"],
      userName: this.signUpForm.value["userName"],
      photoUser: this.fireBaseDataBase.getPhotoUser(),
      phone: this.signUpForm.value["phone"],
      dateDeNaissance: this.signUpForm.value["dateDeNaissance"],
      userLogement:-1
    };
    //je le stocke dans ma bases
    let a= this.fireBaseDataBase.signUpUser(user);

     a.then(a => {
      //let id =  this.fireBaseDataBase.getIdUser();
        //je le derige ver page l'accueil
        this.navCtrl.setRoot(AccueilPage, {
          user: user
        });

      //  console.log("image user form signUp", this.imageUser);
    }).catch(err =>{
      console.log('err en function signUp en singup.ts',err)
    })
    this.loadingCtrlService.hideLoading();
  }
}
