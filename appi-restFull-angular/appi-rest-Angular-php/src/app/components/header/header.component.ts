import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, DoCheck {

  public identity;
  public categories;

  constructor(public userService:UserService,
              public categoryService:CategoryService) {
    
  }  

  ngDoCheck(){
    this.loadUser();
  }
  ngOnInit(): void {
    this.getCategories();
  }

  loadUser(){
    this.identity = this.userService.getIdentity();    
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

}
