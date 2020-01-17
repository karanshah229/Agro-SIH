import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-pest-detection',
  templateUrl: './pest-detection.component.html',
  styleUrls: ['./pest-detection.component.scss']
})
export class PestDetectionComponent implements OnInit {
  selectedFile:File = null
  pest:any = ""
  loading:BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onFileSelected(e){
    this.selectedFile = <File>e.target.files[0]
  }

  onUpload(){
    let fd = new FormData();
    fd.append('plant-image', this.selectedFile.name)
    this.http.post("127.0.0.1:8000/predict", fd,
      {
        reportProgress: true,
        observe: 'events'
      })
      .subscribe(
          event => {
            if(event.type === HttpEventType.UploadProgress){
              let progress = Math.round( (event.loaded / event.total) * 100)
              if(progress === 100 || progress > 99)
              this.loading.next(progress)
            } else if(event.type === HttpEventType.Response){
              res => { this.pest  = res }
            }
          },
          error => { this.pest = error }
        )
  }

}
