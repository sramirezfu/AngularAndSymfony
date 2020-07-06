import { Component, OnInit } from '@angular/core';
import { VideoService } from '../../services/video.service';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public identity;
  public token;
  public videos;
  public page;
  public next_page;
  public prev_page;
  public number_pages;
  public change_page;

  constructor(public userService:UserService,
              public videoService:VideoService,
              public router:Router,
              public activatedRoute:ActivatedRoute) 
              { 
                this.identity = this.userService.getIdentity();
                this.token = this.userService.getToken();
                this.next_page = 1;
              }

  ngOnInit(): void {
    this.getVideos();
  }
  
  getVideos(){
    this.activatedRoute.params.subscribe(
      params => {
        this.page = +params['page'];
        this.videoService.getVideos(this.page).subscribe(
          response => {
            if(response.status == 'success'){
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
            }
          },
          error => {
            console.log(<any>error);
          }
        );
    });
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
   
  deletePost(id){
    this.videoService.delete(this.token,id).subscribe(
      response => {
        if(response.status == 'success'){
          this.getVideos();
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
}
