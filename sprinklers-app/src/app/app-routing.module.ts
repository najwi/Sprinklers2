import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilesComponent } from './profiles/profiles.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
	{ path: '', redirectTo: '/profiles', pathMatch: 'full' },
	{ path: 'profiles', component: ProfilesComponent },
	{ path: 'settings', component: SettingsComponent },
	{ path: '**', redirectTo: '/profiles'}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
