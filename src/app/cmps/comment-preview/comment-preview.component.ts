import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from 'src/app/models/comment';
import { User } from 'src/app/models/user';

@Component({
  selector: 'comment-preview',
  templateUrl: './comment-preview.component.html',
  styleUrls: ['./comment-preview.component.scss']
})
export class CommentPreviewComponent implements OnInit {

  @Input() comment: Comment | null = null
  @Input() loggedUser: User | null = null

  @Output() commentUpdated = new EventEmitter<Comment>()
  @Output() commentRemoved = new EventEmitter<number | string>()

  isEditOn: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

  onTxtUpdate(target: EventTarget | null) {
    // EventTarget does not inherit from Element, fix is:
    const pElement = target as Element
    const { innerHTML: txt } = pElement
    // For TS:
    if (!this.comment) return

    const updatedComment: Comment = { ...this.comment, txt }
    this.commentUpdated.emit(updatedComment)
  }

  // Bad for performance since every Change Detection causes getter to recalculate
  get isLoggedUserComment(): boolean {
    return this.loggedUser?.id == this.comment?.ownerId
  }

}
