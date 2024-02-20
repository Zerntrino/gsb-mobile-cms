export interface AppUserToken {
  token: string;
  id: number;
  name: string;
  imageUrl: string;
}

export enum UserPermission {
  Promotion = 'promotion',
  Setting = 'setting',
}

export interface AppUserPermission {
  menu: UserPermission[];
}
