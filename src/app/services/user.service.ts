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

  private _loggedUser$ = new BehaviorSubject<User | null>(null)
  public loggedUser$ = this._loggedUser$.asObservable()

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

  public login(id: number): void | Observable<string> {
    try {
      console.log('id', id);
      
      if (!id) return this._loggedUser$.next(null)

      const user = this._usersDb.find(user => user.id == id)
      if (!user) return throwError(`User not found with id ${id}`)

      this._loggedUser$.next(user)
    } catch (err) {
      console.log(err);
      throw err
    }
  }

  private _saveUsersToStorage() {
    this.utilService.saveToStorage('usersDb', this._users$.getValue())
  }

  private _sendUsers(users: Users) {
    this._users$.next(users)
  }
}
