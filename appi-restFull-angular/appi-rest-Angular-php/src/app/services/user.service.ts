import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { global } from './global';

@Injectable()

export class UserService{

    public url:string;
    public identity;
    public token;

    constructor(public http:HttpClient,
                public router:Router){
        this.url = global.url;
    }

    // Metodo pra registrarse.
    register(user): Observable<any>{
        let json = JSON.stringify(user);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this.http.post(this.url+'registrarse', params, {headers: headers});
    }

    // Metodo de login.
    login(user, getToken = null): Observable<any>{
            if(getToken){
                user.getToken = true;
            }
            let json = JSON.stringify(user);
            let params = 'json='+json;
            let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this.http.post(this.url+'login', params, {headers: headers});
    }

    // Metodo para actualizar usuario.
    update(user, token):Observable<any>{
        let json = JSON.stringify(user);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                       .set('Authorization', token);

        return this.http.put(this.url+'editar/usuario', params, {headers: headers});
    }
    
    // metodo para traer un usuario.    
    getUser(id): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.get(this.url + 'usuario/' + id, {headers: headers});
    }

    // Metodo que contiene la identidad
    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));

        if(identity && identity != 'undefined'){
            this.identity = identity;
        }else{
            this.identity =  null;
        }

        return this.identity;
    }

    // Metodo para traer el token.
    getToken(){
        let token = localStorage.getItem('token');

        if(token){
            this.token = token;
        }else{
            this.token = null;
        }

        return this.token;
    }

    // Metodo para traer los post de un usuario.
    getPostByUser(token, id, page):Observable<any>{
        if(!page){
            page = 1;
        }
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                       .set('Authorization', token);
        return this.http.get(this.url + 'usuario/videos/' + id+'?page='+page, {headers: headers});
    }
}