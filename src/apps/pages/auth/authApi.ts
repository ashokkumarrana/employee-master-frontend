import api from "../../../api/axios";

interface LoginRequest {
    username: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

interface UserResponse {
    id: number;
    username: string;
    role: string;
    name: string;
}

export const login = async (
    data: LoginRequest
): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
        "/auth/login",
        data
    );

    return response.data;
};

export const getUserByUsername = async (
    username: string,
    token: string
): Promise<UserResponse> => {
    const response = await api.get<UserResponse>(
        `/auth/user/${username}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};