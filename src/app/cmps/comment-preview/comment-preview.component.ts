import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/models/comment';

@Component({
  selector: 'comment-preview',
  templateUrl: './comment-preview.component.html',
  styleUrls: ['./comment-preview.component.scss']
})
export class CommentPreviewComponent implements OnInit {

  @Input() comment: Comment | null = null

  constructor() { }

  ngOnInit(): void {
  }

}
