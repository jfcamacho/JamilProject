// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // Json de configurason para la base de datos firebase
  firebase: {
    projectId: 'ang-proyect',
    appId: '1:130905455709:web:4a4b2a49f6a411cce9e1b4',
    databaseURL: 'https://ang-proyect-default-rtdb.firebaseio.com',
    storageBucket: 'ang-proyect.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyDyVOyi3Yj9s9HVQuURuD_NMeyiYHb1uJQ',
    authDomain: 'ang-proyect.firebaseapp.com',
    messagingSenderId: '130905455709',
  },
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
