import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { ProfilesComponent } from './profiles/profiles.component';
import { SettingsComponent } from './settings/settings.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { ProfileModalComponent } from './profiles/profile-modal/profile-modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmationModalComponent } from './shared/confirmation-modal/confirmation-modal.component';
import { RuleModalComponent } from './profiles/rule-modal/rule-modal.component';
import {
	HTTP_INTERCEPTORS,
	provideHttpClient,
	withInterceptorsFromDi,
} from '@angular/common/http';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SprinklerModalComponent } from './settings/sprinkler-modal/sprinkler-modal.component';
import { ErrorInterceptorService } from './interceptors/error-interceptor.service';

@NgModule({
	declarations: [
		AppComponent,
		ProfilesComponent,
		SettingsComponent,
		ProfileModalComponent,
		ConfirmationModalComponent,
		RuleModalComponent,
		SprinklerModalComponent,
	],
	bootstrap: [AppComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatToolbarModule,
		MatButtonModule,
		MatExpansionModule,
		MatTableModule,
		MatCheckboxModule,
		ReactiveFormsModule,
		MatIconModule,
		MatTooltipModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatSnackBarModule,
		NgxMaterialTimepickerModule,
	],
	providers: [
		provideHttpClient(withInterceptorsFromDi()),
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ErrorInterceptorService,
			multi: true,
		},
	],
})
export class AppModule {}
