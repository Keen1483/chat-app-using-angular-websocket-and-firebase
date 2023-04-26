import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../environments/environment'
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Database, getDatabase, ref, set, onValue  } from "firebase/database";
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { Chat } from './models/chat.model';
import * as AdaptiveCards from 'adaptivecards';
import { profile } from './profile';
import { ElementRef } from '@angular/core';
import { chat } from './chat';
import { ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'firechat';

  @ViewChild('profileContainer') profileContainer: ElementRef;

  app: FirebaseApp;
  db: Database;
  form: FormGroup;
  username = '';
  message = '';
  chats: Chat[] = [];
  schema: any[] = [];

  constructor(private formBuilder: FormBuilder,
              private datePipe: DatePipe) {
    this.app = initializeApp(environment.firebase);
    this.db = getDatabase(this.app);
    this.form = this.formBuilder.group({
      'message' : [],
      'username' : []
    });
  }

  ngOnInit(): void {
    let adaptiveCard = new AdaptiveCards.AdaptiveCard();
    const chatsRef = ref(this.db, 'chats');
    onValue(chatsRef, (snapshot: any) => {
      const data = snapshot.val();
      for(let id in data) {
        if (!this.chats.map(chat => chat.id).includes(id)) {
          this.chats.push(data[id]);
          this.schema.push({
            "type": "TextBlock",
            "text": this.datePipe.transform(data[id].timestamp, 'short') + "  \n" + data[id].message,
            "wrap": "true",
            "spacing": "None"
          });
        }
      }
      chat["body"] = this.schema;
      adaptiveCard.parse(chat);
      adaptiveCard.render(document.getElementById('history') || undefined);

      this.ngAfterViewInit();
    });

    adaptiveCard = new AdaptiveCards.AdaptiveCard();
    adaptiveCard.parse(profile);
    let renderCard = adaptiveCard.render(document.getElementById('profileContent') || undefined);

  }

  onChatSubmit(form: any) {
    const chat = form;
    chat.timestamp = new Date().toString();
    chat.id = uuidv4();
    set(ref(this.db, `chats/${chat.id}`), chat);
    this.form = this.formBuilder.group({
      'message' : [],
      'username' : [chat.username],
    });
  }

  ngAfterViewInit(): void {
    $(document).ready(function() {
      $('#history .ac-textBlock').parent().css('background', 'transparent');
      $('#history .ac-textBlock').css('background', 'hsl(0, 0%, 14%)').css('color', '#fff');
      
      $('#history .ac-textBlock').contents().wrap('<div></div>');
      
      // let profileImg = document.createElement('div');
      // profileImg.style.width = '60px';
      // profileImg.style.height = '60px';
      // profileImg.style.borderRadius = '6px';
      // profileImg.className = 'profile-img';
      // $('#history .ac-textBlock').prepend(profileImg);

      // if ($('.profile-img').length) {
      //   for (let ele of $('.profile-img')) {
      //     let hue = Math.floor(Math.random() * 18) * (360 / 18);
      //     let profileImgColor = `hsl(${hue}, 40%, 55%)`;
      //     $(ele).css('background-color', profileImgColor);
      //   }

      // }
    });
    
  }
}
