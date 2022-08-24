export class Message {
    timestamp: any;
    creator: string;
    message: string;
    images: Array<any>;
    docs: Array<any>;
    thread: string;
    threadAvailable: Boolean;
 
    constructor(obj?: any) {
        this.timestamp = obj ? obj.timestamp : '';
        this.creator = obj ? obj.creator : '';
        this.message = obj ? obj.message : '';
        this.images = obj ? obj.images : [];
        this.docs = obj ? obj.docs : [];
        this.thread = obj ? obj.thread : [];
        this.threadAvailable = obj ? obj.threadAvailable : "";
    }

    public toJSON() {
        return {
            timestamp: this.timestamp,
            creator: this.creator,
            message: this.message,
            images: this.images,
            docs: this.docs,
            thread: this.thread,
            threadAvailable: this.threadAvailable
        }
    }
}