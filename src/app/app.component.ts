import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User, Users } from './models/user';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  users$: Observable<Users>
  loggedUser$: Observable<User | null>

  constructor(private userService: UserService) {
    this.users$ = userService.users$
    this.loggedUser$ = userService.loggedUser$
  }

  ngOnInit(): void {
    this.userService.loadUsers()
  }

  onUserSelect(userId: number | null) {
    try {
      if (!userId) return
      this.userService.login(userId)
    } catch (err) {
      console.log(err);
    }
  }
}
