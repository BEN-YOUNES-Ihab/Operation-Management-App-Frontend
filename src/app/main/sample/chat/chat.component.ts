import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Chat } from '../models/chat.model';
import { GroupChat } from '../models/GroupChat.model';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @ViewChild('scrollMe') scrollMe: ElementRef;
  scrolltop: number = null;
  today: number = Date.now();
  groupchat: GroupChat = new GroupChat('Test Chat', [
    new Chat('user', "Hi", this.today),
    new Chat('other',"Hello",this.today),
    new Chat('other',"How are you ?",this.today)
  ]);
  form = new FormGroup({
    first: new FormControl(),
  });
  constructor(private _coreSidebarService: CoreSidebarService) { 
    setInterval(() => {this.today = Date.now()}, 1);
  }

  ngOnInit(): void {
    this.scrolltop = this.scrollMe.nativeElement.scrollHeight;

  }
  onSubmit(input: string) {
    this.groupchat.chat.push( new Chat('user',input,this.today));  
    this.scrolltop = this.scrollMe.nativeElement.scrollHeight;
    this.form.reset();
  }

    /**
   * Toggle Sidebar
   *
   * @param name
   */
     toggleSidebar(name) {
      this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    }
}

