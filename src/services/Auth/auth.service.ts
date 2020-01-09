import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn:boolean = false;

  constructor() { }

  set LoggedIn(isLoggedIn:boolean){
    this.isLoggedIn = isLoggedIn;
  }

  get LoggedIn(){
    return this.isLoggedIn;
  }
}
