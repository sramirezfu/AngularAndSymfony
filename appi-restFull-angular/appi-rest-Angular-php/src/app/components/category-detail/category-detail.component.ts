import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { UserService } from '../../services/user.service';
import { VideoService } from '../../services/video.service';
 
@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {
  
  public videos;
  public status;
  public category;
  public id;
  public token;
  public identity;
  public page;
  public next_page;
  public prev_page;
  public number_pages;
  public change_page;
  constructor(public router:Router,
             public activatedRoute:ActivatedRoute,
             public categoryService:CategoryService,
             public userService:UserService,
             public videoService:VideoService)
            { 
              this.identity = this.userService.getIdentity();
              this.token = this.userService.getToken();
            }

  ngOnInit(): void {
    this.getCategory();
  }

  getCategory(){
    this.activatedRoute.params.subscribe(
     params => {
        this.id = +params['id'];
        this.page = +params['page'];
        this.categoryService.getCategory(this.id).subscribe(
          response => {
            if(response.status == 'success'){              
              this.category = response.category;
              this.categoryService.getVideoByCategory(this.id, this.page).subscribe(
                response => {                  
                  if(response.status == 'success'){
                    this.videos = response.videos;
                    this.status = response.status;
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
                    if(this.page == response.total_pages){
                      this.next_page = 1;
                    }else{
                      this.next_page = this.page+1;
                    }
                    if(this.videos.length == 0){
                      this.router.navigate(['/']);
                    }
                  }else{
                    this.status = response.status;                  
                  }
                },
                error => {
                    console.log(<any>error);
                }
              );
            }
          },
          error =>{
            console.log(<any>error);
          }
        );
     }
    );
  }

  deletePost(id){
    this.videoService.delete(this.token, id).subscribe(
      response => {
        if(response.status == 'success'){
          this.getCategory();
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
