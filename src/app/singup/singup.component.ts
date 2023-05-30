import { Component, OnInit } from '@angular/core';
import { RestService } from '../services/rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css']
})
export class SingupComponent implements OnInit{

  register = {
    username:"",
    password:"",
    email:"",
    neighborhood:""
  }

  messageOk = null;
  messageErr = null;

  constructor(private rest: RestService, private route: Router){}

  ngOnInit(): void {}

  async singup() {
    // mostrar datos
    console.log(this.register.username)
    console.log(this.register.password)
    console.log(this.register.email)
    console.log(this.register.neighborhood)

    try {
      // peticion
      // podemos utilizar await o no
      var res = await this.rest.PostRequest("submit", this.register).toPromise();
      console.log(res);
      // resetear datos
      this.register.username = "";
      this.register.password = "";
      this.register.email = "";
      this.register.neighborhood = "";
      this.messageOk = res.message;
      //this.route.navigate(["chat"])

    } catch(error: any) {
      this.messageErr = error.error.message
    }
  }
  cerrarAlert1() {
    this.route.navigate(["login"])
    this.messageOk = null;
  }

  cerrarAlert2() {
    this.messageErr = null;
  }


}
