// "use client";

// import { resetpassword } from "@/api/auth/auth";
// import { Field, Form, Formik } from "formik";
// import * as Yup from "yup";
// import Link from "next/link";
// import React from "react";
// import { toast } from "react-toastify";
// import { useSearchParams } from "next/navigation";
// import { signOut } from "next-auth/react";
// import { parseMsg } from "@/utils/basicfunction";

// const ResetPassword = () => {
//   const searchParams = useSearchParams();
//   const email = searchParams.get("email");

//   //   console.log("cfhhkfhgj hk ",(searchParams.get("email")))
//   return (
//     <div className="h-100 container d-flex align-items-center">
//       <Formik
//         initialValues={{
//           email: email || "",
//           password: "",
//           password_confirmation: "",
//           token: searchParams.get("token") || "",
//         }}
//         validationSchema={Yup.object({
//           password: Yup.string()
//             .min(6, "Password must be at least 6 characters")
//             .required("Password Required"),
//           password_confirmation: Yup.string()
//             .oneOf([Yup.ref("password"), undefined], "Passwords must match")
//             .required("Confirm Password Required"),
//         })}
//         onSubmit={async (values, { setSubmitting }) => {
//           console.log("login form values ", values);
//           try {
//             const response = await resetpassword(values);

//             if (response.error) {
//               toast.error(
//                 parseMsg(response.data.message) || "Password reset failed"
//               );
//             } else {
//               toast.success(
//                 parseMsg(response.data.message) || "Password reset successful"
//               );
//               signOut({
//                 redirect: true,
//                 callbackUrl: "/login",
//               });
//             }
//           } catch (error: any) {
//             if (error.message.includes("expired")) {
//               toast.error(
//                 "The password reset link has expired. Please request a new link."
//               );
//             } else {
//               toast.error("Failed to reset password. Please try again.");
//             }
//           } finally {
//             setSubmitting(false);
//           }
//         }}
//       >
//         {({ isSubmitting, isValid, errors, touched }) => (
//           <Form
//             className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework py-9 px-15"
//             noValidate
//           >
//             <div className="text-center mb-10">
//               <h1 className="text-gray-900 fw-bolder mb-3">
//                 Setup New Password
//               </h1>
//               <div className="text-gray-500 fw-semibold fs-6">
//                 Have you already reset the password?&nbsp;
//                 <Link href="/login" className="link-primary fw-bold">
//                   Sign in
//                 </Link>
//               </div>
//             </div>
//             <div className="fv-row mb-8">
//               <label>Email id: <span className="fw-bolder">{email || ""}</span></label>
//             </div>
//             <div className="fv-row mb-8">
//               <Field
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 autoComplete="off"
//                 className={`form-control bg-transparent ${
//                   touched.password && errors.password ? "is-invalid" : ""
//                 }`}
//               />
//               {touched.password && errors.password && (
//                 <div className="fv-plugins-message-container">
//                   <div className="fv-help-block">
//                     <span role="alert">{errors.password}</span>
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className="fv-row mb-8">
//               <Field
//                 type="password"
//                 name="password_confirmation"
//                 placeholder="Repeat Password"
//                 autoComplete="off"
//                 className={`form-control bg-transparent ${
//                   touched.password_confirmation && errors.password_confirmation
//                     ? "is-invalid"
//                     : ""
//                 }`}
//               />
//               {touched.password_confirmation &&
//                 errors.password_confirmation && (
//                   <div className="fv-plugins-message-container">
//                     <div className="fv-help-block">
//                       <span role="alert">{errors.password_confirmation}</span>
//                     </div>
//                   </div>
//                 )}
//             </div>

//             <div className="d-flex flex-wrap justify-content-center pb-lg-0">
//               <button
//                 type="submit"
//                 id="kt_password_reset_submit"
//                 className="btn btn-primary btn-sm me-4"
//                 disabled={isSubmitting || !isValid}
//               >
//                 <span className="indicator-label">Submit</span>
//                 {isSubmitting && (
//                   <span className="indicator-progress">
//                     Please wait...
//                     <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
//                   </span>
//                 )}
//               </button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default ResetPassword;
