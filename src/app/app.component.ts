import { Component, ViewChild } from "@angular/core";
import { Platform, NavController } from "ionic-angular";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from "firebase";
import { LoginPage } from './../pages/login/login';
import { AccueilPage } from './../pages/accueil/accueil';
import { FireBaseDataBaseProvider } from './../providers/fire-base-data-base/fire-base-data-base';
@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild("myNav") nav: NavController;
  rootPage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public fireBaseDataBaseProvider: FireBaseDataBaseProvider
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

  firebase.auth().onAuthStateChanged(userState => {
    console.log(userState);
    if (userState) {
      this.nav.setRoot(AccueilPage);
    } else {
      this.nav.setRoot(LoginPage);
    }
  });
  }
}

