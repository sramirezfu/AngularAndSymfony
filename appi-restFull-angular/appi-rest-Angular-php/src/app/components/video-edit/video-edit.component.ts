import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { VideoService } from '../../services/video.service';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { Video } from '../../models/video.module';

@Component({
  selector: 'app-video-edit',
  templateUrl: '../video-create/video-create.component.html',
  styleUrls: ['./video-edit.component.css']
})
export class VideoEditComponent implements OnInit {

  public video:Video;
  public token;
  public identity;
  public categories;
  public is_exist;
  public status;
  public id;
  constructor(public router:Router,
              public activatedRoute:ActivatedRoute,
              public videoService:VideoService,
              public userService:UserService,
              public categoryService:CategoryService,) 
              {
                this.is_exist = true;
                this.identity = this.userService.getIdentity();
                this.token = this.userService.getToken();
                this.video =  new Video(1,this.identity.sub,1,'','','','normal','');
              }

  ngOnInit(): void {
    this.getCategories();
    this.getPost();
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

  getPost(){
    this.activatedRoute.params.subscribe(
      params => {
        this.id = +params['id'];
        this.videoService.getVideo(this.id).subscribe(
          response => {
            if(response.status == 'success'){
              this.video = response.video[0];
            }
          },
          error => {
            console.log(<any>error);
          }
        );
      }
    );
  }
  
  onSubmit(form){
    this.videoService.update(this.token, this.id, this.video).subscribe(
      response => {
        if(response.status == 'success'){
          this.status = response.status;
          this.router.navigate(['/video/'+this.id]);
        }else{
          this.status = response.status;
        }
      },
      error => {
        console.log(<any>error);
      }
    );

  }

}
