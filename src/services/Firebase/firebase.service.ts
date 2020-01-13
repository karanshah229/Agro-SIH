import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private afs: AngularFirestore) { }

  addData(payload: any, collection: string){
    this.afs.collection(collection).add(payload);
  }

}
