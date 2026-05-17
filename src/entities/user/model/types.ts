import type { UserDTO } from "@/shared/api/user/types";

export interface User extends UserDTO { }

export interface UserState {
    user: User | null;
    isAuth: boolean;
    isLoading: boolean;

    setUser: (user: User | null) => void;
    setTokens: (access: string, refresh: string) => void;
    setIsLoading: (status: boolean) => void;
    logout: () => void;
}
