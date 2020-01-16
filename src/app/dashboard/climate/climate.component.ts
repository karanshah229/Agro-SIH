import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/services/dashboard/dashboard.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-climate',
  templateUrl: './climate.component.html',
  styleUrls: ['./climate.component.scss']
})
export class ClimateComponent implements OnInit {
  user_polygon: any;
  current_weather: any;
  forecast_weather: any;
  current_soil: any;
  current_uvi: any;
  ndvi_data: any;
  months:string[] = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  days:string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  constructor(
    private dashboardService: DashboardService,
    private afa: AngularFireAuth
  ) { }

  ngOnInit() {
    this.dashboardService.set_polygons().subscribe((polygons) => {
      for(let polygon of polygons){
        if(polygon.name === this.afa.auth.currentUser.uid){
          this.user_polygon = polygon;
          this.getCurrentWeather();
          this.getForecastWeather();
          this.getCurrentSoilData();
          this.getCurrentUVIData();
          break;
        }
      }
    });
  }

  getCurrentWeather(){
    this.dashboardService.get_current_weather(this.user_polygon.id).subscribe(
      (data) => {
        this.current_weather = data;
        console.log(this.current_weather);
      },
      (error) => {
        this.forecast_weather = error;
        console.log(this.current_weather);
      }
    );
  }

  getForecastWeather(){
    this.dashboardService.get_forecast_weather(this.user_polygon.id).subscribe(
      (data) => {
        this.forecast_weather = data.map(data_t => {
          let date = new Date(data_t.dt * 1000);
          data_t["date"] = `${this.days[date.getDay()]} ${date.getDate()} ${this.months[date.getMonth()]} ${date.getFullYear()}`
          data_t["time"] = `${date.getHours()}:00`
          let icon = data_t.weather[0].icon
          data_t.icon = `assets/weather-icons/${icon}.png`
          return data_t
        })
        console.log(this.forecast_weather)
      },
      (error) => {
        this.forecast_weather = error;
        console.log(this.forecast_weather)
      }
    );
  }

  getCurrentSoilData(){
    this.dashboardService.get_current_soil_data(this.user_polygon.id).subscribe(
      (data) => {
        this.current_soil = data;
        console.log(this.current_soil)
      },
      (error) => {
        this.current_soil = error;
        console.log(this.current_soil)
      }
    );
  }

  getCurrentUVIData(){
    this.dashboardService.get_current_uvi_data(this.user_polygon.id).subscribe(
      (data) => {
        this.current_uvi = data;
        console.log(this.current_uvi)
      },
      (error) => {
        this.current_uvi = error;
        console.log(this.current_uvi)
      }
    );
  }

  getNVDIData(){
    this.dashboardService.get_ndvi_data(this.user_polygon.id).subscribe(
      (data) => {
        this.ndvi_data = data;
        console.log(this.ndvi_data)
      },
      (error) => {
        this.ndvi_data = error;
        console.log(this.ndvi_data)
      }
    );
  }

}
