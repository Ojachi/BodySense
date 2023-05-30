import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SingupComponent } from './singup/singup.component';
import { ChatComponent } from './chat/chat.component';
import {HttpClientModule} from '@angular/common/http';
import { RestService } from './services/rest.service';
import { UsernameService } from './services/username.service';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SingupComponent,
    ChatComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule

  ],
  providers: [RestService, UsernameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
