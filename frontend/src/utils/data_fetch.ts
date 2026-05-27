import config from "../config";


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
    const data = await res.json();

    return data;
}



export default {
    getHelloWorld,
    getProfileData,
}