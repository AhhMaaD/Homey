import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import * as firebase from "firebase";
import { User } from "./../../Model/User";
import { Logement } from "./../../Model/Logement";
import "rxjs/add/operator/map";
import { LoadingServiceProvider } from "./../loading-service/loading-service";

@Injectable()
export class FireBaseDataBaseProvider {
  public list_logements = [];
  public listLogementsParVille=[]
  public PhotoURL_user: any;
  public PhotoURL_Logement: any;
  idLogement;
  constructor(public loadingCtrlService: LoadingServiceProvider ) {
    console.log("Hello FireBaseDatabaseProvider Provider");
  }

  //functions pour aller chercher tous les user dans la bases
  listLogemens(): Promise<any> {
    //je vais suivre et surveiller la base en utilisant OBSERVABLE, et je cherche les données les quelles j'aura besoin
    return new Promise(solve => {
      firebase
        .database()
        .ref("logements")
        .orderByKey()
        .once(
          "value",
          (log_items: any) => {
            this.list_logements = [];
            //je remplie ma array avec de ma donnée avec loop
            log_items.forEach(item => {
              this.list_logements.push({
                logementid: item.key,
                surfaceDELogement: item.val().surfaceDELogement,
                descriptionDeLogement: item.val().descriptionDeLogement,
                ville: item.val().ville,
                codePostal: item.val().codePostal,
                adresse: item.val().adresse,
                photoLogement_1: item.val().photoLogement_1,
                photoLogement_2: item.val().photoLogement_2,
                photoLogement_3: item.val().photoLogement_3,
                dateDeAjoute: item.val().dateDeAjoute,
                proprietaire_id: item.val().proprietaire_id,
                disponiblite: item.val().disponiblite
              });
            });
            //gand ça finie je commence avec le deuxieme et comme ce jusqu'a je remplirai ma array avec toutes les données
            solve(this.list_logements);
          },
          err => {
            console.log(
              "Erreure pendant recuprer les données de toutes les users dans la base: ",
              err
            );
            alert(
              "Erreure pendant recuprer les données de toutes les users dans la base: " +
                err
            );
            console.dir(err);
          }
        );
    });
  }

  //function pour supprimeùr un user
  deletUser(id): Promise<any> {
    return new Promise(resolve => {
      let userReference = firebase
        .database()
        .ref("users")
        .child(id);
      userReference.remove();
      resolve(true);
      this.loadingCtrlService.alertAdmin(
        "Homey Admin",
        "Votre compte avait supprimé avec succès"
      );
    }).catch(err => {
      this.loadingCtrlService.alertAdmin(
        "Homey Admin",
        "Ereure pendant supperimer le compte " + err
      );

      console.log("Ereure pendant supperimer le compte " + err);
    });
  }

  //function pour supprimer un logement
  deletLogement(id): Promise<any> {
    return new Promise(resolve => {
      let logementReference = firebase
        .database()
        .ref("logments")
        .child(id);
      logementReference.remove();
      resolve(true);
      this.loadingCtrlService.alertAdmin(
        "Homey Admin",
        "Votre logement avait supprimé avec succès"
      );
    }).catch(err => {
      this.loadingCtrlService.alertAdmin(
        "Homey Admin",
        "Ereure pendant supperimer votre logement " + err
      );
      console.log("Ereure pendant supperimer le logement " + err);
    });
  }

  //function pour modifier le profile un user
  updateUser(id: any, user: User): Promise<any> {
    return new Promise(resolve => {
      let userUpdate = firebase
        .database()
        .ref("users")
        .child(id);
      userUpdate.update(user);
      resolve(true);
      this.loadingCtrlService.alertAdmin(
        "Homey Admin",
        "Votre compte avait modifié avec succès"
      );
    }).catch(err => {
      this.loadingCtrlService.alertAdmin(
        "Homey Admin",
        "Erreure pendant modifer votre profile" + err
      );

      console.log("Erreure pendant modifer votre profile" + err);
    });
  }

