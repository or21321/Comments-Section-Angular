import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User, Users } from '../models/user';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //mock the server
  private _usersDb: User[] = []

  private _users$ = new BehaviorSubject<User[]>([])
  public users$ = this._users$.asObservable()

  constructor(private http: HttpClient, private utilService: UtilService) {
  }


  public loadUsers(): void {
    const usersFromStorage = this.utilService.loadFromStorage('usersDb')

    if (usersFromStorage) {
      console.log('usersFromStorage', usersFromStorage);
      this._usersDb = usersFromStorage
      this._sendUsers(this._usersDb)
    } else {
      this._getUsersFromJson()
    }

    // .pipe(map(res =>  res))   
    // if (filterBy && filterBy.term) {
    //   users = this._filter(users, filterBy.term)
    // }
    // this._users$.next(this._sort(users))
  }

  private _getUsersFromJson() {
    this.http.get<Array<User>>('assets/data/users.json').pipe(
      // map((users: Array<object>) => {
      //   return users.filter((_, idx) => idx < amount)
      //     .map(user => user)
      // })
    ).subscribe({
      next: (users: Users) => {
        console.log('_getUsersFromJson', users);

        this._usersDb = users
        this._sendUsers(users)
        this._saveUsersToStorage()
      },
      error: err => console.log(err),
    })
  }


  public getUserById(id: number): Observable<User> {
    //mock the server work
    const user = this._usersDb.find(user => user.id === id)

    //return an observable
    if (!user) return throwError(`User not found with id ${id}`)
    return of(user) //: Promise.resolve(null)//Observable.throw(`User id ${id} not found!`)
  }

  private _saveUsersToStorage() {
    this.utilService.saveToStorage('usersDb', this._users$.getValue())
  }

  private _sendUsers(users: Users) {
    this._users$.next(users)
  }
}
