import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/services/dashboard/dashboard.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  user_polygon: any;
  current_weather: any;
  forecast_weather: any;
  current_soil: any;
  current_uvi: any;
  ndvi_data: any;

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
        this.forecast_weather = data;
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