  //function pour modifier le profile un logement
  updateLogement(id: any, logement: Logement): Promise<any> {
    return new Promise(resolve => {
      let logementUpdate = firebase
        .database()
        .ref("logements")
        .child(id);
      logementUpdate.update(logement);
      resolve(true);
      this.loadingCtrlService.alertAdmin(
        "Homey Admin",
        "Votre logement avait modifié avec succès"
      );
    }).catch(err => {
      this.loadingCtrlService.alertAdmin(
        "Homey Admin",
        "Erreure pendant modifer votre logement" + err
      );

      console.log("Erreure pendant modifer votre logement" + err);
    });
  }

  //function pour uploder un photo d'user
  uploadImageUser(userImage) {
    //on le donne un nom unique
    let imageUserName: string =
        "user_photo_date_le" + new Date().getTime() + ".jpg",
      storgeReference: any,
      uploadStatue: any;

    // je le dis tu vas la stocke où
    storgeReference = firebase
      .storage()
      .ref("users-Photoes/")
      .child(imageUserName);
    console.log("storgeReference", storgeReference);
    //je la stocke en format base64 in type url
    uploadStatue = storgeReference
      .putString(userImage, "base64", {
        contentType: "image/png"
      })
      .then(enregistrerPic => {
        this.PhotoURL_user = enregistrerPic.downloadURL;
        console.log("myPhotoURL", this.PhotoURL_user);
      })
      .catch(
        err => {
          alert("err pendant uploade votre image" + err);
        },
        success => {
          //alert("err pendant uploade votre image" + success);
        }
      );
    return this.PhotoURL_user;
  }

  //get photoUser
  getPhotoUser() {
    return this.PhotoURL_user;
  }

  //function pour uploder un photo de logement
  uploadImageLogement(logementImage): Promise<any> {
    return new Promise(solve => {
      //on le donne un nom unique
      let imageLogementName: string =
          "logement_photo_date_le" + new Date().getTime() + ".jpg",
        storgeReference: any,
        uploadStatue: any;

      // je le dis tu vas la stocke où
      storgeReference = firebase
        .storage()
        .ref("logements-Photoes/")
        .child(imageLogementName);
      console.log("storgeReference", storgeReference);
      //je la stocke en format base64 in type url
      uploadStatue = storgeReference
        .putString(logementImage, "base64", { contentType: "image/png" })
        .then(enregistrerPic => {
          this.PhotoURL_Logement = enregistrerPic.downloadURL;
          console.log("myPhotoURL", this.PhotoURL_Logement);
        })
        .catch(
          err => {
            alert("err pendant uploade votre image de logement" + err);
          },
          success => {}
        );
      //  return this.PhotoURL_Logement;
      solve(this.PhotoURL_Logement);
    });
  }

  //get photoLogement
  getPhotoLogement() {
    return this.PhotoURL_Logement;
  }

  ///function pour férfier si l'user est exisite ou pas dans la bases
  loginUser(mail: string, passWord: string): Promise<any> {
    return new Promise(solve => {
      firebase
        .auth()
        .signInWithEmailAndPassword(mail, passWord)
        .then(data => {
          this.loadingCtrlService.alertAdmin(
            "Homey Admin ",
            "Bienvenu "
          );

          // console.log(data);
          solve(true);
        })
        .catch(err => {
          this.loadingCtrlService.alertAdmin(
            "Homey Admin ",
            "veuillez corriger vos données \n" + err
          );
        });
    });
  }

  //recupérer profile user
  getUser(): Promise<any> {
    let uid = firebase.auth().currentUser.uid;

    console.log(uid);
    return new Promise(data => {
      firebase
        .database()
        .ref("/users")
        .child(uid)
        .once("value")
        .then(function(userSnapShot) {
          let user: User = {
            userId: uid,
            ville: userSnapShot.val().userVille,
            codePostal: userSnapShot.val().userCodePostal,
            adresse: userSnapShot.val().userAdresse,
            userSex: userSnapShot.val().userSex,
            mail: userSnapShot.val().email,
            passWord: userSnapShot.val().userPassWord,
            userName: userSnapShot.val().userName,
            photoUser: userSnapShot.val().photoUser,
            dateDeNaissance: userSnapShot.val().dateDeNaissance,
            userLogement: userSnapShot.val().userLogement,
            phone: userSnapShot.val().phone
          };
          data(user);
        });
    });
  }

