import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthContext from "./context/AuthContext";
import Login from "./Pages/Login";
import Candidates from "./StudentPages/Candidates";
import Election from "./Pages/Election";
import CandidateForm from "./StudentPages/CandidateForm";
import Council from "./StudentPages/Council";
import SideBar from "./Mainpage-Components/SideBar";
import Home from "./Pages/Home";
import "./App.css";
import SetElectionDate from "./RectorPages/SetElectionDate";
import Profile from "./Pages/Profile";
import CandidateApprovalPage from "./OfficerPages/CandidateApprovalPage";
import axios from "axios";
function App() {
  const url = "http://localhost:8080/isInElectionProcess";
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    checkElectionIsOn();
  }, []);
  const checkElectionIsOn = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/isInElectionProcess`
      );

    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          {!authCtx.isLoggedIn && <Route path="/" element={<Login />} />}
          {authCtx.isLoggedIn && (
            <>
              {/* Buraya auth context ile kullanıcıların hangi sayfaları görebileceğini ekleyeceğiz. 
              Şu an kullanıcı giriş yapmamışken hiçbir sayfaya giremiyor karşısına hep login çıkacak.
              Giriş yaptıktan sonra öğrenci ve görevlilere farklı butonlar aktif olacak. Inline if state'i ve 
              authcontext rol kontrolü ile bunu sağlayacağız. */}
              {
                <Route element={<SideBar />}>
                  <Route path="/council" element={<Council />} />

                  {authCtx.userRole == "rector" && (
                    <Route
                      path="/setelectiondate"
                      element={<SetElectionDate />}
                    />
                  )}
                  {authCtx.userRole == "officer" && (
                    <Route
                      path="/candidateapproval"
                      element={<CandidateApprovalPage />}
                    />
                  )}
                  <Route path="/" element={<Home />} />

                  <Route path="/candidates" element={<Candidates />} />

                  <Route path="/election" element={<Election />} />
                  {(authCtx.userRole === "student" ||
                    authCtx.userRole === "candidate") && (
                    <Route path="/candidateform" element={<CandidateForm />} />
                  )}
                  <Route path="/profile" element={<Profile />} />
                </Route>
              }
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
