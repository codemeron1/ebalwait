import { createContext, useContext} from "react";
import type { ReactNode } from "react";
import type { UserData } from "../types/types";

interface AuthenticatedUserProviderPropsType {
    children: ReactNode;
    user: UserData | null;
}

const AuthenticatedUserContext = createContext<UserData | null>(null);

export const AuthenticatedUser = ({ children, user }: AuthenticatedUserProviderPropsType) => {
    return (
        <AuthenticatedUserContext.Provider value={user}>
            {children}
        </AuthenticatedUserContext.Provider>
    )
}

export const useAuthenticatedUser = (): UserData | null => {
    return useContext(AuthenticatedUserContext);
};
