import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'comment-add',
  templateUrl: './comment-add.component.html',
  styleUrls: ['./comment-add.component.scss']
})
export class CommentAddComponent implements OnInit {

  @Input() loggedUser: User | null = null
  @Input() newComment: any | null = null

  @Output() commentAdded = new EventEmitter<string>()

  constructor() { }

  ngOnInit(): void {
  }

  addComment(txt: string) {
    this.commentAdded.emit(txt)
  }

}
