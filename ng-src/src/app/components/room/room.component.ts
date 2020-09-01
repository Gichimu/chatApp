import { Observable } from 'rxjs';
import { SocketService } from './../../services/socket.service';
import { AuthService } from './../../services/auth.service';

import { Component, OnInit, ViewChild, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { auth } from 'firebase/app';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {

  chatMessage: any;
  msg = {
    username: '',
    text: '',
  };
  username: string;
  sidenavOpen = false;
  currentUsers: string[] = [];
  chatMessages: any[] = [];
  user$: Observable<firebase.User> = this.authservice.user$;
  constructor(
    private readonly socket: SocketService,
    private readonly authservice: AuthService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // get the user details
    this.user$.subscribe((user) => {
      this.username = user.displayName;
      this.snackbar.open(`Hi ${this.username}, welcome to the chat.`, 'Ok', {
        duration: 5000,
      });
      this.currentUsers.push(this.username);
    });

    // get the welcome chat message
    this.socket.listen('message').subscribe((chat) => {
      this.chatMessages.push(chat);
    });

    console.log(this.chatMessages);
  }

  

  sendMessage(): void {
    this.msg.username = this.username;
    this.msg.text = this.chatMessage;
    this.socket.emit('chatMessage', this.msg);
    this.chatMessage = '';
  }

  leaveChat(): void {
    this.socket.disconnect();
  }
}
