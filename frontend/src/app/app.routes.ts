import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { PublicHomePage } from './pages/public/public-home-page/public-home-page';
import { PublicListPage } from './pages/public/public-list-page/public-list-page';
import { RegisterPage } from './pages/public/register-page/register-page';
import { ResetPasswordPage } from './pages/public/reset-password-page/reset-password-page';
import { SetPasswordPage } from './pages/public/set-password-page/set-password-page';

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
        path: "public/reset-password",
        component: ResetPasswordPage
    },
    {
        path: "public/set-password",
        component: SetPasswordPage
    },
    {
        path: "public/list/:id",
        component: PublicListPage
    },
    {
        path: "public",
        component: PublicHomePage
    },
    {
        path: "",
        pathMatch: "full",
        redirectTo: "login"
    }
];
