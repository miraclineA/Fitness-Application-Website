import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  api = 'http://localhost:3000/registrationDetails'

  postRegistration(registerObj: any) {
    return this.http.post(`${this.api}`, registerObj)
  }

  getRegisterUser() {
    return this.http.get(this.api)
  }
  updateRegisterUser(registerObj: any, id: any) {
    return this.http.put(`${this.api}/${id}`, registerObj)
  }
  deleteRegistered(id: any) {
    return this.http.delete(`${this.api}/${id}`)

  }

  getRegisteredUserId(id: any) {
    return this.http.get(`${this.api}/${id}`)
  }
}
