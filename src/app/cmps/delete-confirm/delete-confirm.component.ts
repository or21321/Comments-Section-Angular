import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.scss']
})
export class DeleteConfirmComponent implements OnInit {

  @Output() cancel = new EventEmitter()
  @Output() delete = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

}
