import { useLoaderData, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";


export interface IProfile {
    id: number,
    email: string,
    name: string,
    password_hash?: string,
    created_at: Date,
    is_verified: boolean,
}

const Profile = () => {
    const navigate = useNavigate();
    const {records} = useLoaderData() as {
        records: {
            message: string,
            user: IProfile,
        }
    };

    if (!records.user) {
        navigate("/login");
    }

    console.log(records);
    const [profileInfo, setProfileInfo] = useState<IProfile | null>(null);

    useEffect(() => {
        const setInfo = async () => {
            setProfileInfo(records.user);
        }
        setInfo();
    }, [records]);

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />
            <div className="max-w-2xl mx-auto px-4 py-12">
                <h1 className="text-2xl font-semibold text-slate-100 tracking-tight mb-8">Profile</h1>
                <div className="rounded-lg border border-slate-800 bg-slate-900 divide-y divide-slate-800">
                    {profileInfo && (
                        <div className="flex items-center justify-between px-4 py-3.5">
                            <span className="text-sm text-slate-400">Name</span>
                            <span className="text-sm font-medium text-slate-100">{profileInfo?.name}</span>
                        </div>
                    )}
                    {profileInfo && (
                        <div className="flex items-center justify-between px-4 py-3.5">
                            <span className="text-sm text-slate-400">Email</span>
                            <span className="text-sm font-medium text-slate-100">{profileInfo?.email}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile;