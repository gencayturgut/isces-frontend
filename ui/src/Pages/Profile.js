import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./Profile.css";
const Profile = () => {
  const authCtx = useContext(AuthContext);
  console.log(authCtx);
  const departmentNameHandler = (id) => {
    if (id == 1) {
      return "Electrical Engineering";
    } else if (id == 2) {
      return "Computer Engineering";
    } else {
      return "Mechanical Engineering";
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <div className="profile-left-box">
          {/* <img
            className="profile-photograph"
            alt="profile photograph"
            src={props.image}
          /> */}
        </div>
        {authCtx.userRole === "rector" && (
          <div className="profile-right-box">
            <h3 className="rector-name">Yusuf Baran</h3>
          </div>
        )}
        {authCtx.userRole === "officer" && (
          <div className="profile-right-box">
            <h3 className="officer-name">Officer</h3>
            <h4 className="officer-department">
              {departmentNameHandler(authCtx.userDepartment)}
            </h4>
          </div>
        )}
        {(authCtx.userRole === "student" ||
          authCtx.userRole === "candidate") && (
          <div className="profile-right-box">
            <h3 className="name">
              {authCtx.userName} {authCtx.userLastName}
            </h3>
            <h4 className="department">
              {departmentNameHandler(authCtx.userDepartment)}
            </h4>
            <h5 className="gpa">
              GPA : <span>{authCtx.userGpa}</span>
            </h5>
            <h6 className="status">Status : {authCtx.userRole}</h6>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
