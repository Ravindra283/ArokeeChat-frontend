import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl = environment.API_ENDPOINT;
  constructor(private http: HttpClient) { }

  signup(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'createUser', data);
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'login', data);
  }

}
