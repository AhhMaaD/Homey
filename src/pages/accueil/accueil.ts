import { LogementProfilePage } from './../logement-profile/logement-profile';
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { User } from "./../../Model/User";
import { ProfilPage } from "./../profil/profil";
import { Logement } from "./../../Model/Logement";
import { LoadingServiceProvider } from "./../../providers/loading-service/loading-service";
import { FireBaseDataBaseProvider } from "./../../providers/fire-base-data-base/fire-base-data-base";
import { ImageServiceProvider } from "./../../providers/image-service/image-service";

@IonicPage()
@Component({
  selector: "page-accueil",
  templateUrl: "accueil.html"
})
export class AccueilPage {
  user_valid: User;
  listLogements = [];
  logement_valid: Logement;
  idLogement;
  ville;
  listLogementsParVille = []
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrlService: LoadingServiceProvider,
    public fireBaseDataBase: FireBaseDataBaseProvider,
    public image_service: ImageServiceProvider
  ) {
    this.user_valid = navParams.get("user");
    this.logement_valid = navParams.get("logement");
    console.log('accuiel this.user_valid', this.user_valid);
    console.log('accuiel  this.logement_valid ', this.logement_valid);
    console.log('accuiel this.listLogements', this.listLogements);
    console.log('accuiel listLogementsParVille', this.listLogementsParVille);
  }




  //on crée une fonction pour recuprer les données ensuite on la attend avec await sinon il va afficher error et null come valur
  getidLogement_Sync() {
    return this.fireBaseDataBase.getIDLogementForThisUser(
      this.user_valid.userId
    ).catch(err => {
      console.log(' err in getidLogement_Sync()', err)
    })
  }
  async getLogement_Sync() {
    return this.fireBaseDataBase.getLogement(this.idLogement).catch(err => {
      console.log(' err in  getLogement_Sync()', err)
    })
  }
  async getListLogements_async() {
    return this.fireBaseDataBase.listLogemens();
  }

  async getUser_async() {
    return this.fireBaseDataBase.getUser();
  }
  async ionViewDidLoad() {
    await this.getUser_async().then(a => {
      this.user_valid = a;
    })
    await this.getidLogement_Sync().then(a => {
      this.idLogement = a;
    });
    await this.getLogement_Sync().then(a => {
      this.logement_valid = a;
    });
    await this.getListLogements_async().then(a => {
      this.listLogements = a;
    })


    console.log('accuiel listLogementsParVille', this.listLogementsParVille);
    console.log("ionViewDidLoad AccueilPage");
    //this.getData();
  }

  verProfil() {
    this.navCtrl.push(ProfilPage, {
      user: this.user_valid,
      logement: this.logement_valid
    });
    console.log("idLogement from accuiel**  accuiel", this.idLogement);
    console.log("this.logement_valid **  accuiel", this.logement_valid);
  }


  verLogementProfil(logement) {
    this.navCtrl.push(LogementProfilePage, {
      logement: logement,
      user: this.user_valid
    });
  }

  rechercherEstClick() {
    if (this.ville) {
      return true;
    }
  }
  //rechercherParVille(ville)
  getItems(event) {

    this.ville = event.target.value;
    console.log(' this.ville', this.ville);

    this.rechercherParVille_async();
    this.listLogementsParVille = this.fireBaseDataBase.listLogementsParVille;
    console.log('getItems: this.listLogementsParVille ', this.listLogementsParVille);

  }
  onCancel(event) {
    this.listLogementsParVille = [];
    this.ville = 'event';
  }


  rechercherParVille_async() {
    this.listLogementsParVille = [];
    return this.fireBaseDataBase.rechercherParVille(this.ville);

  }
}
