import { Component, OnInit } from '@angular/core';
import { global } from '../../services/global';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.module';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  public url;
  public user: User;
  public identity;
  public token;
  public status;
  public title;
  public froala_options: Object = {
    charCounterCount: true,
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
  };
  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.gif,.jpeg",
    maxSize: "50",
    uploadAPI:  {
      url:global.url+'user/upload',
      headers: {     
     "Authorization" : this.userService.getToken()
      }
    },
    theme: "attachPin",
    hideProgressBar: true,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: 'Subir imagen',
  };
  constructor(public userService:UserService) { 
    this.url = global.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.user = new User(
      this.identity.sub,
      this.identity.name,
      this.identity.surname,
      this.identity.role,
      this.identity.email,
      '',
      this.identity.description,
      '',
      ''
    );
    this.title = 'Actualiza tu perfil';
  }

  ngOnInit(): void {
  }
  
  onSubmit(form){
    this.userService.update(this.user, this.token).subscribe(
      response => {
        if(response.status == 'success'){
          this.status = response.status;
          this.identity = response.changes;
          localStorage.setItem('identity', JSON.stringify(this.identity));
        }else{
          this.status = response.status;
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  avatarUpload(datos){

  }
}
