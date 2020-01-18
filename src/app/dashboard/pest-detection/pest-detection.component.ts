import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pest-detection',
  templateUrl: './pest-detection.component.html',
  styleUrls: ['./pest-detection.component.scss']
})
export class PestDetectionComponent implements OnInit {
  selectedFile:File = null
  pest:string = ""
  loading:boolean = false
  pestList:{name: string[], value: string[]} = { name: [], value: [] }
  currentPest:any
  pestSearch = new FormControl();
  filteredOptions: Observable<string[]>
  pestIndex:number
  pestData:any
  start:number = 0
  end:number = 1
  noOfPests:number = 0
  search$: any;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.filteredOptions = this.pestSearch.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.http.get("./assets/pests/data.json").subscribe(
      res => {
        if(!this.pestIndex)
          this.pestData = res
        this.pestList.name = this.pestData.map( pest => pest.name.trim() )
        this.pestList.value = this.pestData.map( pest => pest.name.trim().replace(/\s/g,'').toLowerCase() )
        this.currentPest = this.pestData[0]
      })
  }

  onFileSelected(e){
    this.selectedFile = <File>e.target.files[0]
  }

  onUpload(){
    this.loading = true
    let fd = new FormData();
    fd.append('plant_image', this.selectedFile)
    this.http.post("http://192.168.1.32:8001/predict", fd)
      .subscribe(
        res => {
          this.pest = <string>res;
          this.pest = this.pest.replace(/_/g, " ");
        },
        error => { this.pest = error }
      )
  }

  private _filter(value: string): string[] {
    if(this.pestList){
      const filterValue = value.toLowerCase();
      return this.pestList.name.filter(option => option.toLowerCase().includes(filterValue));
    } else return null
  }

  /*setAutoCompleteValue(option){
    let nameIndex = this.pestList.name.indexOf(option.trim())
    return this.pestList.value[nameIndex]
  }*/

  imageError(e){ e.target.hidden = true }

  setPest(option_t){
    let index = this.pestList.name.indexOf(option_t)
    this.currentPest = this.pestData[index]
  }
}
