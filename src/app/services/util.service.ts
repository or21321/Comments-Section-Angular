import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public makeId(length = 5) {
    var text = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text;
  }

  public loadFromStorage(key: string) {
    const itemStr = localStorage.getItem(key)
    if (!itemStr) return
    return JSON.parse(itemStr)
  }

  public saveToStorage<valType>(key: string, val: valType) {
    localStorage.setItem(key, JSON.stringify(val))
  }

  constructor() { }
}
