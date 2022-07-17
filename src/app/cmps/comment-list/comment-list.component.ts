import { Component, Input, OnInit } from '@angular/core';
import { Comments } from 'src/app/models/comment';

@Component({
  selector: 'comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

  @Input() comments: Comments | null = null

  constructor() { }

  ngOnInit(): void {
  }

}
