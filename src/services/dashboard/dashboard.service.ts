import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  set_polygons(): Observable<any>{
    return this.http.get<any>(`http://api.agromonitoring.com/agro/1.0/polygons?appid=${environment.appid}`)
  }

  get_current_weather(user_polygon_id): Observable<any>{
    return this.http.get(`http://api.agromonitoring.com/agro/1.0/weather?polyid=${user_polygon_id}&appid=${environment.appid}`);
  }

  get_forecast_weather(user_polygon_id): Observable<any>{
    return this.http.get(`http://api.agromonitoring.com/agro/1.0/weather/forecast?polyid=${user_polygon_id}&appid=${environment.appid}`)
  }

  get_current_soil_data(user_polygon_id): Observable<any>{
    return this.http.get(`http://api.agromonitoring.com/agro/1.0/soil?polyid=${user_polygon_id}&appid=${environment.appid}`)
  }

  get_current_uvi_data(user_polygon_id): Observable<any>{
    return this.http.get(`http://api.agromonitoring.com/agro/1.0/uvi?polyid=${user_polygon_id}&appid=${environment.appid}`)
  }

  get_ndvi_data(user_polygon_id): Observable<any>{
    var oneYearBefore = new Date();
    oneYearBefore.setFullYear(oneYearBefore.getFullYear() - 1);

    return this.http.get(`https://api.agromonitoring.com/agro/1.0/ndvi/history?polyid=${user_polygon_id}&start=${parseInt((oneYearBefore.getTime() / 1000).toFixed(0))}&end=${parseInt((new Date().getTime() / 1000).toFixed(0))}&appid=${environment.appid}`)
  }

}
