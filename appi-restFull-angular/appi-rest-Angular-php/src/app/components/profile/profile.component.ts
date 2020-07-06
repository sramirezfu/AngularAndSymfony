import { Component, OnInit, DoCheck } from '@angular/core';
import { User } from '../../models/user.module';
import { UserService } from '../../services/user.service';
import { VideoService } from '../../services/video.service';
import { ActivatedRoute, Params, Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit, DoCheck {
  
  public user:User;
  public identity;
  public status;
  public statuss;
  public token;
  public id;
  public videos;
  public page;
  public next_page;
  public prev_page;
  public number_pages;
  public change_page;
  constructor(public userService:UserService,
              public activatedRoute:ActivatedRoute,
              public router:Router,
              public videoService:VideoService) 
              {
                this.identity = this.userService.getIdentity();
                this.token = this.userService.getToken();
              }

  ngDoCheck(){
    this.getUser();
  }
    
  ngOnInit(): void {
    this.getVideos();
  }
  
  getVideos(){
    this.activatedRoute.params.subscribe( params => {
      this.id = +params['id'];
      this.page = +params['page'];
      this.userService.getPostByUser(this.token, this.id, this.page).subscribe(
        response => {          
          if(response.status == 'success'){
            this.status = response.status;
            this.videos = response.videos; 
            this.change_page = response.page_actual;
            var pages = [];
            for(var i = 1; i <= response.total_pages; i++){
              pages.push(i);
            }
            this.number_pages = pages;
            if(this.page >= 2){
              this.prev_page = this.page-1;
            }else{
              this.prev_page = 1;
            }
            if(this.page < response.total_pages){
              this.next_page = this.page+1;
            }else{
              this.next_page = 1;
            }         
            if(this.videos.length == 0){
              this.router.navigate(['/']);
            }           
          }else{
            this.status = 'error';
          }
        },
        error => {
          console.log(<any>error);
        }
      );
    });
  }

  getUser(){
    this.userService.getUser(this.id).subscribe(
      response => {
        if(response.status == 'success'){
          this.user = response.user;          
        }else{                    
          this.status = response.status;
          this.router.navigate(['/']);
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  deletePost(id){
    this.videoService.delete(this.token, id).subscribe(
      response => {
        if(response.status == 'success'){                    
          let pru = this.getVideos();               
          this.router.navigate(['perfil/usuario/'+this.user.id+'/1']);           
                       
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  getThumb(url, size) {
    var video, results, thumburl;    
    if (url === null) {
        return '';
    }     
    results = url.match('[\\?&]v=([^&#]*)');
    video   = (results === null) ? url : results[1];
    if(size != null) {
        thumburl = 'http://img.youtube.com/vi/' + video + '/'+ size +'.jpg';
    }else{
        thumburl = 'http://img.youtube.com/vi/' + video + '/mqdefault.jpg';
    }
    return thumburl;        
  }

}
