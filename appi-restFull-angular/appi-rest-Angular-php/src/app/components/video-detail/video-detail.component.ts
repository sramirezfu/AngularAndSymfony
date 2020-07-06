import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { VideoService } from '../../services/video.service';
import { Route } from '@angular/compiler/src/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.css']
})
export class VideoDetailComponent implements OnInit {

  public id;
  public video;
  constructor(public router:Router,
              public activatedRoute:ActivatedRoute,
              public videoService:VideoService,
              private sanitizer: DomSanitizer
              ) { }

  ngOnInit(): void {
    this.getVideo();
  }
  
  getVideo(){
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

  getVideoIframe(url) {
    var video, results;
 
    if (url === null) {
        return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video   = (results === null) ? url : results[1];
 
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);   
  }

}
