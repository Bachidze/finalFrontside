"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

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
      if (resp.status === 201) {
        localStorage.setItem('token', resp.data.token);
        router.push("mainPage");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any, setState: any, field: string) => {
    setState(e.target.value);
    if (errors[field]) {
      setErrors((prevErrors: any) => ({ ...prevErrors, [field]: "" }));
    }
  };

  return (
    <main className="flex justify-center items-center h-[100vh] ">
      <section className="border-[4px] border-[#858BB2] rounded-[10px] w-[325px] h-[250px] flex justify-center items-center md:w-[375px] md:h-[320px] xl:w-[390px] xl:h-[335px] dark:border-black">
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-5">
          <div>
            <input
            className="placeholder:text-[#858BB2] border-[2px] border-[#placeholder:text-[#858BB2] rounded-[5px] bg-transparent p-1 text-[#858BB2] outline-none md:p-2 xl:p-3  dark:border-black dark:text-black dark:placeholder:text-black"
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
            className="placeholder:text-[#858BB2] border-[2px] border-[#placeholder:text-[#858BB2] rounded-[5px] bg-transparent p-1 text-[#858BB2] outline-none md:p-2 xl:p-3 dark:border-black dark:text-black dark:placeholder:text-black"
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
            <button disabled={loading} className="text-[#858BB2] dark:text-black">
              {loading ? "Signing in..." : "Submit"}
            </button>
            <Link href={"sign-up"} className="text-[#858BB2] dark:text-black">
              Sign Up
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

