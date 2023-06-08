import { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

export default function Candidates() {
  const authCtx = useContext(AuthContext);
  
  const [candidates, setCandidates] = useState([]);
  const [showAlertBox, setShowAlertBox] = useState(false);
  const [isVoted, setIsVoted] = useState(false);
  const [showSentVoteInfo, setShowSentVoteInfo] = useState(false);
  const [votedCandidateID, setVotedCandidateID] = useState(null);
  const [electionIsOn, setElectionIsOn] = useState(false);
  //const [departmentName, setDepartmentName] = useState(null);
  var url;
  if (
    authCtx.userRole === "student" ||
    authCtx.userRole === "candidate" ||
    authCtx.userRole === "officer"
  ) {
    url = `https://iztechelectionfrontend.herokuapp.com//candidates/allCandidates/${authCtx.userDepartment}`;
  } else {
    url = `https://iztechelectionfrontend.herokuapp.com//candidates/allCandidates`;
  }
  const studentNum = localStorage.getItem("uid");
  const getStudentUrl = `https://iztechelectionfrontend.herokuapp.com//getStudent/${studentNum}`;

  const checkElectionIsOn = async () => {
    try {
      const response = await axios.get(
        `https://iztechelectionfrontend.herokuapp.com//isInElectionProcess`
      );
      setElectionIsOn(response.data);
    } catch (error) {
      console.error("Error checking election status:", error);
    }
  };

  useEffect(() => {
      checkElectionIsOn();
      fetchCandidateInfo();
      fetchUserInfo();

  }, []);

  const fetchCandidateInfo = async () => {
    try {
      const response = await axios.get(url);


      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(getStudentUrl);
      if (authCtx.userRole === "student" || authCtx.userRole === "candidate") {
        setIsVoted(response.data.voted);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const voteHandler = async (id) => {
    try {
      const response = await axios.get(
        `https://iztechelectionfrontend.herokuapp.com//vote/${studentNum}/${id}`
      );
      if (response.status === 200) {
        setShowSentVoteInfo(true);
        setVotedCandidateID(id);
      }
    } catch (error) {
      console.error("Voting:", error);
    }
  };

  const alertBoxHandler = (candidate) => {
    setVotedCandidateID(candidate.candidateId);
    setShowAlertBox(!showAlertBox);
  };
  const departmentNames = [
    "Electrical Engineering",
    "Computer Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
  ];
  const departmentIds = [1, 2, 3, 4];

  const voteForm = (
    <div className="container">
      {candidates.length > 0 && authCtx.userRole !== "rector" && (
        <ul>
          {candidates.map((candidate, index) => {
            return (
              <li key={index}>
                Candidate Name: {candidate.student.firstName}
                <br />
                {/* Diğer bilgileri buraya ekleyebilirsiniz */}
                {((authCtx.userRole === "student" ||
                  authCtx.userRole === "candidate") && electionIsOn) && (
                  <button onClick={() => alertBoxHandler(candidate)}>
                    Vote
                  </button>
                )}
              </li>
            );

            return null;
          })}
        </ul>
      )}
      {candidates.length > 0 && authCtx.userRole === "rector" && (
        <ul>
          {departmentIds.map((departmentId) => (
            <li key={departmentId}>
              <strong>Department: {departmentNames[departmentId - 1]}</strong>
              <ul>
                {candidates.map((candidate, index) => {
                  if (candidate.student.departmentId === departmentId) {
                    return (
                      <li key={index}>
                        Candidate Name: {candidate.student.firstName}
                        <br />
                        {/* Diğer bilgileri buraya ekleyebilirsiniz */}
                        {((authCtx.userRole === "student" ||
                          authCtx.userRole === "candidate") && electionIsOn) && (
                            <button onClick={() => alertBoxHandler(candidate)}>
                              Vote
                            </button>
                          )}
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}
      {candidates.length == 0 && <h3>There are no candidates yet.</h3>}
    </div>
  );

  const electionNotStartBox = <h1>There is no election right now!</h1>;
  const reload = () => {
    window.location.reload();
  };
  const votedInfo = (
    <div>
      Your vote has been sent to {votedCandidateID}
      <button onClick={reload}>OK</button>
    </div>
  );

  const afterVoteScreen = (
    <div>
      You have already voted!
      <h1>Current Candidates</h1>
      <div className="container">
        <ul>
          {candidates.map((candidate, index) => (
            <li className="list-item" key={index}>
              {candidate.student.firstName}
              <br />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const alertBox = (
    <div>
      Are you sure you want to vote for {votedCandidateID}?
      <button onClick={() => voteHandler(votedCandidateID)}>Yes</button>
      <button onClick={alertBoxHandler}>No</button>
    </div>
  );


  return (
    <div>
      {!electionIsOn && electionNotStartBox}
      {showSentVoteInfo && votedInfo}
      {showAlertBox && !showSentVoteInfo && alertBox}
      {!isVoted  && !showAlertBox && voteForm}
      {isVoted && afterVoteScreen}
    </div>
  );
}
