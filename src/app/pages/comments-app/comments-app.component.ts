import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment, CommentAddObj, Comments } from 'src/app/models/comment';
import { User, Users } from 'src/app/models/user';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'comments-app',
  templateUrl: './comments-app.component.html',
  styleUrls: ['./comments-app.component.scss']
})
export class CommentsAppComponent implements OnInit {

  @Input() users: Users | null = null
  @Input() loggedUser: User | null = null

  comments$: Observable<Comments>
  // comments: Comments | null = null
  newComment: Comment | null = null
  commentForRemoval: Comment | null = null

  constructor(private commentService: CommentService, private userService: UserService) {
    this.comments$ = this.commentService.comments$
  }

  ngOnInit(): void {
    this.commentService.loadComments()
  }

  async commentUpdated(comment: Comment) {
    try {
      await this.commentService.saveComment(comment).toPromise()
    } catch (err) {
      console.log(err);
    }
  }

  openDeleteConfirm(comment: Comment | null) {
    this.commentForRemoval = comment
  }

  commentRemoved() {
    if (!this.commentForRemoval) return
    this.commentService.removeComment(this.commentForRemoval)
    this.commentForRemoval = null
  }

  commentAdded(commentAddObj: CommentAddObj) {
    const { txt, parentCommentId } = commentAddObj

    // TS Fix:
    if (!this.loggedUser) return

    const newComment: Comment = {
      parentCommentId: parentCommentId || null, ownerId: this.loggedUser?.id, txt,
      createdAt: Date.now().toString(), deletedAt: ''
    }

    this.commentService.saveComment(newComment)
  }

}
