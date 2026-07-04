import { Link } from "react-router-dom";

const Navbar = () => {


    return (
        <div className="border-b border-slate-800 bg-slate-950">
            <ul className="max-w-2xl mx-auto flex items-center gap-1 px-4 py-4">
                <li className="inline-block"><Link to={`/dashboard`} className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-emerald-400">Dashboard</Link></li>
                <li className="inline-block"><Link to={`/profile`} className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-emerald-400">Profile</Link></li>
                <li className="inline-block"><Link to={`/register`} className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-emerald-400">Register</Link></li>
                <li className="inline-block"><Link to={`/login`} className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-emerald-400">Login</Link></li>
                <li className="inline-block"><Link to={`/reset-password`} className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-emerald-400">Reset password</Link></li>
            </ul>
        </div>
    )
}

export default Navbar;