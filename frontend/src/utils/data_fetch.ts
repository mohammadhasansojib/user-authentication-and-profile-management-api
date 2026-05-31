import config from "../config";
import refreshToken from "./refreshToken";


const getHelloWorld = async () => {
    const api_url = import.meta.env.VITE_API_URL;

    const res = await fetch(`${api_url}`);
    const data = await res.json();

    return data;
}

const getProfileData = async () => {
    const api_url = import.meta.env.VITE_API_URL;

    const res = await fetch(`${api_url}/api/users/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${config.accessToken}`,
        }
    });

    if (!res.ok) {
        const rt = await refreshToken();
        
        if (!rt.accessToken) {
            return {
                user: null,
            }
        }
        
        config.accessToken = rt.accessToken;

        const res = await fetch(`${api_url}/api/users/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${config.accessToken}`,
            }
        });

        const data = await res.json();

        return data;
    }

    const data = await res.json();

    return data;
}



export default {
    getHelloWorld,
    getProfileData,
}