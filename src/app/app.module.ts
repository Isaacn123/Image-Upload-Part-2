import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Http, HttpModule } from '@angular/http';

// import { Http } from '@angular/http';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  File,
  Camera,
  ImagePicker,
  Crop,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
