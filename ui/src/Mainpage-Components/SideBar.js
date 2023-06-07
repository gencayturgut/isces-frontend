import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link, Outlet } from "react-router-dom";
import "./SideBar.css";
const SideBar = () => {
  const authCtx = useContext(AuthContext);
  return (
    <div className="page-layout-container">
      <div className="sidebar-container">
        <div className="sidebar-layout">
          <div className="sidebar-logo-box">
            <img
              className="sidebar-logo"
              src={require("../images/home/iyte_logo-tur.png")}
            />
          </div>
          <div className="options">
            <Link className="option" to="/">
              <div>
                <ion-icon name="home-outline"></ion-icon>
                <button>Home</button>
              </div>
            </Link>

            {authCtx.userRole == "officer" && (
              <Link className="option" to="/candidateapproval">
                <div>
                  <ion-icon name="checkmark-done-outline"></ion-icon>
                  <button>Candidate Approval</button>
                </div>
              </Link>
            )}
            <Link className="option" to="/election">
              <div>
                <ion-icon name="pie-chart-outline"></ion-icon>
                <button>Election</button>
              </div>
            </Link>
            {authCtx.userRole == "rector" && (
              <Link className="option" to="/setelectiondate">
                <div>
                  <ion-icon name="calendar-outline"></ion-icon>
                  <button>Set Election Date</button>
                </div>
              </Link>
            )}
            <Link className="option" to="/candidates">
              <div>
                <ion-icon name="shield-checkmark-outline"></ion-icon>
                <button>
                  {authCtx.userRole === "officer" ||
                  authCtx.userRole === "rector"
                    ? "Candidates"
                    : "Vote"}
                </button>
              </div>
            </Link>

            <Link className="option" to="/council">
              <div>
                <ion-icon name="people-outline"></ion-icon>
                <button>Council</button>
              </div>
            </Link>
            {(authCtx.userRole === "student" ||
              authCtx.userRole === "candidate") && (
              <Link className="option" to="/candidateform">
                <div>
                  <ion-icon name="document-attach-outline"></ion-icon>
                  <button>Be candidate</button>
                </div>
              </Link>
            )}
            <Link className="option" to="/profile">
              <div>
                <ion-icon name="person-circle-outline"></ion-icon>
                <button>Profile</button>
              </div>
            </Link>
            <Link className="option" to="/" onClick={authCtx.exitHandler}>
              <div>
                <ion-icon name="exit-outline"></ion-icon>
                <button>LogOut</button>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default SideBar;
