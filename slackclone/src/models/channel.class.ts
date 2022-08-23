export class Channel {
    title: string;
    description: string;
    created: Object;
    members: Array<any>;
    messages: Array<any>;
 
    constructor(obj?: any) {
        this.title = obj ? obj.title : "";
        this.description = obj ? obj.description : "";
        this.created = obj ? obj.created : {"uid": "", "timestamp": null};
        this.members = obj ? obj.members : [{"uid": "", "read": null, "last_updated": null, "viewed_messages": null}];
        this.messages = obj ? obj.messages : [];
    }

    public toJSON() {
        return {
            title: this.title,
            description: this.description,
            created: this.created,
            members: this.members,
            messages: this.messages
        }
    }
}