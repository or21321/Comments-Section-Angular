import { Component, Input, OnInit } from '@angular/core';
import { User, Users } from 'src/app/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {

  @Input() users: Users | null = null

  loggedUser: User | null = null

  constructor() { }

  ngOnInit(): void {
  }

  onUserSelect() {
    console.log('onUserSelect', this.loggedUser);
  }

}
