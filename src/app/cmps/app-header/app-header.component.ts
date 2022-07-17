import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User, Users } from 'src/app/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {

  @Input() users: Users | null = null
  @Input() loggedUser: User | null = null
  @Output() onUserSelect = new EventEmitter<number | null>()

  loggedUserId: number | null = null


  constructor() { }

  ngOnInit(): void {
  }

  selectUser() {
    console.log(this.loggedUserId);
    this.onUserSelect.emit(this.loggedUserId)
  }

}