  getUserParSonId(id): Promise<User> {
    return new Promise(data => {
      firebase
        .database()
        .ref("/users")
        .child(id)
        .once("value")
        .then(function(userSnapShot) {
          let user: User = {
            userId: id,
            ville: userSnapShot.val().userVille,
            codePostal: userSnapShot.val().userCodePostal,
            adresse: userSnapShot.val().userAdresse,
            userSex: userSnapShot.val().userSex,
            mail: userSnapShot.val().mail,
            passWord: userSnapShot.val().userPassWord,
            userName: userSnapShot.val().userName,
            photoUser: userSnapShot.val().photoUser,
            dateDeNaissance: userSnapShot.val().dateDeNaissance,
            userLogement: userSnapShot.val().userLogement,
            phone: userSnapShot.val().phone
          };
          data(user);
        });
    });
  }
  //d user
  getIdUser() {
    return firebase.auth().currentUser.uid;
  }

  //fonction pour créer un logement
  createLogement(logement: Logement) {
    this.idLogement =
      new Date().getTime() + "homey" + new Date().getMilliseconds();
    console.log("idLogement", this.idLogement);
    firebase
      .database()
      .ref("logements")
      .child(this.idLogement)
      .set({
        logementid: this.idLogement,
        surfaceDELogement: logement.surfaceDELogement,
        descriptionDeLogement: logement.descriptionDeLogement,
        photoLogement_1: logement.photoLogement_1,
        photoLogement_2: logement.photoLogement_2,
        photoLogement_3: logement.photoLogement_3,
        ville: logement.ville,
        codePostal: logement.codePostal,
        adresse: logement.adresse,
        proprietaire_id: logement.proprietaire_id,
        dateDeAjoute: logement.dateDeAjoute
      })
      .then(a => {
        this.loadingCtrlService.alertAdmin(
          "Homey Admin ",
          "Votre Logement est bien enregistré"
        );
      })
      .catch(err => {
        this.loadingCtrlService.alertAdmin(
          "Homey Admin ",
          "veuillez corriger vos informations \n" + err
        );
      });
  }

  //fonction pour récupérer l'id de derniere logement etaait creé pae l'user
  getDerniereIDLogement() {
    return this.idLogement;
  }

  //function get logement par rapport un user en utilisant sa id
  getLogement(idlog): Promise<any> {
    return new Promise(solve => {
      firebase
        .database()
        .ref("logements")
        .child(idlog)
        .once("value")
        .then(dataSnapshot => {
          let _logement: Logement = {
            proprietaire_id: dataSnapshot.val().proprietaire_id,
            descriptionDeLogement: dataSnapshot.val().descriptionDeLogement,
            ville: dataSnapshot.val().ville,
            codePostal: dataSnapshot.val().codePostal,
            adresse: dataSnapshot.val().adresse,
            surfaceDELogement: dataSnapshot.val().surfaceDELogement,
            photoLogement_1: dataSnapshot.val().photoLogement_1,
            photoLogement_2: dataSnapshot.val().photoLogement_2,
            photoLogement_3: dataSnapshot.val().photoLogement_3,
            dateDeAjoute: dataSnapshot.val().dateDeAjoute
          };
          solve(_logement);
          // Promise.resolve(_logement);
        })
        .catch(err => {
          console.log("err pendant recuperer le logement", err);
        });
    });
  }

  //get id logement par rapport un seul user
  getIDLogementForThisUser(idUser): Promise<any> {
    return new Promise(solve => {
      firebase
        .database()
        .ref("users")
        .child(idUser)
        .child("userLogement")
        .once("value", callBack => {
          solve(callBack.val());

          console.log("solve(getIDLogementForThisUser(idUser)", callBack.val());
        });
    }).catch(err => {
      console.log("err en fonction getIDLogementForThisUser ", err);
    });
  }

