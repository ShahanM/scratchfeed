import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  authenticated: boolean;
  isAdmin: boolean;
  username: string;

  constructor(private auth: AuthService) { 
    this.authenticated = false;
    this.isAdmin = false;
    this.username = '';
}

  ngOnInit(): void {
    this.auth.subscribe(
      (authenticated) => {
          this.authenticated = authenticated;
          if (authenticated) {
              this.username = this.auth.getUsername();
              this.isAdmin = this.auth.isAdmin();
          } else {
              this.username = '';
              this.isAdmin = false;
          }
      }
    );
  }

}
