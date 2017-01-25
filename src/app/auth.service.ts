import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';


@Injectable()
export class AuthService {

  constructor(private http: Http) 
  {

  }

  register(data)
  {
    // return this.http.post('/register', data)
    //   .map(res => res.json());

    let bodyString = JSON.stringify(data); // Stringify payload
    let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let options       = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post('/register', data, options) // ...using post request
                      .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
  }

  login(data)
  {
    // return this.http.post('/login', data)
    //   .map(res => res.json());

    let bodyString = JSON.stringify(data); // Stringify payload
    let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let options       = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post('/login', data, options) // ...using post request
                      .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
  }

  getUsers()
  {
    return this.http.get('/users') // ...using post request
                      .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
  }
}
