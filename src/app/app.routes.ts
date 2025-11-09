import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UploadComponent } from './pages/upload/upload.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
export const routes: Routes = [
    { path: '', title: 'Home', component: HomeComponent },
    { path: 'dashboard', title: 'Dashboard', component: DashboardComponent },
    { path: 'upload', title: 'Upload Material', component: UploadComponent },
    { path: 'login', title: 'Login', component: LoginComponent },
    { path: 'signup', title: 'Sign Up', component: SignupComponent }
];
