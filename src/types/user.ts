// just the types of user for freaking typescript

export interface User {
    id: number,
    username: string,
    email: string,
    avatarUrl?: string;
    bio?: string,
    createdAt: string,
}

export interface UserProfile extends User {
    watchlistCount: number,
    watchedCount: number,
    reviewCount: number,
    followersCount: number,
    followingCount: number,
}



export interface Review {
    id: number,
    userId: number,
    movieId: number,
    content: string,
    rating: number,
    createdAt: string,
    updatedAt?: string,
    username?: string,
    avatarUrl?: string,
}   

export interface Follow {
    id: number,
    username: string,
    avatarUrl?: string,
    bio?: string,
    followedAt: string,
}