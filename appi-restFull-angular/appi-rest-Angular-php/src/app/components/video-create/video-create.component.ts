import { Component, OnInit } from '@angular/core';
import { VideoService } from '../../services/video.service';
import { Video } from '../../models/video.module';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-create',
  templateUrl: './video-create.component.html',
  styleUrls: ['./video-create.component.css']
})
export class VideoCreateComponent implements OnInit {
  
  public is_exist:boolean;
  public video:Video;
  public categories;
  public identity;
  public token;
  public status;
  public froala_options: Object = {
    charCounterCount: true,
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
  };
  constructor(public videoService:VideoService,
              public userService:UserService,
              public categoryService: CategoryService,
              public router:Router) {                
                this.identity = this.userService.getIdentity();
                this.token = this.userService.getToken();
                this.video = new Video(1,this.identity.sub,1,'','','','normal','');
                this.is_exist = null;
              }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(){
    this.categoryService.getCategories().subscribe(
      response => {
          if(response.status == 'success'){
            this.categories = response.categories;
          }          
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  onSubmit(form){
      this.videoService.create(this.token, this.video).subscribe(
        response => {
          if(response.status == 'success'){
            this.status = response.status;
            // setInterval(() => {
            //   this.router.navigate(['/']);
            // }, 3000);          
            this.router.navigate(['/video/'+response.video.id]);
          }else{
            this.status = response.status;
          }
          form.reset();
        },
        error => {
          console.log(<any>error);
        }
      );
  }


}
