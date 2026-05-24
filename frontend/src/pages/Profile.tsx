import { useLoaderData } from "react-router-dom";

const Profile = () => {
    const {records} = useLoaderData() as {
        records: unknown
    };

    console.log(records)

    return (
        <div>
            <h1>Profile</h1>
        </div>
    )
}

export default Profile;