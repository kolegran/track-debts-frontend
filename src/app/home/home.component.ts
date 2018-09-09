import { Component, OnInit } from '@angular/core';
import {UserService} from '../core/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  username: string;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.username = this.userService.username;
  }

  logout() {
    this.userService.logout()
      .subscribe(() => this.router.navigate(['', 'guest']));
  }
}