  //function pour créer un user il faut savoir que fairebase ne stocke pas les informations des users il stocke seulement la meudule de connexion,
  // pour cela il faudra on la faire mainullement
  //grace à ca on crée le profile
  signUpUser(user: User): Promise<any> {
    //la function createUserWithEmailAndPassword il crée un user et il le signin automatique
    return new Promise(resolve => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.mail, user.passWord)
        .then(newUser => {
          firebase
            .database()
            .ref("/users")
            .child(newUser.uid)
            .set({
              userId: newUser.uid,
              email: user.mail,
              userName: user.userName,
              userPassWord: user.passWord,
              userVille: user.ville,
              userCodePostal: user.codePostal,
              userAdresse: user.adresse,
              photoUser: user.photoUser,
              dateDeNaissance: user.dateDeNaissance,
              userSex: user.userSex,
              phone: user.phone,
              userLogement: -1
            });
          resolve(true);
          this.loadingCtrlService.alertAdmin(
            "Homey Admin ",
            "Votre compte est bien crée Bienvenu " + user.userName
          );
        })
        .catch(err => {
          this.loadingCtrlService.alertAdmin(
            "Homey Admin ",
            "veuillez corriger vos données \n" + err
          );
        });
    });
  }
  //fonction pour couper la conexion avec la base par rapport l'user
  logout() {
    firebase
      .auth()
      .signOut()
      .catch(err => {
        console.log("err en fonction logOut en fire_base_service", err.message);
      });
  }

  ///function pour récupérer la mote de bass
  getBass(mail: string) {
    firebase
      .auth()
      .sendPasswordResetEmail(mail)
      .then(a => {
        this.loadingCtrlService.alertAdmin(
          "Homey Admin",
          "J'ai vous envoyé un email pour récuprérer votre mote de pass"
        );
      })
      .catch(err => {
        this.loadingCtrlService.alertAdmin(
          "Homey Admin",
          "Erreur pendant récupérer le mote de pass " + err
        );
        console.log(
          "err pendant récupérer le mote de pass en fonction getBass en firebaseService",
          err
        );
      });
  }

  //pour modifier la disposbilité d'un logement
  modifierDisponibilite(id, disponiblite) {
    //this.user_valid.userLogement

    let a = firebase
      .database()
      .ref("logements/")
      .child(id)
      .child("disponiblite");
    a.set(disponiblite);
  }

  rechercherParVille(ville): Promise<any> {
    this.listLogementsParVille= [];
    //je vais suivre et surveiller la base en utilisant OBSERVABLE, et je cherche les données les quelles j'aura besoin
return new Promise(solve => {
  firebase
    .database()
    .ref("logements")
    .orderByValue()
    .once(
      "value",
      (log_items: any) => {

        //je remplie ma array avec de ma donnée avec loop
        log_items.forEach(item => {

          if(item.val().ville == ville){
            console.log('item.val().ville', item.val().ville);
            console.log('ville', ville)

            this.listLogementsParVille.push({
            logementid: item.key,
            surfaceDELogement: item.val().surfaceDELogement,
            descriptionDeLogement: item.val().descriptionDeLogement,
            ville: item.val().ville,
            codePostal: item.val().codePostal,
            adresse: item.val().adresse,
            photoLogement_1: item.val().photoLogement_1,
            photoLogement_2: item.val().photoLogement_2,
            photoLogement_3: item.val().photoLogement_3,
            dateDeAjoute: item.val().dateDeAjoute,
            proprietaire_id: item.val().proprietaire_id,
            disponiblite: item.val().disponiblite
          });
        }
        });
        //gand ça finie je commence avec le deuxieme et comme ce jusqu'a je remplirai ma array avec toutes les données
        solve(this.listLogementsParVille);
        console.log('list_logementsParville',this.listLogementsParVille);

      },
      err => {
        console.log(
          "Erreure pendant recuprer les données de toutes les users dans la base: ",
          err
        );
        alert(
          "Erreure pendant recuprer les données de toutes les users dans la base: " +
            err
        );
        console.dir(err);
      }
    );
});
  }


  getAuthenticatedUser() {
    //return this.auth.authState;
    }

}
