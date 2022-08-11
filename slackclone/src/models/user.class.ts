export class User {
    fullname: string;
    nickname: string;
    job: string;
    image: File;


    constructor(obj?: any) {
        this.fullname = obj ? obj.fullname : '';
        this.nickname = obj ? obj.nickname : '';
        this.job = obj ? obj.job : '';
        this.image = obj ? obj.job : '';
    }

    public toJSON() {
        return {
            fullname: this.fullname,
            nickname: this.nickname,
            job: this.job,
            image: this.image
        }
    }
}