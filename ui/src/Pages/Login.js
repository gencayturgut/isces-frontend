import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./Login.css";
import axios from "axios";
const Login = () => {
  const alertBox = (
    <div className="AlertBox">
      <h5>Wrong Credentials!</h5>
      <button onClick={changeAlertBoxVisible}>Ok</button>
    </div>
  );
  const [showAlert, setShowAlert] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [formIsValid, setFormIsValid] = useState(false);
  const authCtx = useContext(AuthContext);
  function changeAlertBoxVisible() {
    setShowAlert(!showAlert);
  }
  const submitHandler = async (event) => {
    event.preventDefault();
    const email = enteredEmail.trim();
    const password = enteredPassword.trim();
    try {
      const activationURL = `http://localhost:8080/login/${email}/${password}`;
      const res = await axios.get(activationURL);

      if (res.status === 200) {
        let returned = res.data;
        if (returned.role === "candidate") {
          returned = returned.candidate;
        }
        if (returned.role === "officer") {
          returned = returned.admin;
          const userDepartment = returned.department.departmentId;
          authCtx.setUserDepartmentData(userDepartment);
          localStorage.setItem("userDepartment", userDepartment);
        }
        if (res.data.role === "student" || res.data.role === "candidate") {
          localStorage.setItem("uid", returned.student.studentNumber);
          const userDepartment = returned.student.department.departmentId;
          authCtx.setUserDepartmentData(userDepartment);
          localStorage.setItem("userDepartment", userDepartment);
          const userGpa = returned.student.grade;
          authCtx.setUserGpaData(userGpa);
          localStorage.setItem("userGpa", userGpa);
          const userTerm = returned.student.term;
          authCtx.setUserTermData(userTerm);
          localStorage.setItem("userTerm", userTerm);
          const userName = returned.student.firstName;
          authCtx.setUserNameData(userName);
          const userLastName = returned.student.lastName;
          authCtx.setUserLastNameData(userLastName);
          localStorage.setItem("userName", userName);
          localStorage.setItem("userLastName", userLastName);
          const isVoted = returned.student.voted;
          if (isVoted === 0) {
            authCtx.setIsVotedData(true);
          }
        }
        const userRole = res.data.role;
        authCtx.setUserData(userRole);
        localStorage.setItem("userRole", userRole);
        authCtx.onLogin();
      }
    } catch (err) {
      console.log(err.message);

      changeAlertBoxVisible();
    }

    /*Backendden rol bilgisi gelecek, şu anlık test yaparken userRole'ü istediğin rolü yazarak deneyebilirsin.
    Ana roller: student, rector, dean's office, department office. Department office dökümanları kontrol edip
    eğer uygunsa dean's office e yollayacak. Deans office de onaylayacak, yani 2 tane onaylama aşaması olacak.
    Rektör ise election date'i set edecek veya seçimi eşitlikle biterse rastgele bitirme tuşuna tıklayacak ve seçim
    iki eşit oy alan iki kişi arasından biri seçilerek bitecek.*/
  };

  const emailChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
    setFormIsValid(event.target.value.includes("@"));
  };
  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);
  };
  return (
    <div className="login-container">
      <div className="login-page">
        <header>
          <h1>IZTECH ONLINE ELECTION SYSTEM</h1>
        </header>
        <div className="login-outer-box">
          <img
            src="https://bhib.iyte.edu.tr/wp-content/uploads/sites/115/2018/09/iyte_logo-tur.png"
            alt="IYTE Logo"
            className="login-logo"
          />

          <div className="login-left-inner-box">
            <div className="login-form">
              {showAlert ? (
                alertBox
              ) : (
                <form onSubmit={submitHandler}>
                  <label htmlFor="email">Email:</label>
                  <input
                    className="input"
                    placeholder="e-mail"
                    type="email"
                    id="email"
                    value={enteredEmail}
                    onChange={emailChangeHandler}
                  />
                  <label htmlFor="password">Password:</label>
                  <input
                    className="input"
                    placeholder="password"
                    type="password"
                    id="password"
                    value={enteredPassword}
                    onChange={passwordChangeHandler}
                  />
                  <button
                    className="button"
                    type="submit"
                    disabled={!formIsValid}
                  >
                    Login
                  </button>
                </form>
              )}
              <a
                href="https://obs.iyte.edu.tr/oibs/ogrenci/start.aspx?gkm=0020333453884031102355703550534436311053657033351388803446832232389283558535545383682197311153778435600"
                className="forgot-password-link"
              >
                Forgot Password
              </a>
            </div>
          </div>
          <div className="login-right-inner-box">
            <img
              className="login-img"
              src={require("../images/login/server_cluster.png")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
