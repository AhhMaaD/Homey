import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { User } from "./../../Model/User";
import { MenuController } from "ionic-angular";
import { ModifierLogementPage } from "./../modifier-logement/modifier-logement";
import { ModifierProfilPage } from "./../modifier-profil/modifier-profil";
import { AjouterLogementPage } from "./../ajouter-logement/ajouter-logement";
import { Logement } from "./../../Model/Logement";
import { LogementProfilePage } from "./../logement-profile/logement-profile";
import { LoadingServiceProvider } from "./../../providers/loading-service/loading-service";
import { FireBaseDataBaseProvider } from "./../../providers/fire-base-data-base/fire-base-data-base";
import { ImageServiceProvider } from "./../../providers/image-service/image-service";
import { LoginPage } from "./../login/login";

@IonicPage()
@Component({ selector: "page-profil", templateUrl: "profil.html" })
export class ProfilPage {
  user_valid: User;
  openMenu = false;
  logement_valid: Logement;
  imagesLogement = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public loadingCtrlService: LoadingServiceProvider,
    public fireBaseDataBase: FireBaseDataBaseProvider,
    public image_service: ImageServiceProvider
  ) {
    this.user_valid = this.navParams.get("user");
    this.logement_valid = this.navParams.get("logement");
    console.log("this.user_valid from profil.ts", this.user_valid);
    console.log("this.logement_valid from profil.ts", this.logement_valid);
    //on fait le test pour savoir si l'user a un logement ou pas
    this.hasLogement();
    console.log(this.hasLogement());
  }

  async getUser_Sync() {
    return await this.fireBaseDataBase.getUser();
  }
  async getLog_Sync() {
    return await this.fireBaseDataBase.getLogement(this.user_valid.userLogement);
  }
  togglePopupMenu() {
    console.log(" togglePopupMenu() ");
    return (this.openMenu = !this.openMenu);
  }

  //toujour avec le CALLBACK il faudra faire le syncrone sinon ca va afficher des errour
  async ionViewDidLoad() {
    await this.getUser_Sync().then(a => {
      this.user_valid = a;
    });
    
    await this.getLog_Sync().then(a => {
      this.logement_valid = a;
    });
    await this.photosLogement();
    console.log("accuiel0000 Profil", this.user_valid);
    console.log("ionViewDidLoad ProfilPage");
  }
  verPageModifierLogement() {
    this.navCtrl.push(ModifierLogementPage, {
      user: this.user_valid,
      logement: this.logement_valid
    });
  }
  verPageModifierProfile() {
    this.navCtrl.push(ModifierProfilPage, {
      user: this.user_valid,
      logement: this.logement_valid
    });
  }
  hasLogement() {
    if (this.user_valid.userLogement != -1) {
      return true;
    }
  }
  verAjouterLogement() {
    this.navCtrl.push(AjouterLogementPage, {
      user: this.user_valid,
      logement: this.logement_valid
    });
  }
  verLogementProfil() {
    this.navCtrl.push(LogementProfilePage, {
      logement: this.logement_valid,
      user: this.user_valid
    });
  }   
  signOut() {
    this.loadingCtrlService.showLoading("A bientôt...");
    this.fireBaseDataBase.logout();
    this.navCtrl.setRoot(LoginPage);
    console.log("Bye Bye");

    this.loadingCtrlService.hideLoading();
  }

  //view des photes d'un logement
  photosLogement() {
    if (this.hasLogement()) {
      this.imagesLogement.push(this.logement_valid.photoLogement_1);
      this.imagesLogement.push(this.logement_valid.photoLogement_2);
      this.imagesLogement.push(this.logement_valid.photoLogement_3);
    }
    console.log("imagesLogement", this.imagesLogement);
  }

  //supprimer le profille
  supprimerUser() {
    this.fireBaseDataBase
      .deletUser(this.logement_valid.proprietaire_id)
      .then(a => {
        this.navCtrl.setRoot(LoginPage);
      });
  }
  supprimerLogement() {
    this.fireBaseDataBase
      .deletLogement(this.user_valid.userLogement)
      .then(a => {
        this.navCtrl.setRoot(LoginPage);
      });
  }
}
