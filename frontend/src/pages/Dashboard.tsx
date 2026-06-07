// import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Logout from "../components/Logout";

const Dashboard = () => {
    // const [data, setData] = useState<{message: string} | null>(null);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const res = await fetch('http://localhost:3000/');
    //         const message = await res.json();

    //         setData(message);
    //         console.log(data);
    //     }

    //     fetchData();
    // }, [data]);


    return (
        <div>
            <Navbar />
            <h1>Dashboard</h1>
            <Logout />
        </div>
    )
}

export default Dashboard;