import { FileHelperService, LocalFile } from './../../services/file-helper.service';
import { CameraHelperService } from './../../services/camera-helper.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sandbox-camera',
  templateUrl: './sandbox-camera.page.html',
  styleUrls: ['./sandbox-camera.page.scss'],
})
export class SandboxCameraPage implements OnInit {

  images: LocalFile[] = [];

  constructor(
    private cameraHelper: CameraHelperService,
    private fileHelper: FileHelperService) {}

  ngOnInit(): void {
    this.loadPhotos();
  }

  loadPhotos(): void {
    this.fileHelper.loadPhotos()
    .then(() => {
      this.images = this.fileHelper.images;
    });
  }

  takePicture() {
    this.cameraHelper.takePicture();
  }

  deletePhoto(file: LocalFile) {
    this.fileHelper.deleteFile(file)
    .then(() => {
      this.images = this.images.filter(f => f !== file);
    });
  }

  trackFilePath(index, photo: LocalFile) { return photo.path; }
}
