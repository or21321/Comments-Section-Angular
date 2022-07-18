import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './cmps/app-header/app-header.component';
import { CommentsAppComponent } from './pages/comments-app/comments-app.component';
import { CommentListComponent } from './cmps/comment-list/comment-list.component';
import { CommentPreviewComponent } from './cmps/comment-preview/comment-preview.component';
import { CommentAddComponent } from './cmps/comment-add/comment-add.component';
import { DeleteConfirmComponent } from './cmps/delete-confirm/delete-confirm.component';
import { MomentPipe } from './pipes/moment.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    CommentsAppComponent,
    CommentListComponent,
    CommentPreviewComponent,
    CommentAddComponent,
    DeleteConfirmComponent,
    MomentPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
