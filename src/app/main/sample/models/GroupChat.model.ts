import { Chat } from './chat.model';

export class GroupChat {
    constructor(public name: string, public chat: Chat[]) {}
}