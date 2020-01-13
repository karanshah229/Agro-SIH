import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  user_polygon: any;

  constructor(
    private http: HttpClient,
    private afa: AngularFireAuth
  ) {
    this.set_polygons();
  }

  get polygon(){
    return this.user_polygon
  }

  set_polygons(){
    this.http.get<any>("http://api.agromonitoring.com/agro/1.0/polygons?appid=613d1afb9e5bdef76ca5b04626254376").subscribe((polygons) => {
      for(let polygon of polygons){
        if(polygon.name === this.afa.auth.currentUser.uid){
          this.user_polygon = polygon; break;
        }
      }
    });
  }

}
