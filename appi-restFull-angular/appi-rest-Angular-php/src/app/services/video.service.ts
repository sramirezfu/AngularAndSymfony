import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { global } from './global';

@Injectable()

export class VideoService {
    
    public url;
    constructor(public http:HttpClient,
                public router:Router)
            {
                this.url = global.url;
            }

    create(token, video):Observable<any>{
        let json = JSON.stringify(video);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                       .set('Authorization', token);

        return this.http.post(this.url+'crear/video', params, {headers: headers});
    }

    update(token, id, video):Observable<any>{
        let json = JSON.stringify(video);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                       .set('Authorization', token);
        return this.http.put(this.url+'actualizar/video/'+id, params, { headers:headers });
    }    

    getVideo(id):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this.http.get(this.url+'video/'+id, {headers: headers});
    }

    getVideos(page):Observable<any>{
        if(!page){
            page = 1;
        }
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.get(this.url + 'videos?page=' + page, {headers: headers});
    }

    delete(token, id):Observable<any>{
        
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                       .set('Authorization', token);

        return this.http.delete(this.url+'eliminar/video/'+id, {headers: headers});
    }

}