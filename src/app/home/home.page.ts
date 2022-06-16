/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable object-shorthand */
import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@awesome-cordova-plugins/image-picker/ngx';
import { Crop, CropOptions } from '@ionic-native/crop/ngx';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { File, FileEntry } from '@awesome-cordova-plugins/file/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { Http } from '@angular/http';
// import {Http} from '@angular/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  imageurl: any;
  securepath: any = window;
  url: any;

  imageOptions: CropOptions ={
    quality: 80,
    targetWidth: -1,
    targetHeight: -1
  };

  constructor(private actionsheet: ActionSheetController,
    private camera: Camera, private file: File, private http: Http,
    private loading: LoadingController,
    private imagepicker: ImagePicker, private crop: Crop, private domsanitize: DomSanitizer) {}


  chooseFromCamera(sourceType){
    const options: CameraOptions = {
       quality: 100,
       mediaType: this.camera.MediaType.PICTURE,
       destinationType: this.camera.DestinationType.FILE_URI,
       encodingType: this.camera.EncodingType.JPEG,
       sourceType: sourceType,
    };

    this.camera.getPicture(options).then((result) => {
      console.log('Camera URL',result);
      // this.imageurl = result;
      this.imageurl = this.securepath.Ionic.WebView.convertFileSrc(result);
         if(result.hasPermission !== false){
           this.cropimage(result);
         }
    }, error=>{
      console.log('Error CAMERA', error);
    });
  }

  santizeUrl(imageUrl){
    return this.domsanitize.bypassSecurityTrustUrl(imageUrl);
  }

  pickImagesFromLibrary(){
    const options: ImagePickerOptions = {
      quality: 100,
      maximumImagesCount: 1,
    };
    this.imagepicker.getPictures(options).then((imageresult)=> {
    console.log('image Picker Results', imageresult);

     for(let i=0; i<imageresult.length; i++){
      this.url = this.securepath.Ionic.WebView.convertFileSrc(imageresult[i]);
     }
    }, rror=>{
      console.log('Image Picker Error:', rror);
    });
  }

 async selectimageOptions(){
    const actionsheet = await this.actionsheet.create({
     header: 'Select image Source',
     buttons: [
       {
         text: 'Load from Gallery',
         handler: ()=>{
           this.pickImagesFromLibrary();
           console.log('Image Selected from Gallery');
         }
       },
       {
         text: 'Select Camera',
         handler: ()=>{
           this.chooseFromCamera(this.camera.PictureSourceType.CAMERA);
           console.log('Camera Selected');
         }
       },
       {
         text: 'Cancel',
         role: 'cancel'
       }
     ]
    });
    await actionsheet.present();
  }

 cropimage(imageurl){
 const img = document.URL.includes(imageurl);
   this.crop.crop(imageurl,   this.imageOptions).then((crop)=>{
    console.log('Cropped Image:', crop);
    console.log('Cropped Image02:', crop.split('?')[0]);
    this.getimagefile(crop);
   },error=>{
     console.log('error croping Image', error);
   });
 }

 getimagefile(imageurl){
  const file = this.file.resolveLocalFilesystemUrl(imageurl).then((entry: FileEntry)=>{
      entry.file((file)=>{
        console.log('return entry File:', file.name);
        this.uploadimageFiletoServer(file);
      }, error=>{
      console.log('error accessing the image entry files', error);
      });
  });
 }


 uploadimageFiletoServer(file){
    const formdata = new FormData();
  const read = new FileReader();
        read.onload = () => {
          const blob = new Blob([read.result],{
            type: file.type
          });
        console.log('fileImage: ',file);
       formdata.append('UPLOADCARE_PUB_KEY','ff144b94384588a4bceb');
       formdata.append('UPLOADCARE_STORE','1');
       formdata.append('name','ImageUpload');
       formdata.append('file',blob,file.name);
      this.http.post('https://upload.uploadcare.com/base/',formdata).subscribe((response) =>{
        const jsonobject  = response.json();
        console.log('UPloadCare Response', jsonobject);
        console.log('UPloadCare Response', jsonobject.file);
        const url = `https://ucarecdn.com/${jsonobject.file}/-/scale_crop/200x200/center`;
        console.log('PATH_URL', url);
      });
        };
      read.readAsArrayBuffer(file);
}

}
