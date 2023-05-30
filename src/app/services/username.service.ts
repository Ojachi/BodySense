import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsernameService {

  constructor(private route: Router) { }

  loggedIn(){
    return !!localStorage.getItem('token');
  }
  getToken(){
    return localStorage.getItem('token');
  }
  logOut(){
    localStorage.removeItem('token');
    this.route.navigate(['/signin']);
  }
}
