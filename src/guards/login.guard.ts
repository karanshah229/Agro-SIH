import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate  {
  constructor(private afauth: AngularFireAuth, private router: Router){ }

  canActivate(): boolean {
    if (this.afauth.auth.currentUser !== null) { this.router.navigateByUrl('/dashboard'); return false }
    return true;
  }
}
