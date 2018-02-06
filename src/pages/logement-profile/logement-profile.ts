import { PhotoViewer } from '@ionic-native/photo-viewer';
import { ReserverPage } from './../reserver/reserver';
import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams,Slides } from "ionic-angular";
import { User } from "./../../Model/User";
import { ModifierLogementPage } from "./../modifier-logement/modifier-logement";
import { ModifierProfilPage } from "./../modifier-profil/modifier-profil";
import { AjouterLogementPage } from "./../ajouter-logement/ajouter-logement";
import { Logement } from "./../../Model/Logement";
import { LoadingServiceProvider } from "./../../providers/loading-service/loading-service";
import { FireBaseDataBaseProvider } from "./../../providers/fire-base-data-base/fire-base-data-base";
import { ImageServiceProvider } from "./../../providers/image-service/image-service";


@IonicPage()
@Component({
  selector: "page-logement-profile",
  templateUrl: "logement-profile.html"
})
export class LogementProfilePage {

  disponibilite;
  user_valid: User;
  logement_valid: Logement;
  imagesLogement = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrlService: LoadingServiceProvider,
    public fireBaseDataBase: FireBaseDataBaseProvider,
    public image_service: ImageServiceProvider,
    private photoViewer: PhotoViewer
  ) {

   
    this.user_valid = this.navParams.get("user");
    this.logement_valid = this.navParams.get("logement");
    console.log("this.user_valid from profil.ts", this.user_valid);
    console.log("this.logement_valid from profil.ts", this.logement_valid);
    //on fait le test pour savoir si l'user a ce logement comme ce il pourra le modifier
    this.hasLogement();
    console.log(this.hasLogement());

  }

  getUser_Sync() {
    return this.fireBaseDataBase.getUser();
  }


  //toujour avec le CALLBACK il faudra faire le syncrone sinon ca va afficher des errour
  async ionViewDidLoad() {
    await this.getUser_Sync().then(a => {
      this.user_valid = a;
    });
    await this.photosLogement();
    console.log("accuiel0000 Profil", this.user_valid);
    console.log("ionViewDidLoad ProfilPage");
  }
//test pour savoir si l'useer currant est le propriataire de ce logement
  hasLogement() {
    if (
      this.fireBaseDataBase.getIdUser() == this.logement_valid.proprietaire_id
    ) {
      return true;
    }
  }
//test pour savoir si le logement est disponible
  logementDisponibilite(){
    if(this.logement_valid.disponiblite = true){ 
      return  true;
    }
  }

  //view des photes d'un logement
  photosLogement() {
    this.imagesLogement.push( this.logement_valid.photoLogement_1);
    this.imagesLogement.push(this.logement_valid.photoLogement_2);
    this.imagesLogement.push(this.logement_valid.photoLogement_3);
    console.log("imagesLogement", this.imagesLogement);


  }

  //pour reserver envoyer an mail 
  reserver(){
    console.log('reserver');
    this.navCtrl.push(ReserverPage,{
      user:this.user_valid,
      logement:this.logement_valid
    })
  }
  //pour afficher les image en plien ecrain
  zoomImage(imageData) {
    this.photoViewer.show(imageData);
}

modifierDisponibilite(){
//this.user_valid.userLogement

this.fireBaseDataBase.modifierDisponibilite(this.user_valid.userLogement,this.disponibilite)
this.loadingCtrlService.alertAdmin('Homey Admin','La disponibilité de votre logement a changé avec succès');
}

}
