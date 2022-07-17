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
  commentIdForRemoval: string | number | null = null

  constructor(private commentService: CommentService, private userService: UserService) {
    this.comments$ = this.commentService.comments$
    // this.commentService.comments$.subscribe((comments) => {
    //   // let commentsWithUsers = this._getCommentsWithUsers(comments)
    //   // commentsWithUsers = this._getCommentsWithHierarchy(commentsWithUsers)
    //   this.comments = commentsWithUsers
    // },
    //   err => console.log(err),
    //   () => console.log('comments$ Complete!')
    // )
  }

  ngOnInit(): void {
    this.commentService.loadComments()
  }

  async commentUpdated(comment: Comment) {
    try {
      console.log('commentUpdated', comment);
      await this.commentService.saveComment(comment).toPromise()
    } catch (err) {
      console.log(err);
    }
  }

  openDeleteConfirm(id: number | string) {
    this.commentIdForRemoval = id
  }

  commentRemoved() {
    if (!this.commentIdForRemoval) return
    this.commentService.removeComment(this.commentIdForRemoval)
    this.commentIdForRemoval = null
  }

  commentAdded(commentAddObj: CommentAddObj) {
    console.log('HEY');
    const { txt, parentCommentId } = commentAddObj
    console.log('parentCommentId', parentCommentId);
    // TS Fix:
    if (!this.loggedUser) return

    const newComment: Comment = {
      parentCommentId: parentCommentId || null, ownerId: this.loggedUser?.id, txt,
      createdAt: '' + Date.now(), deletedAt: ''
    }

    this.commentService.saveComment(newComment)
  }

}
