export interface AppUser {
    id: number;
    user_no: string;
    app_role: AppRole;
    email: string;
    firstname: string;
    lastname: string;
    phone_code: number;
    phone_no: string;
    last_login: Date;
    status: number;
}

export interface AppUserToken {
    access_token: string;
    refresh_token: string;
    expired_at: Date;
    role: number;
    app_user: AppUser;
}

export interface AppRole {
    id: number;
    name: string;
    role: number;
}
