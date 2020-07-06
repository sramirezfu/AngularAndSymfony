import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.module';
import { global } from './global';

@Injectable()

export class CategoryService{

    public url;

    constructor(public http:HttpClient){
        this.url = global.url;
    }
    
    getCategory(id):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    
        return this.http.get(this.url+'category/'+id, {headers: headers});
    }

    getCategories():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    
        return this.http.get(this.url+'categories', {headers: headers});
    }

    getVideoByCategory(id, page):Observable<any>{
        if(!page){
            page = 1;
        }
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    
        return this.http.get(this.url + 'category/videos/' + id + '?page=' + page, {headers: headers});
    }
    getPostByUser(token, id, page):Observable<any>{
        if(!page){
            page = 1;
        }
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                       .set('Authorization', token);
        return this.http.get(this.url + 'usuario/videos/' + id + '?page=' + page, {headers: headers});
    }
    
}