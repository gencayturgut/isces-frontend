import React, { useState, useEffect } from "react";
const AuthContext = React.createContext({
  isVoted:false,
  isLoggedIn: false,
  userRole: null,
  userDepartment: null,
  userGpa: null,
  userName: null,
  userLastName: null,
  userTerm : null,
  onLogin: () => {},
  exitHandler: () => {},
  setUserData: () => {},
  setUserDepartmentData: () => {},
  setUserGpaData: () => {},
  setUserNameData: () => {},
  setUserLastNameData: () => {},
  setIsVotedData: () => {},
  setUserTermData: () => {}
});

export const AuthContextProvider = (props) => {
  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");
    const storedUserRole = localStorage.getItem("userRole");
    const storedUserDepartment = localStorage.getItem("userDepartment");
    const storedUserGpa = localStorage.getItem("userGpa");
    const storedUserName = localStorage.getItem("userName");
    const storedUserLastName = localStorage.getItem("userLastName");
    const storedIsVoted = localStorage.getItem("isVoted");
    const storedUserTerm = localStorage.getItem("userTerm");
    if (storedIsVoted === 0) {
      setIsVoted(true);
    }
    if (storedUserLoggedInInformation === "1") {
      setUserName(storedUserName);
      setUserLastName(storedUserLastName);
      setUserGpa(storedUserGpa);
      setIsLoggedIn(true);
      setUserRole(storedUserRole);
      setUserDepartment(storedUserDepartment);
      setIsVoted(storedIsVoted);
      setUserTerm(storedUserTerm);
    }
  }, []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDepartment, setUserDepartment] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userGpa, setUserGpa] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userLastName, setUserLastName] = useState(null);
  const [isVoted, setIsVoted] = useState(false);
  const [userTerm, setUserTerm] = useState(null);
  const loginHandler = () => {
    localStorage.setItem("isLoggedIn", "1");
    
    const role = localStorage.getItem("userRole");
    if (role == "rector") {
      setUserRole("rector");
    } else if (role == "student") {
      setUserRole("student");
    } else if (role == "officer") {
      setUserRole("officer");
    }
    setIsLoggedIn(true);
  };
  const exitHandler = () => {
    localStorage.removeItem("userLastName");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userDepartment");
    localStorage.removeItem("userGpa");
    localStorage.removeItem("userName");
    localStorage.removeItem("isVoted");
    localStorage.removeItem("userTerm");
    setUserRole(null);
    setUserDepartment(null);
    setUserGpa(null);
    setUserName(null);
    setUserLastName(null);
    setUserTerm(null);
    setIsLoggedIn(false);
  };

  const setUserData = (role) => {
    setUserRole(role);
  };

  const setUserDepartmentData = (department) => {
    setUserDepartment(department);
  };
  const setUserTermData = (term) => {
    setUserTerm(term);
  };

  const setUserGpaData = (gpa) => {
    setUserGpa(gpa);
  };

  const setUserNameData = (name) => {
    setUserName(name);
  };
  const setIsVotedData = (isVoted) => {
    setIsVoted(isVoted);
  };
  const setUserLastNameData = (lastName) => {
    setUserLastName(lastName);
  };


  return (
    <AuthContext.Provider
      value={{
        isVoted: isVoted,
        userTerm: userTerm,
        isLoggedIn: isLoggedIn,
        userRole: userRole,
        userDepartment: userDepartment,
        userGpa: userGpa,
        userName: userName,
        userLastName: userLastName,
        setUserLastNameData: setUserLastNameData,
        setUserData: setUserData,
        setUserDepartmentData: setUserDepartmentData,
        setUserGpaData: setUserGpaData,
        setUserNameData: setUserNameData,
        setIsVotedData: setIsVotedData,
        setUserTermData: setUserTermData,
        onLogin: loginHandler,
        exitHandler: exitHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
