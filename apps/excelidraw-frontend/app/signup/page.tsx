"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function SignupPage() {
    const { register, handleSubmit } = useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:3001/signup", data);
            toast.success("Signup successful!");
            router.push("/signin");
        } catch (error) {
            toast.error("Signup failed! User might already exist.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register("name")} className="w-full p-2 border mb-4" placeholder="Full Name" required />
                    <input {...register("username")} type="email" className="w-full p-2 border mb-4" placeholder="Email" required />
                    <input {...register("password")} type="password" className="w-full p-2 border mb-4" placeholder="Password" required />
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2" disabled={loading}>
                        {loading ? "Signing up..." : "Signup"}
                    </button>
                </form>
                <p className="mt-4 text-center">Already have an account? <a className="underline" href="/signin">Sign in</a></p>
            </div>
        </div>
    );
}
