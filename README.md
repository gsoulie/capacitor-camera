# capacitor-camera

**capacitor-camera usage with permissions requesting**

## Installation

**Documentation**
https://capacitorjs.com/docs/apis/camera      
https://capacitorjs.com/docs/apis/filesystem       

````
npm install @capacitor/camera
npm install @capacitor/filesystem
npx cap sync
````

## Mobile configuration

### Android

*AndroidManifest.xml*
````
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
````

### iOS

*Info.plist*
````
NSCameraUsageDescription (Privacy - Camera Usage Description)
NSPhotoLibraryAddUsageDescription (Privacy - Photo Library Additions Usage Description)
NSPhotoLibraryUsageDescription (Privacy - Photo Library Usage Description)
````
