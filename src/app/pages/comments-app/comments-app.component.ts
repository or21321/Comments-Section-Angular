import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Comments } from 'src/app/models/comment';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'comments-app',
  templateUrl: './comments-app.component.html',
  styleUrls: ['./comments-app.component.scss']
})
export class CommentsAppComponent implements OnInit {

  comments$: Observable<Comments>

  constructor(private commentService: CommentService) {
    this.comments$ = this.commentService.comments$
  }

  ngOnInit(): void {
    this.commentService.loadComments()
  }

}
