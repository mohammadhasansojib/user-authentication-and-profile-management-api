import config from "../config";

const api_url = import.meta.env.VITE_API_URL;

const refreshToken = async () => {
    const res = await fetch(`${api_url}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
    });

    const res_data = await res.json();

    config.accessToken = res_data.accessToken;

    return res_data;
}

export default refreshToken;