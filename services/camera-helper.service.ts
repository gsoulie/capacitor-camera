import { FileHelperService } from './file-helper.service';
import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, PermissionStatus, Photo } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class CameraHelperService {

  constructor(private platform: Platform,
    private fileHelper: FileHelperService) { }

  checkPermissions(): Promise<PermissionStatus> {
    return Camera.checkPermissions();
  }

  requestPermission(): Promise<PermissionStatus> {
    return Camera.requestPermissions();
  }

  async takePicture() {

    this.requestPermission()
    .then(async () => {
      this.checkPermissions()
      .then((permissionsStatus) => {
        if (permissionsStatus.camera === 'denied' ||
            permissionsStatus.photos === 'denied') {
          alert('Camera permissions denied !');
          return;
        }
      });

      const image = await Camera.getPhoto({
        quality: 50,
        source: CameraSource.Camera,
        /*width: '',
          height: '',
          preserveAspectRatio: true,*/
        allowEditing: false,
        resultType: CameraResultType.Uri  //Base64, DataUrl
      });

      // image.webPath will contain a path that can be set as an image src.
      // You can access the original file using image.path, which can be
      // passed to the Filesystem API to read the raw data of the image,
      // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)

      //const imageUrl = image.webPath;

      if (image) {
        this.saveImage(image);
      }
    });
  };

  // Create a new file from a capture image
  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);
    const fileName = new Date().getTime() + '.jpeg';

    this.fileHelper.saveFile({ filenameWithExtension: fileName, base64Data });
  }

  // Helper function
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  // https://ionicframework.com/docs/angular/your-first-app/3-saving-photos
  private async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) { // Smartphone
        const file = await Filesystem.readFile({
            path: photo.path
        });

        return file.data;
    }
    else {
        // Fetch the photo, read as a blob, then convert to base64 format
        const response = await fetch(photo.webPath);
        const blob = await response.blob();

        return await this.convertBlobToBase64(blob) as string;
    }
  }
}
