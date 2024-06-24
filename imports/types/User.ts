export interface UserEmail {
    address: string;
    verified: boolean;
}

export interface CV {
    name: string;
    url: string;
}

export interface UserProfile {
    name?: string;
    cvs?: CV[];
}

export interface User {
    _id: string;
    emails: UserEmail[];
    profile?: UserProfile;
}
