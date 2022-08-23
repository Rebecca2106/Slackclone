export class Thread {
    threadID: string;
    last_updated: any;
    messages: Array<string>;

    constructor(obj?: any) {
        this.threadID = obj ? obj.threadID : '';
        this.last_updated = obj ? obj.last_updated : '';
        this.messages = obj ? obj.messages : [];
    }

    public toJSON() {
        return {
            threadID: this.threadID,
            last_updated: this.last_updated,
            messages: this.messages
        }
    }
}