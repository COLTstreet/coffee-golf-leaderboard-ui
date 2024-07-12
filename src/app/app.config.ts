import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAnalytics, provideAnalytics, ScreenTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'coffeegolf-b5766',
        appId: '1:267244497737:web:35d168ea0b309820384898',
        storageBucket: 'coffeegolf-b5766.appspot.com',
        apiKey: 'AIzaSyAwvvtqKQ1o5uPNqmfH2u_nurDwEC9Vovs',
        authDomain: 'coffeegolf-b5766.firebaseapp.com',
        messagingSenderId: '267244497737',
        measurementId: 'G-3FC4KPCE3V',
      })
    ),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    provideFirestore(() => getFirestore()),
  ],
};
