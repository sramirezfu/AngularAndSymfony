import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user.module';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  public status;
  public user:User;
  public identity;
  public token;

  constructor(public router:Router,
              public userService:UserService,
              public activatedRouter:ActivatedRoute)
              {
                this.user = new User (1, '', '', 'ROLE_USER', '','','','','');
              }

  ngOnInit(): void {
    this.logout();
  }

  onSubmit(form){
    this.userService.login(this.user).subscribe(
      response => {
        if(response.status != 'error'){
          this.identity = response;          
          this.userService.login(this.user, true).subscribe(
            response => {
              this.token = response;
              localStorage.setItem('token', this.token);
              localStorage.setItem('identity', JSON.stringify(this.identity));          
              this.router.navigate(['/']);
            },
            error => {
              console.log(<any>error);
            }
          );
        }else{
          this.status = response.status;
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  // metodo para cerrar sesion.
  logout(){
    this.activatedRouter.params.subscribe(params => {
        let salir = +params['sure'];
        if(salir == 1){
          localStorage.removeItem('identity');
          localStorage.removeItem('token');
          this.identity = null;
          this.token = null;
          this.router.navigate(['/']);
        }
    });
  }
}
