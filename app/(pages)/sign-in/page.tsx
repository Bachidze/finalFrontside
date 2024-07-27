"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({} as any);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    const newErrors: any = {};
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email) newErrors.email = "Email can't be empty";
    if (!emailRegex.test(email)) newErrors.email = "Email is not valid";
    if (!password) newErrors.password = "Password can't be empty";
    return newErrors;
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      const resp = await axios.post("https://finalbackside.onrender.com/auth/sign-in", {
        email,
        password,
      });

      console.log("Sign-In Response:", resp);

      if (resp.status === 201) {
        console.log("Token received:", resp.data.accessToken);
        
        localStorage.setItem('token', resp.data.accessToken);

        router.push("/mainPage");
      } else {
        console.error("Unexpected response status:", resp.status);
      }
    } catch (error: any) {
      if (error.response) {
        setErrors({
          general: error.response.data.message || "Invalid Credentials",
        });
      } else {
        setErrors({
          general: "An unexpected error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any, setState: any, field: string) => {
    setState(e.target.value);
    if (errors[field]) {
      setErrors((prevErrors: any) => ({ ...prevErrors, [field]: "" }));
    }
    if (errors.general) {
      setErrors((prevErrors: any) => ({ ...prevErrors, general: "" }));
    }
  };

  return (
    <main className="flex justify-center items-center h-[100vh]">
      <section className="border-[4px] border-[#858BB2] rounded-[10px] w-[325px] h-[250px] flex justify-center items-center">
        <form onSubmit={onSubmit}>
          {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
          <div className="flex flex-col gap-5">
            <div>
              <input
                className="placeholder:text-[#858BB2] text-[#858BB2] border-[2px] border-[#858BB2] rounded-[5px] bg-transparent"
                type="text"
                placeholder="Email"
                aria-label="Email"
                value={email}
                onChange={(e) => handleChange(e, setEmail, "email")}
              />
              {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
            </div>
            <div>
              <input
                className="placeholder:text-[#858BB2] text-[#858BB2] border-[2px] border-[#858BB2] rounded-[5px] bg-transparent"
                type="password"
                placeholder="Password"
                aria-label="Password"
                value={password}
                onChange={(e) => handleChange(e, setPassword, "password")}
              />
              {errors.password && (
                <p style={{ color: "red" }}>{errors.password}</p>
              )}
            </div>
          </div>
          <div className="flex justify-between pt-3">
            <button disabled={loading} className="text-[#858BB2]">
              {loading ? "Signing in..." : "Submit"}
            </button>
            <Link href="/sign-up" className="text-[#858BB2]">
              Sign Up
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
