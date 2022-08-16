export class Channel{
    channelName: string;
    channelDescription: string;

    constructor(obj?: any) {
        this.channelName = obj ? obj.channelName : '';
        this.channelDescription = obj ? obj.channelDescription : '';
    }

    toJSON() {
        return {
            channelName: this.channelName,
            channelDescription: this.channelDescription
        }
    }



}