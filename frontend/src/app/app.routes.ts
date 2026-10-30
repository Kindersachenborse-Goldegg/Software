import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { PublicHomePage } from './pages/public/public-home-page/public-home-page';
import { RegisterPage } from './pages/public/register-page/register-page';

export const routes: Routes = [
    {
        path: "login",
        component: LoginPage
    },
    {
        path: "public/register",
        component: RegisterPage
    },
    {
        path: "public",
        component: PublicHomePage
    }
];
