"use client";
import { FC } from "react";

import Logout from "@/components/auth/logout/Logout";
// import { logout } from "@/api/auth/auth";

const HeaderUserMenu: FC = () => {

  const supervisorName = sessionStorage.getItem("supervisorName");

  // useEffect(() => {
  //   const fetchProfileInformation = async () => {
  //     const response = await getprofileinformationClient();
  //     setProfileHeader(response);
  //     console.log("Profile data", response);
  //   };

  //   const fetchSession = async () => {
  //     const session = await getSession();
  //     if (session) {
  //       setEmail(session.user?.email || null);
  //     }
  //   };

  //   fetchProfileInformation();
  //   fetchSession();
  // }, []);

  // const handleSignOut = async () => {
  //   await signOut();
  //   sessionStorage.removeItem("userEmail");
  //   router.push("/login");
  // };

  return (
    <div
      className="menu  menu-sub  menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-350px"
      data-kt-menu="true"
    >
      <div className="menu-item bg-transparent px-3">
        <div className="menu-content d-flex align-items-center px-3">
          <div className="symbol symbol-50px me-5">
            {/* {profileHeader &&
            profileHeader?.data?.information?.profile_image ? (
              <Image
                src={
                  profileImage
                    ? profileImage
                    : profileHeader?.data?.information?.profile_image
                }
                alt="Profile Image"
                width={100}
                height={100}
              />
            ) : (
              <Image
                src={toAbsoluteUrl("/media/avatars/blank.png")}
                alt="Profile"
                width={100}
                height={100}
              />
            )} */}

          </div>

          <div className="d-flex flex-column">
            <div className="fw-bolder d-flex align-items-center fs-5">
              <span className=" fs-5 py-1">
                {/* {profileHeader && profileHeader?.data?.information?.full_name} */}
                Welcome{""} {supervisorName}
              </span>
            </div>
            {/* <div className="fw-bold text-muted text-hover-primary fs-7">
              <p>{email || "email"}</p>
            </div> */}
          </div>
        </div>
      </div>

      <div className="separator"></div>

      {/* <div className="menu-item bg-transparent px-5">
        <Link href="/settings?tab=overview" className="menu-link px-5">
          Settings
        </Link>
      </div> */}
      <div className="menu-item  bg-transparent">


        <span className="menu-link "> <Logout /></span>

      </div>
    </div>
  );
};

export { HeaderUserMenu };
