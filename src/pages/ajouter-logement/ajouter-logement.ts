import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { LoadingServiceProvider } from "./../../providers/loading-service/loading-service";
import { ImageServiceProvider } from "./../../providers/image-service/image-service";
import { Logement } from "./../../Model/Logement";
import { User } from "./../../Model/User";
import { AccueilPage } from "./../accueil/accueil";
import { FireBaseDataBaseProvider } from "../../providers/fire-base-data-base/fire-base-data-base";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { ProfilPage } from "./../profil/profil";


@IonicPage()
@Component({
  selector: "page-ajouter-logement",
  templateUrl: "ajouter-logement.html"
})
export class AjouterLogementPage {
  addLogForm: FormGroup;
  imageLogement: any;   
  logImage1 = -1;
  logImage2 = -1;
  logImage3 = -1;
  proprietaire_id;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrlService: LoadingServiceProvider,
    public fireBaseDataBase: FireBaseDataBaseProvider,
    public image_service: ImageServiceProvider,
    private formBuilder: FormBuilder
  ) {
    this.addLogForm = formBuilder.group({
      descriptionDeLogement: [null, Validators.compose([Validators.required])],
      ville: [null, Validators.compose([Validators.required])],
      codePostal: [null, Validators.compose([Validators.required])],
      adresse: [null, Validators.compose([Validators.required])],
      surfaceDELogement: [null, Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AjouterLogementPage");
  }

  //uploa  d la photo ver la cache puor la telecharge en firebase par la suite
  selectPhoto() {
    this.image_service.telechargeImage().then(a => {
      this.imageLogement = a;
      ///je stocke l'image   uploadToFirebase
      this.fireBaseDataBase.uploadImageLogement(this.imageLogement).then(a => {
        //il faut obligatoirement laisser un peu de temps pour récupérer la callback car chaque fois je utilise le meme fonction
        setTimeout(() => {
          if (
            this.logImage1 != this.fireBaseDataBase.getPhotoLogement() &&
            this.logImage1 == -1
          ) {
            this.logImage1 = this.fireBaseDataBase.getPhotoLogement();
            console.log("this.logImage 1", this.logImage1);
          }
        }, 4000);
        setTimeout(() => {
          if (
            this.logImage2 != this.fireBaseDataBase.getPhotoLogement() &&
            this.logImage2 == -1 &&
            this.logImage1 != this.fireBaseDataBase.getPhotoLogement()
          ) {
            this.logImage2 = this.fireBaseDataBase.getPhotoLogement();
            console.log("this.logImage 2", this.logImage2);
          }
        }, 6000);

        setTimeout(() => {
          if (
            this.logImage3 != this.fireBaseDataBase.getPhotoLogement() &&
            this.logImage3 == -1 &&
            this.logImage2 != this.fireBaseDataBase.getPhotoLogement()
          ) {
            this.logImage3 = this.fireBaseDataBase.getPhotoLogement();
            console.log("this.logImage 3", this.logImage3);
          }
        }, 14000);
      });
    });
  }

  creeLogement() {
    this.loadingCtrlService.showLoading("Veuillez patienter!");
    //je stocke la id de l'user
    this.proprietaire_id = this.fireBaseDataBase.getIdUser();
    //je crée le logement
    console.log(
      "this.fireBaseDataBase.getPhotoLogement()",
      this.fireBaseDataBase.getPhotoLogement()
    );
    let _logement: Logement = {
      proprietaire_id: this.proprietaire_id,
      descriptionDeLogement: this.addLogForm.value["descriptionDeLogement"],
      ville: this.addLogForm.value["ville"],
      codePostal: this.addLogForm.value["codePostal"],
      adresse: this.addLogForm.value["adresse"],
      surfaceDELogement: this.addLogForm.value["surfaceDELogement"],
      photoLogement_1: this.logImage1,
      photoLogement_2: this.logImage2,
      photoLogement_3: this.logImage3,
      dateDeAjoute: new Date().toDateString(),
      disponiblite: true
    };
    console.log("this.proprietaire_id", this.proprietaire_id);
    console.log("this.logImage 1", this.logImage1);
    console.log("this.logImage 2", this.logImage2);
    console.log("this.logImage 3", this.logImage3);
    //je le stocke dans ma bases
    //je stocke le logement
    this.fireBaseDataBase.createLogement(_logement);
    //je modifier le meme user en ajoutant l'id de son logement
    this.fireBaseDataBase
      .getUser()
      .then(a => {
        let idLog = this.fireBaseDataBase.getDerniereIDLogement();
        let _user: User = {
          ville: a.ville,
          codePostal: a.codePostal,
          adresse: a.adresse,
          userSex: a.userSex,
          mail: a.mail,
          passWord: a.passWord,
          userName: a.userName,
          photoUser: a.photoUser,
          dateDeNaissance: a.dateDeNaissance,
          userLogement: idLog
        };
        console.log("_user.userId", this.proprietaire_id);
        this.fireBaseDataBase 
          .updateUser(this.proprietaire_id, _user)
          .then(er => {
            //je le derige ver page profil
            console.log("_logement from ajouter logement", _logement);
            this.navCtrl.setRoot(AccueilPage, {
              user: _user,
              logement: _logement
            });
          });
      })
      .catch(err => {
        console.log("err pendant create voutre logement ", err);
      });

    this.loadingCtrlService.hideLoading();
  }
}
