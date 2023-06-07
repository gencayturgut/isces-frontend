import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const CandidateApprovalPage = () => {
  const authCtx = useContext(AuthContext);
  const [unEvalCandidates, setUnEvalCandidates] = useState([]);
  const [isElectionOn, setIsElectionOn] = useState(false);
  const url = `http://localhost:8080/unevaluatedStudents/${authCtx.userDepartment}`;
  let returned = <h1>Election has already started!</h1>;

  useEffect(() => {
    checkElectionIsOn();
    fetchCandidateInfo();
    console.log("fetched");
  }, []);

  const checkElectionIsOn = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/isInElectionProcess`
      );
      console.log(response.data);
      console.log(typeof response.data);

      if (response.data) {
        setIsElectionOn(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log(authCtx);
  const fetchCandidateInfo = async () => {
    try {
      const response = await axios.get(url);

      console.log(response.data);

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

    const urlForUpdate = `http://localhost:8080/confirmStudent/${studentNumber}`;
    updateCandidates(urlForUpdate);
  };

  const rejectCandidate = (studentNumber) => {
    const updatedCandidates = unEvalCandidates.filter(
      (candidate) => candidate.studentNumber !== studentNumber
    );
    setUnEvalCandidates(updatedCandidates);

    const urlForUpdate = `http://localhost:8080/rejectStudent/${studentNumber}`;
    updateCandidates(urlForUpdate);
  };

  console.log(unEvalCandidates);

  return (
    <>
      {!isElectionOn ? (
        <div>
          {unEvalCandidates.length > 0 ? (
            <div>
              {unEvalCandidates.map((candidate) => (
                <div key={candidate.candidateId}>
                  <h3>{candidate.firstName}</h3>
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
