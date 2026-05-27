import { Link } from "react-router-dom";

const Navbar = () => {


    return (
        <div>
            <ul >
                <li className={`inline-block mx-2 text-green-600`}><Link to={`/dashboard`}>dashboard</Link></li>
                <li className={`inline-block mx-2 text-green-600`}><Link to={`/profile`}>profile</Link></li>
                <li className={`inline-block mx-2 text-green-600`}><Link to={`/register`}>register</Link></li>
                <li className={`inline-block mx-2 text-green-600`}><Link to={`/login`}>login</Link></li>
                <li className={`inline-block mx-2 text-green-600`}><Link to={`/reset-password`}>reset password</Link></li>
            </ul>
        </div>
    )
}

export default Navbar;