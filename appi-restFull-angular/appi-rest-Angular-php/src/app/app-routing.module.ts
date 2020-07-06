import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { VideoCreateComponent } from './components/video-create/video-create.component';
import { VideoDetailComponent } from './components/video-detail/video-detail.component';
import { CategoryDetailComponent } from './components/category-detail/category-detail.component';
import { VideoEditComponent } from './components/video-edit/video-edit.component';
import { IdentityGuard } from './services/identity.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'inicio/:page', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'login:page', component: LoginComponent},
  {path: 'logout/:sure', component: LoginComponent},
  {path: 'registrarse', component: RegisterComponent},
  {path: 'perfil/usuario/:id/:page', component: ProfileComponent, canActivate: [IdentityGuard]},
  {path: 'editar/usuario', component: UserEditComponent, canActivate: [IdentityGuard]},
  {path: 'crear/video', component:VideoCreateComponent, canActivate: [IdentityGuard]},
  {path: 'video/:id', component:VideoDetailComponent},
  {path: 'editar/video/:id', component: VideoEditComponent, canActivate: [IdentityGuard]},
  {path: 'detalle/categoria/:id/:page', component: CategoryDetailComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
