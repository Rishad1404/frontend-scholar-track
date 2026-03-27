export interface ILoginResponse {
    token: string;
    accessToken: string;
    refreshToken: string;
    user:{
        needPasswordChange: boolean;
        email: string;
        name: string;
        role: string;
        image: string;
        status: string;
        isDeleted: boolean;
        emailVerified: boolean;
    }
}


export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  needPasswordChange?: boolean;
}

export interface IRegisterResponse {
  user: IAuthUser;
  message: string;
}
