import { Component, OnInit } from '@angular/core';
import { RestService } from '../services/rest.service';
import { Router } from '@angular/router';
import { UsernameService } from '../services/username.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private rest: RestService, private route: Router, private userSer: UsernameService) { }

  messageErr: string = ""

  ngOnInit(): void { }

  async chat() {
    if (this.userSer.getToken() != null) {
      console.log(this.userSer.getToken())
      this.route.navigate(["chat"]);
    }
    else {
      this.route.navigate(["login"])
    }
  }

  login() {
    this.route.navigate(["login"])
  }

  singup() {
    this.route.navigate(["singup"])
  }
}
