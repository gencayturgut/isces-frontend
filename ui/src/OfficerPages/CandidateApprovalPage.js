import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import "./CandidateApprovalPage.css";

const CandidateApprovalPage = () => {
  const authCtx = useContext(AuthContext);
  const [unEvalCandidates, setUnEvalCandidates] = useState([]);
  const [isElectionOn, setIsElectionOn] = useState(false);
  const [isCandidacyOn, setIsCandidacyOn] = useState(false);
  const url = `https://iztechelection.herokuapp.com/unevaluatedStudents/${authCtx.userDepartment}`;
  let returned = <h1>Candidacy period has not started!</h1>;

  useEffect(() => {
    checkElectionIsOn();
    checkCandidacyPeriod();
    fetchCandidateInfo();
  }, []);

  const checkElectionIsOn = async () => {
    try {
      const response = await axios.get(
        `https://iztechelection.herokuapp.com/isInElectionProcess`
      );

      if (response.data) {
        setIsElectionOn(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const checkCandidacyPeriod = async () => {
    try {
      const response = await axios.get(
        `https://iztechelection.herokuapp.com/isInCandidacyProcess`
      );

      if (response.data) {
        setIsCandidacyOn(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchCandidateInfo = async () => {
    try {
      const response = await axios.get(url);
      setUnEvalCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const updateCandidates = async (url) => {
    try {
      const response = await axios.get(url);
    } catch (error) {
      console.log("Error updating approved candidate", error);
    }
  };

  const approveCandidate = (studentNumber) => {
    const updatedCandidates = unEvalCandidates.filter(
      (candidate) => candidate.studentNumber !== studentNumber
    );
    setUnEvalCandidates(updatedCandidates);

    const urlForUpdate = `https://iztechelection.herokuapp.com/confirmStudent/${studentNumber}`;
    updateCandidates(urlForUpdate);
  };

  const rejectCandidate = (studentNumber) => {
    const updatedCandidates = unEvalCandidates.filter(
      (candidate) => candidate.studentNumber !== studentNumber
    );
    setUnEvalCandidates(updatedCandidates);

    const urlForUpdate = `https://iztechelection.herokuapp.com/rejectStudent/${studentNumber}`;
    updateCandidates(urlForUpdate);
  };

  const downloadCandidateFiles = async (studentNumber) => {
    try {
      const response = await axios.get(
        `https://iztechelection.herokuapp.com/downloadStudentFiles/${studentNumber}`,
        {
          responseType: "blob", // Set the response type to 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `student_files_${studentNumber}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading student files:", error);
    }
  };

  return (
    <>
      {isCandidacyOn ? (
        <div>
          {unEvalCandidates.length > 0 ? (
            <div className="vote-container">
              {unEvalCandidates.map((candidate) => (
                <div className="vote-box" key={candidate.candidateId}>
                  <div className="candidate-name">
                    <h3>
                      {candidate.firstName} {candidate.lastName}
                    </h3>
                  </div>
                  <div className="buttons">
                    <button
                      onClick={() => approveCandidate(candidate.studentNumber)}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectCandidate(candidate.studentNumber)}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() =>
                        downloadCandidateFiles(candidate.studentNumber)
                      }
                    >
                      Download Files
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <h1>There are no students to be approved.</h1>
          )}
        </div>
      ) : (
        returned
      )}
    </>
  );
};

export default CandidateApprovalPage;
