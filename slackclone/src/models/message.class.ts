export class Message {
    timestamp: any;
    creator: string;
    message: string;
    images: Array<any>;
    docs: Array<any>;
 
    constructor(obj?: any) {
        this.timestamp = obj ? obj.timestamp : '';
        this.creator = obj ? obj.creator : '';
        this.message = obj ? obj.message : '';
        this.images = obj ? obj.images : [];
        this.docs = obj ? obj.docs : [];
    }

    public toJSON() {
        return {
            timestamp: this.timestamp,
            creator: this.creator,
            message: this.message,
            images: this.images,
            docs: this.docs
        }
    }
}