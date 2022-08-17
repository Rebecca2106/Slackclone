export class Thread {
    last_updated: any;
    messages: Array<string>;

    constructor(obj?: any) {
        this.last_updated = obj ? obj.last_updated : '';
        this.messages = obj ? obj.messages : [];
    }

    public toJSON() {
        return {
            last_updated: this.last_updated,
            messages: this.messages
        }
    }
}