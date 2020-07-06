import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CategoryNewComponent } from './components/category-new/category-new.component';
import { CategoryDetailComponent } from './components/category-detail/category-detail.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';

// imports services
import { UserService } from './services/user.service';
import { CategoryService } from './services/category.service';
import { VideoService } from './services/video.service';
import { IdentityGuard } from './components/../services/identity.guard';

// IMPORT PLUGINS
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { VideoCreateComponent } from './components/video-create/video-create.component';
import { VideoDetailComponent } from './components/video-detail/video-detail.component';
import { VideoEditComponent } from './components/video-edit/video-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    NotFoundComponent,
    LoginComponent,
    RegisterComponent,
    CategoryNewComponent,
    CategoryDetailComponent,
    ProfileComponent,
    UserEditComponent,
    VideoCreateComponent,
    VideoDetailComponent,
    VideoEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    AngularFileUploaderModule
  ],
  providers: [UserService, CategoryService, VideoService, IdentityGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
