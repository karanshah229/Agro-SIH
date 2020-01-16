/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FirebaseService } from 'src/services/Firebase/firebase.service';
import { MapsAPILoader } from '@agm/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { resolve } from 'url';

@Component({
  selector: 'app-profile-completion',
  templateUrl: './profile-completion.component.html',
  styleUrls: ['./profile-completion.component.scss']
})
export class ProfileCompletionComponent implements OnInit {

  lat: number;
  lng: number;
  soilTypes: string[] = ["Clayey", "Sandy", "Silty", "Peaty", "Chalky", "Loamy", "Silts", "Gravel", "Friable", "Red Grey Yellow Loams", "Black Clay", "Alluvial", "Laterite", "Alkaline", "Saline"];
  polygonAreaInKms:number;
  polygonPoints:any;
  @ViewChild("search", {static: false}) public searchElementRef: ElementRef;

  userID: string;

  profileCompletion: FormGroup;
  profileCompletion_formErrors = {
    lat: '', lng: '',
    soilType: '',
    land_area: '',
    land_area_unit: ''
  };

  profileCompletion_validationMessages = {
    lat: { }, ln: { },
    soilType: {
      required:      'Soil Type is required',
    },
    land_area: {
      required:      'Land area is required',
      max:           'Max land limit reached',
      min:           'Land Area can\'t be less than 0'
    },
    land_area_unit: {
      required:      'Land area unit is required',
    }
  };

  constructor(
    private fb: FormBuilder,
    private firebase: FirebaseService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private snackBar: MatSnackBar,
    private router: Router,
    private afs: AngularFirestore,
    private afa: AngularFireAuth,
    private http: HttpClient
  ) {
    this.afa.user.subscribe((data) => {this.userID = data.uid;});
   }

  ngOnInit() {
    this.create_profileCompletion();
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.profileCompletion.patchValue({location: {lat: this.lat, lng: this.lng}});
      });
    }

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
        });
      });
    });
  }

  create_profileCompletion(){
    this.profileCompletion = this.fb.group({
      userID: [this.userID],
      location: this.fb.group({
        lat: [null, [Validators.required]],
        lng: [null, [Validators.required]],
      }),
      soilType: ['', [Validators.required]],
      land_area: [null, [Validators.required, Validators.min(0), Validators.max(1000000000)]],
      land_area_unit: ['', [Validators.required]]
    });

    this.profileCompletion.valueChanges
        .subscribe(data => this.onValueChanged_profileCompletion(data));
  }

  onValueChanged_profileCompletion(data?: any){
    if (!this.profileCompletion) { return; }
    const form = this.profileCompletion;
    for (const field in this.profileCompletion_formErrors) {
        if (this.profileCompletion_formErrors.hasOwnProperty(field)) {
            // clear previous error messages if any
            this.profileCompletion_formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.profileCompletion_validationMessages[field];
                for (const key in control.errors) {
                    if (control.errors.hasOwnProperty(key)) {
                        this.profileCompletion_formErrors[field] += messages[key] + ' ';
                    }
                }
            }
        }
    }
  }

  chooseLocation(event){
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    this.profileCompletion.patchValue({location: {lat: this.lat, lng: this.lng}});
  }

  land_area:number;
  onSubmit() {
    //Send data to FireBase
    this.firebase.addData(this.profileCompletion.value, 'profileCompletion');
    this.land_area = this.profileCompletion.value['land_area'];

    //Calculate Polygon Points and Area
    switch(this.profileCompletion.value['land_area_unit']){
      case "metre": this.polygonAreaInKms = (this.land_area / 10^6); break;
      case "acre": this.polygonAreaInKms = (this.land_area / 247); break;
      case "hectre": this.polygonAreaInKms = (this.land_area / 100); break;
    }
    let polygonAreaInDegrees = this.polygonAreaInKms / 111;
    this.polygonPoints = [[
      [this.lng - polygonAreaInDegrees, this.lat - polygonAreaInDegrees],
      [this.lng - polygonAreaInDegrees, this.lat + polygonAreaInDegrees],
      [this.lng + polygonAreaInDegrees, this.lat + polygonAreaInDegrees],
      [this.lng + polygonAreaInDegrees, this.lat - polygonAreaInDegrees],
      [this.lng - polygonAreaInDegrees, this.lat - polygonAreaInDegrees]
    ]];

    //Construct Request
    const url = "http://api.agromonitoring.com/agro/1.0/polygons?appid=613d1afb9e5bdef76ca5b04626254376";
    let body = {
      "name": this.userID,
      "geo_json":{
        "type":"Feature",
        "properties":{},
        "geometry":{
          "type":"Polygon",
          "coordinates":this.polygonPoints
        }
      }
    };
    //Create Polygon
    this.http.post(url, body).subscribe(response => {console.log(response)});

    //Navigate user
    this.afs.collection('profileCompletion', ref => ref.where('userID', '==', this.userID)).valueChanges()    .subscribe((result) =>{
          if(result.length == 0 || !result){ this.snackBar.open('Error sending data. Try again!', 'Okay', {duration: 3500}); this.router.navigateByUrl('') }
          else { this.router.navigateByUrl('/dashboard') }
      });
  }

}
