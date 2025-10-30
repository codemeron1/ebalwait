/**
    fields: first_name, last_name, email, password, confirm_password
 */
import axios from "axios";

const Register = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        axios.post(`${apiUrl}/register`, formData);
    }
    
    return (
        <>
        <form onSubmit={handleRegister}>
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Confirm Password" />
            <button type="submit">Register</button>
        </form>
        </>
    )
}

export default Register;