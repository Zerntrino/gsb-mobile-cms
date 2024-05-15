export interface LeftMenu {
  title: string;
  icon: string;
  active: boolean;
  to: string;
  items: LeftMenu[];
}

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

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
