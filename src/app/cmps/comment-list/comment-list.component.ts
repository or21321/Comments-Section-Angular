import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment, CommentAddObj, Comments } from 'src/app/models/comment';
import { User } from 'src/app/models/user';

@Component({
  selector: 'comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

  @Input() comments: Comments | null | undefined = null
  @Input() loggedUser: User | null = null
  @Input() isReplies: boolean = false

  @Output() commentUpdated = new EventEmitter<Comment>()
  @Output() commentRemoved = new EventEmitter<number | string>()
  @Output() replyAdded = new EventEmitter<CommentAddObj>()

  constructor() { }

  ngOnInit(): void {
  }

}
