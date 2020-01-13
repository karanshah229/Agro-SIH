import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { WindowService } from '../../services/Auth/window.service';
import * as firebase from 'firebase';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  windowRef: any;
  user: any;
  loginBtnMsg: string = 'Send OTP';
  reCaptchaVerified:BehaviorSubject<boolean> = new BehaviorSubject(false);
  nextRoute:string;

  signIn: FormGroup;
  sendOTP: FormGroup;

  profileCompletion: Observable<any>;

  signIn_formErrors = {
    mobileNumber: ''
  };

  signIn_validationMessages = {
    mobileNumber: {
      required:      'Mobile Number is required',
      pattern:       '10 digit mobile number without country code'
    }
  };

  sendOTP_formErrors = {
    OTP: ''
  };

  sendOTP_validationMessages = {
    OTP: {
      required:      'OTP is required',
      pattern:       'Enter 6 digit OTP code received'
    }
  };


  constructor(
    private win: WindowService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router,
    private afs: AngularFirestore,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
     'callback': () => {
        this.reCaptchaVerified.next(true);
        this.changeDetectorRef.detectChanges();
      }
    });
    this.windowRef.recaptchaVerifier.render();
    this.create_signInForm();
  }

  sendLoginCode(){
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = `${this.signIn.controls['countryCode'].value}${this.signIn.controls['mobileNumber'].value}`;

    firebase.auth().signInWithPhoneNumber(num, appVerifier)
    .then(result => {
      let num = this.signIn.value['countryCode'] + this.signIn.value['mobileNumber'];
      this.windowRef.confirmationResult = result;
      this.loginBtnMsg = 'Login';
      this.create_sendOTP();
    })
    .catch( error => {
      this.snackBar.open(error, 'CLOSE', {duration: 3500});
    });
  }

  verifyLoginCode(){
    this.windowRef.confirmationResult
    .confirm(this.sendOTP.controls['OTP'].value)
    .then(result => {
      console.log(result);
      this.snackBar.open('Login Successful', 'CLOSE', {duration: 3000});
      this.afs.collection('profileCompletion', ref => ref.where('userID', '==', result.user.uid)).valueChanges().subscribe((result) =>{
          console.log(result);
          if(result.length == 0 || !result){ this.router.navigateByUrl('profileCompletion') }
          else { this.router.navigateByUrl('dashboard') }
      });
    })
    .catch(error => {
      console.log(error);
      this.snackBar.open('Incorrect code entered, please try again', 'CLOSE', {duration: 3500});
      this.windowRef.confirmationResult = null;
      this.router.navigateByUrl('signIn');
    });
  }

  create_signInForm(){
    this.signIn = this.fb.group({
      countryCode: [{value: '+91', disabled:true}],
      mobileNumber: ['', [Validators.required, Validators.pattern] ]
    });

    this.signIn.valueChanges
        .subscribe(data => this.onValueChanged_signIn(data));
  }

  onValueChanged_signIn(data?: any){
    if (!this.signIn) { return; }
    const form = this.signIn;
    for (const field in this.signIn_formErrors) {
        if (this.signIn_formErrors.hasOwnProperty(field)) {
            // clear previous error messages if any
            this.signIn_formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.signIn_validationMessages[field];
                for (const key in control.errors) {
                    if (control.errors.hasOwnProperty(key)) {
                        this.signIn_formErrors[field] += messages[key] + ' ';
                    }
                }
            }
        }
    }
  }

  create_sendOTP(){
    this.sendOTP = this.fb.group({
      OTP: ['', [Validators.required, Validators.pattern] ]
    });

    this.sendOTP.valueChanges
        .subscribe(data => this.onValueChanged_sendOTP(data));
  }

  onValueChanged_sendOTP(data?: any){
    if (!this.signIn) { return; }
    const form = this.signIn;
    for (const field in this.signIn_formErrors) {
        if (this.signIn_formErrors.hasOwnProperty(field)) {
            // clear previous error messages if any
            this.signIn_formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.signIn_validationMessages[field];
                for (const key in control.errors) {
                    if (control.errors.hasOwnProperty(key)) {
                        this.signIn_formErrors[field] += messages[key] + ' ';
                    }
                }
            }
        }
    }
  }

}
