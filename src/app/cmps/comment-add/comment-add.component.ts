import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment, CommentAddObj } from 'src/app/models/comment';
import { User } from 'src/app/models/user';

@Component({
  selector: 'comment-add',
  templateUrl: './comment-add.component.html',
  styleUrls: ['./comment-add.component.scss']
})
export class CommentAddComponent implements OnInit {

  @Input() loggedUser: User | null = null
  @Input() newComment: Comment | null = null
  @Input() isReply: boolean = false
  @Input() parentCommentId: string | number | null | undefined = null

  @Output() commentAdded = new EventEmitter<CommentAddObj>()

  constructor() { }

  ngOnInit(): void {
  }

  addComment(txt: string) {
    const parentCommentId = this.parentCommentId
    this.commentAdded.emit({ txt, parentCommentId })
  }

}
