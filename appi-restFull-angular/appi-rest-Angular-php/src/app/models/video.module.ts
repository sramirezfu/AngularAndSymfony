export class Video{
    constructor(
        public id:number,
        public user_id:number,
        public category_id:number,
        public title:string,
        public content:string,
        public url:string,
        public status:string,
        public createAtt:any
    ){}
}