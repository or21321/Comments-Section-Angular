import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { concatMap, map, mergeMap, tap } from 'rxjs/operators'
import { Comment, Comments } from '../models/comment';
import { CommentFilter } from '../models/comment-filter';
import { UtilService } from './util.service';
import { User, Users } from '../models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  //mock the server
  private _commentsDb: Comment[] = []

  private _comments$ = new BehaviorSubject<Comments>([])
  public comments$ = this._comments$.asObservable().pipe(
    map(comments => this._getCommentsWithUsers(comments)),
    map(comments => this._getCommentsWithHierarchy(comments))
    // map(comments => this._getCommentsWithHierarchy(comments))
  )
  // .pipe(
  // concatMap((arr) => from(arr)),
  // concatMap((arr) => from(arr)),
  // mergeMap(async comment => {
  //   const miniUser = await this._getMiniUser(comment.ownerId)
  //   const commentWithUser: Comment = { ...comment, miniUser }
  //   return commentWithUser
  // })
  // )
  // .pipe(
  //   )
  //   mergeMap(async (comment) => {
  //   console.log('comment', comment);
  //   return comment
  // })
  // )
  // mergeMap(async (comments) => {
  // console.log('comments', comments);
  // return comments
  //   return comments.map(async (comment) => {
  //     const miniUser = await this._getMiniUser(comment.ownerId)
  //     const commentWithUser: Comment = { ...comment, miniUser }
  //     return commentWithUser
  //   })
  // })
  //filter
  private _filterBy$ = new BehaviorSubject<CommentFilter>({ region: 'all', txt: '' })
  public filterBy$ = this._filterBy$.asObservable()

  constructor(private http: HttpClient, private utilService: UtilService, private userService: UserService) {
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

  private _getCommentsWithHierarchy(comments: Comments): Comments {
    console.log('comment', comments.length);

    const commentsWithHierarchy: Comments = []
    const commentsCopy: Comments = JSON.parse(JSON.stringify(comments))
    // Build root node:
    commentsCopy.forEach((comment) => {
      // Create replies for each comment (could be better inside the pipe)
      comment.replies = []
      const { parentCommentId } = comment
      if (!parentCommentId) {
        commentsWithHierarchy.push(comment)
        const idx = commentsCopy.findIndex(c => c.id === comment.id)
        commentsCopy.splice(idx, 1)
      }
    })

    let count = 0
    while (commentsCopy.length && count < 1000 ) {
      console.log('commentsCopy.length', commentsCopy.length);

      for (var i = 0; i < commentsCopy.length; i++) {
        const comment = commentsCopy[i]

        // Two problems here: using any & support only a specific depth of replies (4) instead of using a recursion
        let parentComment: undefined | Comment = this._getParentCommentRecursive(comment, commentsWithHierarchy)

        if (!parentComment) {
          count++
          continue
        }
        parentComment.replies?.push(comment)

        const childCommentIdx = commentsCopy.findIndex(c => c.id === comment.id)
        commentsCopy.splice(childCommentIdx, 1)
        count++
      }
      // commentsCopy.forEach(comment => {
      // })
    }

    console.log('commentsWithHierarchy', commentsWithHierarchy);
    console.log(count, commentsCopy);

    return commentsWithHierarchy
  }

  _getParentCommentRecursive(comment: Comment, commentsWithHierarchy: Comments): Comment | undefined {
    let parentComment

    for (var i = 0; i < commentsWithHierarchy.length; i++) {
      const currComment = commentsWithHierarchy[i]

      if (currComment.id === comment.parentCommentId) {
        parentComment = currComment
        break
      }
      else if (currComment?.replies?.length) {
        parentComment = this._getCommentParentFromReplies(comment, currComment)
        if (parentComment) break
      }
    }
    // commentsWithHierarchy.forEach(c => {
    // })

    return parentComment
  }

  private _getCommentParentFromReplies(comment: Comment, commentWithReplies: Comment): Comment | undefined {
    let parentComment: Comment | undefined
    const { replies } = commentWithReplies
    if (!replies) return undefined

    for (var i = 0; i < replies.length; i++) {
      const currReply = replies[i]
      if (currReply.id === comment.parentCommentId) {
        parentComment = currReply
        break
      }
      else if (currReply.replies?.length) {
        parentComment = this._getParentCommentRecursive(comment, currReply.replies)
        if (parentComment) break
      }
    }
    // commentWithReplies.replies?.forEach(reply => {
    // })

    return parentComment
  }

  private _getCommentsWithUsers(comments: Comments) {
    let users: Users
    this.userService.users$.subscribe(_ => users = _)

    return comments.map((comment) => {
      const miniUser = users?.find(user => user.id == comment.ownerId)
      const commentWithUser: Comment = { ...comment, miniUser }

      return commentWithUser
    })
  }

  private _getCommentsFromJson() {
    this.http.get<Comments>('assets/data/comments.json').pipe(
      // map(comments => this._getCommentsWithUsers(comments)),
      // map(comments => this._getCommentsWithHierarchy(comments))
      // map((comments: Comments): Comments => {
      //   return comments.map((comment) => {
      //     // const miniUser = this._getMiniUser(comment.ownerId)
      //     const miniUser: User = { id: 1, displayName: 'Bruv' }
      //     const commentWithUser: Comment = {
      //       ...comment, miniUser
      //     }
      //     console.log('commentWithUser', commentWithUser);
      //     return commentWithUser
      //   })
      //   // return comments
      // })
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

  public removeComment(id: number | string) {
    //mock the server work

    console.log('this._commentsDb', this._commentsDb);
    this._commentsDb = this._commentsDb.filter(comment => {
      // console.log(comment.id !== id);
      // console.log(comment.parentCommentId === id);

      return (comment.id !== id)
    }).filter(comment => {
      console.log(comment.parentCommentId, id);
      console.log(comment.parentCommentId !== id);
      return comment.parentCommentId !== id
    })
    console.log('this._commentsDb', this._commentsDb);

    this._sendComments(this._commentsDb)
    this._saveCommentsToStorage()
  }

  public saveComment(comment: Comment) {
    try {
      console.log('save comment', comment);

      return comment.id ? this._updateComment(comment) : this._addComment(comment)
    } catch (err) {
      console.log(err);
      throw err
    }
  }

  private _updateComment(comment: Comment) {
    const updatedComment: Comment = { ...comment, createdAt: Date.now().toString() }
    this._commentsDb = this._commentsDb.map(c => comment.id === c.id ? updatedComment : c)

    this._sendComments(this._commentsDb)
    this._saveCommentsToStorage()
    return of(comment)

  }

  private _addComment(comment: Comment): Observable<Comment> {
    //mock the server work
    const { parentCommentId, ownerId, txt, createdAt, deletedAt }: {
      parentCommentId: undefined | number | string | null,
      ownerId: string | number, txt: string,
      createdAt: string, deletedAt: string | null
    } = comment

    const newComment = new Comment(parentCommentId, ownerId,
      txt, createdAt, deletedAt);
    // TS Fix:
    if (!newComment.setId) return throwError('Couldnt add comment ')
    newComment.setId();
    console.log('newComment', newComment);

    this._commentsDb.push({ ...newComment })

    // this._comments$.next(this._sort(this._commentsDb))
    this._sendComments(this._commentsDb)
    this._saveCommentsToStorage()
    return of(newComment)
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

class CommentClass {

  constructor(private txt: string) {

  }
}