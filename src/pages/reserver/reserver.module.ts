import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReserverPage } from './reserver';

@NgModule({
  declarations: [
    ReserverPage,
  ],
  imports: [
    IonicPageModule.forChild(ReserverPage),
  ],
})
export class ReserverPageModule {}
