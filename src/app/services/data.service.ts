import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector, WritableSignal, inject, signal } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _http: HttpClient;
  firestore: Firestore = inject(Firestore);

  constructor(public injector: Injector) { 
    this._http = injector.get(HttpClient);
  }

  

  getScoresByDay(date: any): Observable<any> {
    const itemCollection = collection(this.firestore, date)
    return collectionData(itemCollection);
  }
}
