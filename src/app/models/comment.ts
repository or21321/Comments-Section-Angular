export interface Comment {
    id: number
    parentCommentId: null | number
    ownerId: number
    txt: string
    createdAt: string
    deletedAt: null | string
}

export type Comments = Comment[]