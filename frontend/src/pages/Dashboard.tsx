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
        <div className="min-h-screen bg-slate-950">
            <Navbar />
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Dashboard</h1>
                    <Logout />
                </div>
            </div>
        </div>
    )
}

export default Dashboard;