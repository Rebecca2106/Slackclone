export class DM {
    members: Array<any>;
    messages: Array<any>;
 
    constructor(obj?: any) {
        this.members = obj ? obj.members : [{"uid": "", "read": null, "last_updated": null, "viewed_messages": null}];
        this.messages = obj ? obj.messages : [{"messageID": null, "threadID": null}];
    }

    public toJSON() {
        return {
            members: this.members,
            messages: this.messages
        }
    }
}