import { User, Users } from "./user"

// export interface Comment {
//     id: number
//     parentCommentId: null | number
//     ownerId: number
//     txt: string
//     createdAt: string
//     deletedAt: null | string
//     miniUser?: User
//     replies?: Comments
// }

export class Comment {

    // public name: string = '',
    // public email: string = '',
    // public phone: string = '',
    // public _id?: string) {
    constructor(
        public parentCommentId: string | null | number = null,
        public ownerId: string | number,
        public txt: string,
        public createdAt: string = '' + Date.now(),
        public deletedAt: null | string = '',
        public miniUser?: User,
        public replies?: Comments,
        public id?: number | string
    ) { }

    setId?() {
        // Implement your own set Id
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 8; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        this.id = text
    }
}


export type Comments = Comment[]

export interface CommentAddObj {
    txt: string
    parentCommentId: string | number | null | undefined
}