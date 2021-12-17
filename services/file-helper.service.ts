import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

export const IMAGE_PATH = 'stored-images';
export interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileHelperService {

  images: LocalFile[] = [];

  constructor() { }

  // Create a new file from a capture image
  async saveFile({ filenameWithExtension, base64Data}:
    {filenameWithExtension: string; base64Data: string}) {

    const savedFile = await Filesystem.writeFile({
        path: `${IMAGE_PATH}/${filenameWithExtension}`,
        data: base64Data,
        directory: Directory.Data,
        recursive: true
    });
  }

  async deleteFile(file: LocalFile): Promise<void> {
    await Filesystem.deleteFile({
      path: file.path,
      directory: Directory.Data,
    });
  }

  async loadPhotos() {
    this.images = [];

    Filesystem.readdir({
      path: IMAGE_PATH,
      directory: Directory.Data,
    }).then(result => {
      this.loadFileData(result.files);
    },
      async (err) => {
        // Folder does not yet exists!
        await Filesystem.mkdir({
          path: IMAGE_PATH,
          directory: Directory.Data,
        });
      }
    ).then(_ => {
    });
  }

  // Get the actual base64 data of an image
  // base on the name of the file
  async loadFileData(fileNames: string[]) {
    for (let f of fileNames) {
      const filePath = `${IMAGE_PATH}/${f}`;

      const readFile = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Data,
      });

      this.images.push({
        name: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`,
      });
    }
  }
}
