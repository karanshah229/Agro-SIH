import { Component, OnInit } from '@angular/core';

import { WindowService } from '../../services/Auth/window.service';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  windowRef: any;
  user: any;
  loginBtnMsg: string = 'Send OTP';
  reCaptchaVerified:boolean = false;

  signIn: FormGroup;
  sendOTP: FormGroup;

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


  constructor(private win: WindowService, private snackBar: MatSnackBar, private fb: FormBuilder,
  private router: Router) { }

  ngOnInit() {
    this.windowRef = this.win.windowRef;
    firebase.initializeApp(environment.firebase);
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
     callback: function(){
       this.reCaptchaVerified = true;
        console.log(this.reCaptchaVerified);
        alert(this.reCaptchaVerified);
      }
   });
    this.windowRef.recaptchaVerifier.render();
    this.create_signInForm();
  }

  sendLoginCode(){
    const appVerifier = this.windowRef.recaptchaVerifier;
    console.log(appVerifier);
    const num = `+${this.signIn.controls['countryCode'].value}${this.signIn.controls['mobileNumber'].value}`;

    firebase.auth().signInWithPhoneNumber(num, appVerifier)
    .then(result => {
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
      this.snackBar.open('Successfully authenticated', 'CLOSE', {duration: 3500});
      this.router.navigateByUrl('dashboard');
    })
    .catch(error => {
      console.log(error);
      this.snackBar.open('Incorrect code entered, please try again', 'CLOSE', {duration: 2000});
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
