import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  message = '';
	registrationForm = new FormGroup({
		username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
		password: new FormControl('', Validators.required)
	});

	constructor(private auth: AuthService,
		private router: Router){ }

	ngOnInit(){
	}

	onSubmit() {
		const username = this.registrationForm.get('username')?.value;
    const email = this.registrationForm.get('email')?.value;
    const firstname = this.registrationForm.get('firstname')?.value;
    const lastname = this.registrationForm.get('lastname')?.value;
		const password = this.registrationForm.get('password')?.value;
		console.log(`registering: ${username}`);
    this.auth.register(username, email, firstname, lastname, password).subscribe(
      () => {
        console.log(`success in creating: ${username}`);
      },
      (error: any) => {
        this.message = error;
      }
    );
	}

}
