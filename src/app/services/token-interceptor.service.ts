import { Injectable } from '@angular/core';
import { UsernameService } from './username.service';
import { HttpInterceptor } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private userSer: UsernameService) { }

  intercept(req: any, next: any) {
    const  tokenizeReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.userSer.getToken()}`
      }
    })
    return next.handle(tokenizeReq)
  }

}
