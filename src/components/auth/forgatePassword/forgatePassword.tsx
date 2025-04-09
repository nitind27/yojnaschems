// "use client"
// import React from 'react';
// import * as Yup from 'yup';
// import Link from 'next/link';
// import { toast } from 'react-toastify';
// import { Formik, Form, Field } from 'formik';
// import { forgatepassword } from '@/api/auth/auth';

// const ForgotPasswordSchema = Yup.object().shape({
//     email: Yup.string()
//         .email('Invalid email format')
//         .required('Email is required'),
// });

// const ForgotPassword = () => {
//     return (
//         <div className='h-100  container d-flex align-items-center'>
//         <Formik
//             initialValues={{
//                 email: "yousef_hammoda+talent@hotmail.com",
//             }}
//             validationSchema={ForgotPasswordSchema}
//             onSubmit={async (values) => {
//                 console.log("login form values ", values);
//                 try {
//                     const response =  await forgatepassword(values);
//                     toast.success(response.data.message);
//                 } catch (error) {
//                     toast.error('Failed to reset password. Please try again.');
//                 }
//             }}
//         >
//             {({ isSubmitting, isValid, errors, touched }) => (
//                 <Form className='form w-100  fv-plugins-bootstrap5 fv-plugins-framework py-9 px-15' noValidate>
//                     <div className='text-center mb-10'>
//                         <h1 className='text-gray-900 fw-bolder mb-3'>Forgot Password?</h1>
//                         <div className='text-gray-500 fw-semibold fs-6'>
//                             Enter your email to reset your password.
//                         </div>
//                     </div>

//                     <div className='fv-row mb-8'>
//                         <label className='form-label fw-bolder text-gray-900 fs-6'>Email</label>
//                         <Field
//                             type='email'
//                             name='email'
                            
//                             placeholder=''
//                             autoComplete='off'
//                             className={`form-control bg-transparent ${
//                                 touched.email && errors.email ? 'is-invalid' : ''
//                             }`}
//                         />
//                         {touched.email && errors.email && (
//                             <div className='fv-plugins-message-container'>
//                                 <div className='fv-help-block'>
//                                     <span role='alert'>{errors.email}</span>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
//                         <button
//                             type='submit'
//                             id='kt_password_reset_submit'
//                             className='btn btn-primary btn-sm me-4'
//                             disabled={isSubmitting || !isValid}
//                         >
//                             <span className='indicator-label'>Submit</span>
//                             {isSubmitting && (
//                                 <span className='indicator-progress'>
//                                     Please wait...
//                                     <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
//                                 </span>
//                             )}
//                         </button>
//                         <Link href='/login'>
//                             <button
//                                 type='button'
//                                 id='kt_login_password_reset_form_cancel_button'
//                                 className='btn btn-sm btn-light-primary'
//                                 disabled={isSubmitting}
//                             >
//                                 Cancel
//                             </button>
//                         </Link>
//                     </div>
//                 </Form>
//             )}
//         </Formik>
//         </div>
//     );
// };

// export default ForgotPassword;
