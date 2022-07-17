import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators'
import { Comment, Comments } from '../models/comment';
import { CommentFilter } from '../models/comment-filter';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  //mock the server
  private _commentsDb: Comment[] = []

  private _comments$ = new BehaviorSubject<Comment[]>([])
  public comments$ = this._comments$.asObservable()
  //filter
  private _filterBy$ = new BehaviorSubject<CommentFilter>({ region: 'all', txt: '' })
  public filterBy$ = this._filterBy$.asObservable()

  constructor(private http: HttpClient, private utilService: UtilService) {
  }


  public loadComments(): void {
    const commentsFromStorage = this.utilService.loadFromStorage('commentsDb')

    if (commentsFromStorage) {
      console.log('commentsFromStorage', commentsFromStorage);
      this._commentsDb = commentsFromStorage
      this._sendComments(this._commentsDb)
    } else {
      this._getCommentsFromJson()
    }

    // .pipe(map(res =>  res))   
    // if (filterBy && filterBy.term) {
    //   comments = this._filter(comments, filterBy.term)
    // }
    // this._comments$.next(this._sort(comments))
  }

  private _getCommentsFromJson() {
    this.http.get<Array<Comment>>('assets/data/comments.json').pipe(
      // map((comments: Array<object>) => {
      //   return comments.filter((_, idx) => idx < amount)
      //     .map(comment => comment)
      // })
    ).subscribe({
      next: (comments: Comments) => {
        console.log('_getCommentsFromJson', comments);

        this._commentsDb = comments
        this._sendComments(comments)
        this._saveCommentsToStorage()
      },
      error: err => console.log(err),
    })
  }


  public getCommentById(id: number): Observable<Comment> {
    //mock the server work
    const comment = this._commentsDb.find(comment => comment.id === id)

    //return an observable
    if (!comment) return throwError(`Comment not found with id ${id}`)
    return of(comment) //: Promise.resolve(null)//Observable.throw(`Comment id ${id} not found!`)
  }

  public removeComment(id: number) {
    //mock the server work
    this._commentsDb = this._commentsDb.filter(comment => comment.id !== id)

    this._sendComments(this._commentsDb)
    this._saveCommentsToStorage()
  }

  public saveComment(comment: Comment) {
    console.log('save comment', comment);

    return comment.id ? this._updateComment(comment) : this._addComment(comment)
  }

  private _updateComment(comment: Comment) {
    this._commentsDb = this._commentsDb.map(c => comment.id === c.id ? comment : c)

    this._sendComments(this._commentsDb)
    this._saveCommentsToStorage()
    return of(comment)

  }

  private _addComment(comment: Comment) {
    //mock the server work

    // const newComment = new Comment(comment.name, comment.email, comment.phone);
    // newComment.setId();

    // this._commentsDb.push({ ...newComment })

    // this._comments$.next(this._sort(this._commentsDb))
    this._sendComments(this._commentsDb)
    this._saveCommentsToStorage()
    return of(comment)
  }


  // private _sort(comments: Comment[]): Comment[] {
  //   return comments.sort((a, b) => {
  //     if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
  //       return -1;
  //     }
  //     if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
  //       return 1;
  //     }

  //     return 0;
  //   })
  // }

  setFilter(filterBy: CommentFilter) {
    this._filterBy$.next(filterBy)
    this._filter()
  }

  private _filter(): void {
    // const comments = this.utilService.loadFromStorage('commentsDb')
    // const filterBy = this._filterBy$.getValue()

    // const { region, txt } = filterBy
    // let commentsToShow = JSON.parse(JSON.stringify(comments))

    // if (region && region !== 'all') {
    //   commentsToShow = commentsToShow.filter((comment: any) => comment.region === region)
    // }

    // if (txt) {
    //   const nameRegex = new RegExp(txt, 'i')
    //   commentsToShow = commentsToShow.filter((comment: any) => nameRegex.test(comment.name))
    // }

    // this._sendComments(commentsToShow)
  }

  private _saveCommentsToStorage() {
    this.utilService.saveToStorage('commentsDb', this._comments$.getValue())
  }

  private _sendComments(comments: Comments) {
    this._comments$.next(comments)
  }
}
