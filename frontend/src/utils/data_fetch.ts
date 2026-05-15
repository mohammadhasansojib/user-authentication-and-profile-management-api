

const getHelloWorld = async () => {
    const api_url = import.meta.env.VITE_API_URL;

    const res = await fetch(`${api_url}`);
    const data = await res.json();

    return data;
}

export default {
    getHelloWorld,
}