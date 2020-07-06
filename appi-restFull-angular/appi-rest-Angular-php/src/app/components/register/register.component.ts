import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.module';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  public user:User;
  public status:string;

  constructor(public userService:UserService, public router:Router) { 
    this.user = new User (1, '', '', 'ROLE_USER', '', '', '', '', '');
  }

  ngOnInit(): void {
  }
  onSubmit(form){
    this.userService.register(this.user).subscribe(
      response => {        
        if(response.status == 'success'){
          this.status = response.status;
          form.reset();
          setInterval(() => {
            this.router.navigate(['/login']);
          }, 3000);
        }else{
          this.status = response.status;
        }
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }
}
