export interface Post {
    _id: string,
    _createdAt: string,
    title: string,
    author: {
        name: string,
        image: string,       
    },
    description: string,
    mainImage: {
        asset: {
            url: string
        }
    },
    slug: {
        current: string
    }
    body: any
    comments: Comment[],
}

export interface Comment {
    _id: string,
    name: string,
    email: string,
    comment: string,
    post: {
        _ref: string,
        _type: string
    },
    approved: boolean,
    _createdAt: string,
    _updatedAt: string,
    _rev: string,
    _type: string
}   