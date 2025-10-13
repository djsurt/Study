import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
export const routes: Routes = [
    { path: '', title: 'Home', component: HomeComponent },
    { path: 'dashboard', title: 'Dashboard', component: DashboardComponent }
];
