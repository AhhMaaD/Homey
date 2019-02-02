import { ReserverPage } from './../pages/reserver/reserver';
import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
//page
import { MyApp } from "./app.component";
import { LoginPage } from "./../pages/login/login";
import { SignUpPage } from "./../pages/sign-up/sign-up";
import { AccueilPage } from "./../pages/accueil/accueil";
import { ModifierLogementPage } from "./../pages/modifier-logement/modifier-logement";
import { AjouterLogementPage } from "./../pages/ajouter-logement/ajouter-logement";
import { ProfilPage } from "./../pages/profil/profil";
import { ModifierProfilPage } from "./../pages/modifier-profil/modifier-profil";
  import { LogementProfilePage } from "./../pages/logement-profile/logement-profile";
//dataBase
import * as firebase from "firebase";
//provider
import { FireBaseDataBaseProvider } from "./../providers/fire-base-data-base/fire-base-data-base";
import { LoadingServiceProvider } from "../providers/loading-service/loading-service";
import { ImageServiceProvider } from "../providers/image-service/image-service";
import { Camera } from "@ionic-native/camera";
import { PhotoViewer } from "@ionic-native/photo-viewer";


//femail
import { EmailComposer } from '@ionic-native/email-composer';
//firebase
firebase.initializeApp({
  apiKey: "*******************************",
  authDomain: "***********************",
  databaseURL: "********************", 
  projectId: "homey-72",
  storageBucket: "homey-72.appspot.com",
  messagingSenderId: "1030408890214"
});

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignUpPage,
    AccueilPage,
    ModifierLogementPage,
    AjouterLogementPage,
    ProfilPage,
    ModifierProfilPage,
    LogementProfilePage,
    ReserverPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist: true,
      autoFocusAssist: true

      /*   platforms: {
        android: {
          scrollAssist: false,
          autoFocusAssist: false
        } 
      } */
    }),
    FormsModule,
    ReactiveFormsModule,
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignUpPage,
    AccueilPage,
    ModifierLogementPage,
    AjouterLogementPage,
    ProfilPage,
    ModifierProfilPage,
    LogementProfilePage,
    ReserverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    FireBaseDataBaseProvider,
    LoadingServiceProvider,
    ImageServiceProvider,
    Camera,
    PhotoViewer,
    EmailComposer
  ]
})
export class AppModule {}
