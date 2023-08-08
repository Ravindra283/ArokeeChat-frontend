import { LoginService } from './login.service';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showLoginForm = true;

  loginEmail!: string;
  loginPassword!: string;
  signupName!: string;
  signupPassword!: string;
  signupImage!: string;
  signupEmail!: string;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('userData')
    if (userData){
      this.router.navigate(["chat"]);
    }
  }

  onLoginSubmit() {
    this.loginService.login({email: this.loginEmail, password: this.loginPassword})
    .subscribe((res) => {
      if (res){
        localStorage.setItem('userData', JSON.stringify(res))
        this.router.navigate(["chat"]);
      }
    }, (error) => {
      alert(error.error.message)
      console.log('error', error)
    });
  }

  onSignupSubmit() {
    this.loginService.signup({name: this.signupName, email: this.signupEmail, password: this.signupPassword})
    .subscribe((res: any) => {
      if (res){
        localStorage.setItem('userData', JSON.stringify(res))
        this.router.navigate(["chat"]);
      }
    }, (error) => {
      alert(error.error.message)
      console.log('error', error)
    });
  }

}
