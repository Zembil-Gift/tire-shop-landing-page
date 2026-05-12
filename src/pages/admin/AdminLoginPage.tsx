import { useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { loginAdmin } from "../../services/authService";

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await loginAdmin({ email, password });
            const nextPath = (location.state as { from?: string } | null)?.from ?? "/admin/dashboard";
            navigate(nextPath, { replace: true });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const statusCode = error.response?.status;
                if (statusCode === 400 || statusCode === 401) {
                    setError("The email or password you entered is incorrect. Please try again.");
                    return;
                }
            }

            setError("We could not sign you in right now. Please try again in a moment.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <form className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200" onSubmit={handleSubmit}>
                <h1 className="text-2xl font-bold">Admin Login</h1>

                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                    placeholder="Password"
                    required
                />

                {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

                <button
                    type="submit"
                    className="mt-4 w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
                    disabled={isLoading}
                >
                    {isLoading ? "Signing in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
