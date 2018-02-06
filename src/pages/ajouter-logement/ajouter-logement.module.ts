import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AjouterLogementPage } from './ajouter-logement';

@NgModule({
  declarations: [
    AjouterLogementPage,
  ],
  imports: [
    IonicPageModule.forChild(AjouterLogementPage),
  ],
})
export class AjouterLogementPageModule {}
