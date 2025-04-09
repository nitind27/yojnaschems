// "use client"
// import { KTIcon } from '@/_metronic/helpers';
// import { register } from '@/api/auth/auth';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useState } from 'react';
// import { toast } from 'react-toastify';
// import * as Yup from 'yup';

// const validationSchemaRegister = Yup.object().shape({
//     first_name: Yup.string()
//         .min(3, "Minimum 3 symbols")
//         .max(50, "Maximum 50 symbols")
//         .required("First name is required"),
//     last_name: Yup.string()
//         .min(3, "Minimum 3 symbols")
//         .max(50, "Maximum 50 symbols")
//         .required("Last name is required"),
//     email: Yup.string()
//         .email("Wrong email format")
//         .min(3, "Minimum 3 symbols")
//         .max(50, "Maximum 50 symbols")
//         .required("Email is required"),
//     password: Yup.string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Password is required"),
//     confirm_password: Yup.string()
//         .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
//         .required("Confirm password is required"),
//     acceptTerms: Yup.bool()
//         .oneOf([true], "You must accept the terms and conditions")
//         .required("Terms acceptance is required"),
// });

// const Register = () => {
//     const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
//   const [showConformPassword, setShowConformPassword] = useState(false); // State to manage password visibility

//     const router = useRouter();

//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//       };
//       const toggleConformPasswordVisibility = () => {
//         setShowConformPassword(!showConformPassword);
//       };
//     return (
//         <div className='h-100  container d-flex align-items-center'>
//             <Formik
//                 initialValues={{
//                     first_name: "",
//                     last_name: "",
//                     email: "",
//                     password: "",
//                     confirm_password: "",
//                     acceptTerms: false,
//                 }}
//                 validationSchema={validationSchemaRegister}
//                 onSubmit={async (values, { resetForm }) => {
//                     setLoading(true);
//                     console.log("Normal user signup values", values);

//                     const { confirm_password, acceptTerms, ...payload } = values;
//                     const response = await register(payload);
//                     console.log("response ", response);
//                     setLoading(false);

//                     if (!response.error) {
//                         try {
//                             toast.success("User is successfully registered.");
//                             toast.success("Verification mail has been sent to your email.");
//                             resetForm();
//                             router.push("/login");
//                         } catch (error) {
//                             console.log("Error occurred during sign up ", error);
//                             toast.error(response.data?.message ?? "Failed to Register.");
//                         }
//                     } else {
//                         toast.error(response.data?.message ?? "Failed to Register.");
//                     }
//                 }}
//             >
//                 {({ setFieldValue, values }) => (
//                     <Form className='form w-100 py-9 px-15' id="kt_login_signin_form">
//                         <div className="text-center mb-11">
//                             <h1 className="text-gray-900 fw-bolder mb-3">Register for Free</h1>
//                         </div>
//                         <div className="fv-row mb-5">
//                             <label className="form-label fs-6 fw-bolder text-gray-900">First name</label>
//                             <Field
//                                 name="first_name"
//                                 value={values.first_name}
//                                 placeholder="First name"
//                                 type="text"
//                                 className="form-control"
//                             />
//                             <ErrorMessage name="first_name" component="div" className="text-danger" />
//                         </div>
//                         <div className="fv-row mb-5">
//                             <label className="form-label fs-6 fw-bolder text-gray-900">Last name</label>
//                             <Field
//                                 name="last_name"
//                                 value={values.last_name}
//                                 placeholder="Last name"
//                                 type="text"
//                                 className="form-control"
//                             />
//                             <ErrorMessage name="last_name" component="div" className="text-danger" />
//                         </div>
//                         <div className="fv-row mb-5">
//                             <label className="form-label fs-6 fw-bolder text-gray-900">Email</label>
//                             <Field
//                                 name="email"
//                                 values={values.email}
//                                 placeholder="Email address"
//                                 type="email"
//                                 className="form-control"
//                             />
//                             <ErrorMessage name="email" component="div" className="text-danger" />
//                         </div>
//                         <div className="fv-row mb-5">
//                             <label className="form-label fw-bolder text-gray-900 fs-6 mb-0">
//                                 Password
//                             </label>
//                             <div className="position-relative">
//                             <Field
//                                 name="password"
//                                 value={values.password}
//                                 placeholder="Password"
//                                 type={showPassword ? "text" : "password"}
//                                 className="form-control"
//                             />
//                             <span
//                               className="position-absolute top-50 translate-middle-y cursor-pointer"
//                                 style={{ right: '10px' }}
//                                 onClick={togglePasswordVisibility}
//                             >
//                                 {showPassword ? <KTIcon iconName="eye-slash" iconType="duotone" className="fs-2" /> : <KTIcon iconName="eye" iconType="duotone" className="fs-2" />} {/* Toggle icon */}
//                             </span>
//                             </div>
//                             <ErrorMessage name="password" component="div" className="text-danger" />
                            
//                         </div>
//                         <div className="fv-row mb-8">
//                             <label className="form-label fw-bolder text-gray-900 fs-6 mb-0">
//                                 Confirm Password
//                             </label>
//                             <div className='position-relative'>
//                             <Field
//                                 name="confirm_password"
//                                 value={values.confirm_password}
//                                 placeholder="Password confirmation"
//                                 type={showConformPassword ? "text" : "password"}
//                                 className="form-control mt-3"
//                             />
//                             <span
//                               className="position-absolute top-50 translate-middle-y cursor-pointer"
//                                 style={{ right: '10px' }}
//                                 onClick={toggleConformPasswordVisibility}
//                             >
//                                 {showConformPassword ? <KTIcon iconName="eye-slash" iconType="duotone" className="fs-2" /> : <KTIcon iconName="eye" iconType="duotone" className="fs-2" />} {/* Toggle icon */}
//                             </span>
//                             </div>
//                             <ErrorMessage name="confirm_password" component="div" className="text-danger" />
//                         </div>
//                         <div className="fv-row mb-8">
//                             <label
//                                 className="form-check form-check-inline"
//                                 htmlFor="kt_login_toc_agree"
//                             >
//                                 <input
//                                     className="form-check-input"
//                                     type="checkbox"
//                                     id="kt_login_toc_agree"
//                                     onChange={() =>
//                                         setFieldValue("acceptTerms", !values.acceptTerms)
//                                     }
//                                 />
//                                 <span>
//                                     I accept the&nbsp;
//                                     <Link href="google.com" className="text-blue-400 underline">
//                                         Terms and Conditions
//                                     </Link>
//                                     &nbsp;and acknowledge that I have read and understood
//                                     the&nbsp;
//                                     <Link href="google.com" className="text-blue-400 underline">
//                                         Privacy Policy
//                                     </Link>
//                                     &nbsp;.
//                                 </span>
//                             </label>
//                             <ErrorMessage name="acceptTerms" component="div" className="text-danger" />
//                         </div>
//                         <div className="text-center">
//                             <button
//                                 type="submit"
//                                 id="kt_sign_up_submit"
//                                 className="btn btn-lg btn-primary mb-5 me-5"
//                             >
//                                 <span className="indicator-label">Register</span>
//                             </button>
//                             <Link href="/login">
//                                 <button
//                                     type="button"
//                                     id="kt_login_signup_form_cancel_button"
//                                     className="btn btn-lg btn-light-primary mb-5"
//                                 >
//                                     Cancel
//                                 </button>
//                             </Link>
//                         </div>
//                     </Form>
//                 )}
//             </Formik>
//         </div>
//     );
// }

// export default Register;
import React from 'react'

const register = () => {
  return (
    <div>register</div>
  )
}

export default register
