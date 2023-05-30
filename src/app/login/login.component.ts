import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { RestService } from '../services/rest.service';
import { Router } from '@angular/router';
import { UsernameService } from '../services/username.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  logear = {
    username: "",
    password: ""
  };


  messageOk = null;
  messageErr = null;

  constructor(private rest: RestService, private route: Router , private userSer: UsernameService) {
    if (userSer.getToken() != null){
      this.route.navigate(["chat"]);
    }
   }

  ngOnInit(): void {

  }

  async login() {
    // mostrar datos
    console.log(this.logear.username)
    console.log(this.logear.password)
    try {
      // peticion
      // podemos utilizar await o no
      var res = await this.rest.PostRequest("submit1", this.logear).toPromise();
      console.log(res);
      localStorage.setItem('token', res.user);
      // resetear datos
      this.logear.username = "";
      this.logear.password = "";
      this.messageOk = res.message;
      console.log(this.messageOk)
      //this.route.navigate(["chat"])

    } catch (error: any) {
      this.messageErr = error.error.message
    }
  }

  home() {
    this.route.navigate([""])
  }

  cerrarAlert1() {
    this.route.navigate(["chat"])
    this.messageOk = null;
  }

  cerrarAlert2() {
    this.messageErr = null;
  }

}