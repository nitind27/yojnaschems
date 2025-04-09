"use client";

import { TblUsers } from "@/components/type";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  tbluserdata: TblUsers[];
};

const LoginForm = ({ tbluserdata }: Props) => {
  const [username, setSupContact] = useState("");
  const [password, setSupPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("supervisorName", tbluserdata.filter((data) => data.username === username && data.password === password).map((data) => data.name) as any);
        toast.success("Login successful! Redirecting to dashboard...");

        setTimeout(() => {
          router.push(`/dashboard`);
        }, 1000);
      } else {
        const data = await res.json();
        setErrorMessage(data.message);
        toast.error(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Network error occurred");
      toast.error("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-100 container d-flex align-items-center">
      <form
        onSubmit={handleSubmit}
        className="form w-100 px-20 py-9"
        id="kt_login_signin_form"
      >
        <div className="text-center mb-11">
          <h1 className="text-gray-900 fw-bolder mb-3">Sign In</h1>
        </div>

        {/* Username Field */}
        <div className="fv-row mb-3">
          <label className="form-label fs-6 fw-bolder text-gray-900">
            Username
          </label>
          <input
            id="contact"
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setSupContact(e.target.value)}
            placeholder="Enter Username"
            required
          />
        </div>

        {/* Password Field */}
        <div className="fv-row mb-3 position-relative">
          <label className="form-label fs-6 fw-bolder text-gray-900">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"} // Toggle input type
            className="form-control"
            value={password}
            onChange={(e) => setSupPassword(e.target.value)}
            placeholder="Enter Password"
            required
          />
          {/* Eye Icon */}
          <span 
            className={`position-absolute end-0 translate-middle-y pe-3 cursor-pointer`} 
            onClick={() => setShowPassword(!showPassword)} // Toggle show/hide
            style={{top:"50px"}}
          >
            {showPassword ? (
              <i className="bi bi-eye-slash" aria-hidden="true" style={{fontSize:"16px"}}></i> // Use Bootstrap Icons or any other icon library
            ) : (
              <i className="bi bi-eye" aria-hidden="true" style={{fontSize:"16px"}}></i>
            )}
          </span>
        </div>

        {/* Submit Button */}
        <div className="d-grid mb-10">
          <button
            type="submit"
            className="btn bg-blue text-white"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <p className="text-danger text-center">{errorMessage}</p>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
