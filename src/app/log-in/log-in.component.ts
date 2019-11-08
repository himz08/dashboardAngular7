import { Component, OnInit } from '@angular/core';
import { CommonService } from '../shared/common.service';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  loginForm: FormGroup;
  loginMsg: string = "Login successful";
  loginMsgError: string = "Login Failed!!!";
  action: string = "Dismiss";
  isLoginMode : boolean = true;
  isLoading : boolean = false;

  constructor(private services: CommonService, private router: Router, private authService : AuthService) { }

  ngOnInit() {

    this.authService.user.pipe(take(1)).subscribe( user => {
      if (!!user){
        this.router.navigate(['/home/overview']);
      }
    }
    )

    // loginForm is structured here and linked with view using binding
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]), // Validators.required will make the field required
      'password': new FormControl(null, Validators.required)
    })

  }


  switchMode(){
    this.isLoginMode = !this.isLoginMode;
    console.log(this.isLoginMode);
  }


  onSubmit(signupMode : boolean): void {
    // in service login function is called to check database   
    
    const email = this.loginForm.value.email;
    const pass = this.loginForm.value.password;
    let obs : Observable<AuthResponseData>;
      if(!signupMode){
         obs = this.authService.login(email,pass);
      }
      else {
         obs = this.authService.signup(email,pass);
         console.log('Signup...')
      }
      console.log(signupMode);

      this.isLoading = true;
      obs.subscribe( data => {
        this.router.navigate(['/home/overview']);
        this.isLoading = false;
        if (this.isLoginMode){
          this.services.openSnackBar('Login Successful !', 'Ok');
        }
        else {
          this.services.openSnackBar('Signup Successful', 'okay');
        }
      },
      errMsg => {
        this.services.openSnackBar(errMsg, 'Dismiss');
      }
      )
  }
}



