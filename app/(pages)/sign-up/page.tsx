"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState({} as any);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    const newErrors: any = {};
    const emailRegex = /\S+@\S+\.\S+/;
    if (!name) newErrors.name = "Name can't be empty";
    if (!lastName) newErrors.lastName = "Last name can't be empty";
    if (!email) newErrors.email = "Email can't be empty";
    if (!emailRegex.test(email)) newErrors.email = "Email is not valid";
    if (!password) newErrors.password = "Password can't be empty";
    if (password.length < 6) newErrors.password = "Minimum 6 Letters";
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
      const resp = await axios.post("https://finalbackside.onrender.com/auth/sign-up", {
        name,
        lastName,
        email,
        password,
      });

      if (resp.status === 201) {
        console.log('Sign-up successful!');
        router.push("/sign-in"); 
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setErrors({
          general: "Invalid Credentials",
        });
      } else {
        console.error(error);
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
      <section className="border-[4px] border-[#858BB2] rounded-[10px] w-[325px] h-[350px] flex justify-center items-center">
        <form onSubmit={onSubmit}>
          {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
          <div className="flex gap-5 flex-col">
            <div>
              <input
                className="placeholder:text-[#858BB2] text-[#858BB2] border-[2px] border-[#858BB2] rounded-[5px] bg-transparent"
                type="text"
                placeholder="Name"
                aria-label="Name"
                value={name}
                onChange={(e) => handleChange(e, setName, "name")}
              />
              {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
            </div>
            <div>
              <input
                className="placeholder:text-[#858BB2] text-[#858BB2] border-[2px] border-[#858BB2] rounded-[5px] bg-transparent"
                type="text"
                placeholder="Last Name"
                aria-label="Last Name"
                value={lastName}
                onChange={(e) => handleChange(e, setLastName, "lastName")}
              />
              {errors.lastName && (
                <p style={{ color: "red" }}>{errors.lastName}</p>
              )}
            </div>
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
            <div className="flex justify-between ">
              <button disabled={loading} className="text-[#858BB2]">
                {loading ? "Submitting..." : "Submit"}
              </button>
              <Link href="/sign-in" className="text-[#858BB2]">
                Sign In
              </Link>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
