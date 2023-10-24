import React, { createContext, useContext, useReducer, useEffect } from "react";
import { getUserInfoById } from "../helpers/helper";
import { getUserIdStorage } from "../helpers/common";

const UserDetailContext = createContext();

const initialState = {
    userDetails: null,
};

const userReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_USER_INFO":
            return {
                ...state,
                userDetails: action.payload,
            };
        case "LOGOUT_USER":
            sessionStorage.clear();
            return {
                ...state,
                userDetails: null,
            };

        default:
            return state;
    }
};

const UserDetailProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    // Hàm gọi API và cập nhật context
    const fetchAndSetUserDetails = async (userId) => {
        try {
            const userDetails = await getUserInfoById(userId);
            dispatch({ type: "LOGIN_USER_INFO", payload: userDetails });
        } catch (error) {
            console.error("Lỗi khi cập nhật user details:", error);
        }
    };

    const userId = getUserIdStorage("userId");

    useEffect(() => {
        if (userId) {
            fetchAndSetUserDetails(userId);
        }
    }, [userId]);

    const value = {
        state,
        dispatch,
    };

    return (
        <UserDetailContext.Provider value={value}>
            {children}
        </UserDetailContext.Provider>
    );
};

const useUserDetails = () => {
    return useContext(UserDetailContext);
};

export { useUserDetails, UserDetailProvider };
