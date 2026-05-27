import { useLoaderData } from "react-router-dom";
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
    const {records} = useLoaderData() as {
        records: {
            message: string,
            user: IProfile,
        }
    };
    console.log(records);
    const [profileInfo, setProfileInfo] = useState<IProfile | null>(null);

    useEffect(() => {
        const setInfo = async () => {
            setProfileInfo(records.user);
        }
        setInfo();
    }, [records]);

    return (
        <div>
            <Navbar />
            <div>
                <h1>Profile</h1>
                <div>
                    {profileInfo && <p>Name: {profileInfo?.name}</p>}
                    {profileInfo && <p>Email: {profileInfo?.email}</p>}
                </div>
            </div>
        </div>
    )
}

export default Profile;