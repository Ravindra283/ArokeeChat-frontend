import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatAppService {
  apiUrl = "http://localhost:3000/api/";
  constructor(private http: HttpClient) { }

  login(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'login', data);
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'getAllUsers');
  }
  getChatHistory(senderId: string, receiverId: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + `getChatHistory/${senderId}/${receiverId}`);
  }
}
