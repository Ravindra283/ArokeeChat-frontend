import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Observer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private socket: Socket) { }

  sendMessage(message: any){
    console.log(message)
    this.socket.emit('message', message);
  }


  getMessage(){
  return  new Observable((observer: Observer<any>)=>{
      this.socket.on('message', (message:string)=>{
        observer.next(message)
      })
    })
  }

  getActiveUser(){
    return  new Observable((observer: Observer<any>)=>{
        this.socket.on('get-users', (users:any)=>{
          observer.next(users)
        })
      })
    }

  joinChat(roomName: string, userId: number) {
    this.socket.emit('join', {roomName, userId})
  }

}