import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Users } from './models/user';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  users$: Observable<Users>

  constructor(private userService: UserService) {
    this.users$ = userService.users$
  }

  ngOnInit(): void {
    this.userService.loadUsers()
  }
}
