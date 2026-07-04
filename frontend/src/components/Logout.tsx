import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";



const Logout = () => {
    const navigate = useNavigate();
    const [failedMessage, setFailedMessage] = useState<null | string>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, isAllDevice: boolean) => {
        e.preventDefault();

        const sendRequest = async () => {
            try {
                const api_url = `${import.meta.env.VITE_API_URL}/api/auth/logout?all_device=${isAllDevice}`;

                const res = await fetch(api_url, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${config.accessToken}`
                    },
                    credentials: "include",
                });

                if (!res.ok) {
                    const err_data = await res.json();
                    console.log(err_data);

                    setFailedMessage("failed to logout");
                    return;
                }

                navigate("/login");
            } catch (error) {
                console.log(error);
                setFailedMessage("Network Error, please try again.")
            }
        }
        sendRequest();

    }


    return(
        <div className="inline-flex items-center gap-3">
            <button
                onClick={e => handleClick(e, false)}
                value="logout"
                className="rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-slate-800"
            >
                Logout
            </button>
            <button
                onClick={e => handleClick(e, true)}
                value="logout_all"
                className="rounded-lg border border-slate-800 bg-transparent px-3.5 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-100"
            >
                Logout all
            </button>

            {
                failedMessage && <span className="text-xs text-red-400">{failedMessage}</span>
            }
        </div>
    )
}


export default Logout;