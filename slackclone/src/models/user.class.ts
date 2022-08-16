export class User {
    uid: string;
    fullname: string;
    nickname: string;
    job: string;
    image: string;
    email: string;
    phone: string;
    onlineState: boolean;
    stateText: string;


    constructor(obj?: any) {
        this.uid = obj ? obj.uid : '';
        this.fullname = obj ? obj.fullname : '';
        this.nickname = obj ? obj.nickname : '';
        this.job = obj ? obj.job : '';
        this.image = obj ? obj.image : '';
        this.email = obj ? obj.email : '';
        this.phone = obj ? obj.phone : '';
        this.onlineState = obj ? obj.onlineState : false;
        this.stateText = obj ? obj.stateText : '';
    }

    public toJSON() {
        return {
            uid: this.uid,
            fullname: this.fullname,
            nickname: this.nickname,
            job: this.job,
            image: this.image,
            email: this.email,
            phone: this.phone,
            onlineState: this.onlineState,
            stateText: this.stateText
        }
    }
}