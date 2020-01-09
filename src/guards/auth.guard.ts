import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/services/Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router){ }

  canActivate(): boolean {
    if (this.auth.LoggedIn === false) this.router.navigateByUrl('');
    return this.auth.LoggedIn;
  }
}
