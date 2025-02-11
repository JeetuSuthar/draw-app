"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function SigninPage() {
    const { register, handleSubmit } = useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:3001/signin", data);
        
            console.log("Backend Response:", response.data); // Debugging
        
            if (response.data.token) {
                localStorage.setItem("token", response.data.token); // Corrected
                console.log("TOKEN IS STORED:", localStorage.getItem("token")); // Verify storage
            } else {
                console.error("Token missing in response");
            }
        
            toast.success("Login successful!");
            router.push("/create-room");  // Redirect after login
        } catch (error) {
            toast.error("Invalid credentials");
        } finally {
            setLoading(false);
        }
        
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register("username")} type="text" className="w-full p-2 border mb-4" placeholder="name" required />
                    <input {...register("password")} type="password" className="w-full p-2 border mb-4" placeholder="Password" required />
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
                <p className="mt-4 text-center">New user? <a className="underline" href="/signup">Signup</a></p>
            </div>
        </div>
    );
}
