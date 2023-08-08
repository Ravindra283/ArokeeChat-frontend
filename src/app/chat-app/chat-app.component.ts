import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { MessagesService } from '../messages.service';
import { ChatMessage } from '../chat-message';
import { Observable, Subscription } from 'rxjs';
import { ChatAppService } from './chat-app.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-chat-app',
  templateUrl: './chat-app.component.html',
  styleUrls: ['./chat-app.component.scss']
})
export class ChatAppComponent implements AfterViewChecked {
  @ViewChild('chatContainer', { static: false }) chatContainerRef!: ElementRef;


  chatContacts: any;
  messageHistory: any = [];
  // = [
  //   {
  //     timestamp: '10:10 AM, Today',
  //     sender: 'Olia',
  //     text: 'Hi Vincent, how are you? How is the project coming along?',
  //     isReceiver: false
  //   },
  //   {
  //     timestamp: '10:12 AM, Today',
  //     sender: 'Vincent',
  //     text: 'Are we meeting today? Project has been already finished and I have results to show you.',
  //     isReceiver: true
  //   },
  //   {
  //     timestamp: '10:14 AM, Today',
  //     sender: 'Olia',
  //     text: 'Well I am not sure. The rest of the team is not here yet. Maybe in an hour or so? Have you faced any problems at the last phase of the project?',
  //     isReceiver: false
  //   },
  //   {
  //     timestamp: '10:20 AM, Today',
  //     sender: 'Vincent',
  //     text: 'Actually everything was fine. Im very excited to show this to our team.',
  //     isReceiver: true
  //   }
  // ];
  showChat: boolean = false;
  userContact: any;
  newMessage!: string;
  roomName!: string;
  receiverData: any = {
    name: 'Vincent',
    isReceiver: true
  };
  currentUser: any;
  chattingWith: any;

  constructor(
    private messageService: MessagesService,
    private chatAppService: ChatAppService,
    private router: Router) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    try {
      const container = this.chatContainerRef.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch (err) {
      console.error('Error while scrolling to bottom:', err);
    }
  }
  model = new ChatMessage("");

  messageList: string[] = [];

  ngOnInit(): void {
    this.currentUser = localStorage.getItem('userData')
    if (!this.currentUser) {
      this.router.navigate(["/"]);
    } else {
      this.currentUser = JSON.parse(this.currentUser)
    }

    this.chatAppService.getAllUsers().subscribe((res) => {
      if (res) {
        this.chatContacts = res.filter((contact: any) => contact._id != this.currentUser._id);
        console.log(res)
      }
    })

    this.messageService.getMessage().subscribe((message: any) => {
      console.log(this.currentUser._id, message.sender.userId)
      if (this.currentUser._id != message.sender.userId) {
        this.messageHistory.push(
          {
            // timestamp: '10:20 AM, Today',
            sender: message.sender.name,
            text: message.text,
            isReceiver: false
          })
      }
    })

    this.messageService.getActiveUser().subscribe((users: any) => {
      // this.messageList.push(message);
      console.log('active users', users)
      this.chatContacts.map((chatContact: any) => {
        if (users.some((user: any) => user.userId === chatContact._id)) {
          chatContact.status = 'Online'
        } else {
          chatContact.status = 'Offline'
        }
      })
      console.log('this.chat', this.chatContacts)
    })
  }

  sendMessage() {
    console.log('new message', this.model.msg)
    if (this.newMessage) {
      const message = {
        sender: {
          userId: this.currentUser._id,
          name: this.currentUser.name
        },
        receiver: {
          userId: this.chattingWith._id,
          name: this.chattingWith.name
        },
        text: this.newMessage,
        roomName: this.roomName
      };
      this.messageService.sendMessage(message);

      this.messageHistory.push(
        {
          timestamp: '10:20 AM, Today',
          sender: this.currentUser.name,
          text: this.newMessage,
          isReceiver: this.receiverData.isReceiver
        })
      this.newMessage = "";
    }
  };

  submitted = false;

  onSubmit() {
    this.sendMessage()
    this.submitted = true;

  }

  initiateChat(contact: any) {
    this.messageHistory = []
    this.chattingWith = contact;
    const rowRoomName = `${this.currentUser.email}--with--${this.chattingWith.email}`
    let split = rowRoomName.split('--with--'); // ['username2', 'username1']
    let unique = [...new Set(split)].sort((a, b) => (a < b ? -1 : 1)); // ['username1', 'username2']
    this.roomName = `${unique[0]}--with--${unique[1]}`;
    this.messageService.joinChat(this.roomName, this.currentUser._id);

    this.chatAppService.getChatHistory(this.currentUser._id, this.chattingWith._id).subscribe((res) => {
      if (res && res.length > 0) {
        this.messageHistory = res.map((message: any) => {
          const isReceiver = message.sender.userId == this.currentUser._id;
          return {
            text: message.text,
            isReceiver: isReceiver
          }
        });
      }
    })
    this.showChat = true;
  }
}