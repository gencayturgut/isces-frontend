import React, { useContext, useState, useEffect } from "react";
import "./Election.css";
import { Chart } from "react-google-charts";

import axios from "axios";
import AuthContext from "../context/AuthContext";

function Election() {
  const authCtx = useContext(AuthContext);
  const [department, setDepartment] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState(1);
  const [electionIsOn, setElectionIsOn] = useState(false);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [candidateCount, setCandidateCount] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [isVoted, setIsVoted] = useState(false);
  const [tiedDelegates, setTiedDelegates] = useState([]);

  const checkElectionIsOn = async () => {
    try {
      const response = await axios.get(
        "https://iztechelectionfrontend.herokuapp.com//isInElectionProcess"
      );
      setElectionIsOn(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchCandidateInfo();
    checkElectionIsOn();
  }, [department, selectedDepartment]);

  useEffect(() => {
    fetchTiedCandidates();
  });

  const fetchTiedCandidates = async () => {
    try {
      const response = await axios.get("https://iztechelectionfrontend.herokuapp.com//tiedDelegates");
      setTiedDelegates(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchCandidateInfo = async () => {
    try {
      let url = `https://iztechelectionfrontend.herokuapp.com//candidates/allPreviousElectionCandidates/${selectedDepartment}`;
      const response = await axios.get(url);

      const transformedCandidates = [
        ["Name", "Percentage"],
        ...response.data.map((candidate) => [
          candidate.student.firstName,
          candidate.votes,
        ]),
      ];
  

      setCandidateCount(response.data.length); // Set the candidate count
      setFilteredCandidates(transformedCandidates);
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const options = {
    title: "Election Results",
    is3D: true,
  };

  const chartHandler = (event) => {


    setSelectedDepartment(event.target.value);
  };

  const concludeElection = () => {
    // Find the candidate(s) with the highest percentage
    let maxVote = 0;
    let candidateWithMaxVotes = [];
    let hasMultipleMaxValues = false;

    for (let i = 0; i < tiedDelegates.length; i++) {
      const votes = tiedDelegates[i].votes;

      if (votes > maxVote) {
        maxVote = votes;
        candidateWithMaxVotes = [tiedDelegates[i]];
        hasMultipleMaxValues = false;
      } else if (votes === maxVote) {
        candidateWithMaxVotes.push(tiedDelegates[i]);
        hasMultipleMaxValues = true;
      }
    }


    // Check if there are equal maximum votes
    const maxVotes = Math.max(
      ...tiedDelegates.map((candidate) => candidate.votes)
    );
    const candidatesWithMaxVotes = tiedDelegates.filter(
      (candidate) => candidate.votes === maxVotes
    );


    const departments = [
      ...new Set(
        tiedDelegates.map(
          (candidate) => candidate.candidate.student.department.departmentId
        )
      ),
    ];

    const handleCandidateSelect = (department, candidateId) => {
      setSelectedCandidates((prevState) => ({
        ...prevState,
        [department]: candidateId,
      }));
    };

    const handleConcludeTie = async (department) => {
      // Process the selected candidate ID for the department and send it to the backend
      const selectedCandidateId = selectedCandidates[department];
      // Send the selectedCandidateId to the backend using your preferred method (e.g., API call)
  
      try {
        const url = `https://iztechelectionfrontend.herokuapp.com//concludeTie/${selectedCandidateId}`;
        const res = await axios.get(url);
      } catch (error) {
        console.log(error.message);
      }
    };

    return (
      <>
        {tiedDelegates.length > 1 && (
          <>
            <h1>Conclude Tie</h1>
            {departments.map((department) => (
              <div className="department" key={department}>
                <h2>{department}</h2>
                <div className="candidates">
                  {tiedDelegates
                    .filter(
                      (delegate) =>
                        delegate.candidate.student.department.departmentId ===
                        department
                    )
                    .map((delegate) => (
                      <div className="candidate" key={delegate.delegateId}>
                        <h3>
                          {delegate.candidate.student.firstName}{" "}
                          {delegate.candidate.student.lastName}
                        </h3>
                        <input
                          type="checkbox"
                          checked={
                            selectedCandidates[department] ===
                            delegate.delegateId
                          }
                          onChange={() =>
                            handleCandidateSelect(
                              department,
                              delegate.delegateId
                            )
                          }
                        />
                      </div>
                    ))}
                </div>
                <button
                  onClick={() => handleConcludeTie(department)}
                  disabled={!selectedCandidates[department]}
                >
                  Conclude Tie
                </button>
              </div>
            ))}
          </>
        )}
      </>
    );
  };

  return (
    <div className="container">
      {electionIsOn && <h1>Election is currently in progress.</h1>}
      {!electionIsOn && candidateCount !== 0 && (
        <div>
          <form>
            <select value={selectedDepartment} onChange={chartHandler}>
              <option value="1">Electronic Engineering</option>
              <option value="2">Computer Engineering</option>
              <option value="3">Mechanical Engineering</option>
              <option value="4">Civil Engineering</option>
            </select>
          </form>
          <Chart
            chartType="PieChart"
            data={filteredCandidates}
            options={options}
          />
        </div>
      )}
      {!electionIsOn && candidateCount === 0 && (
        <div>
          <form>
            <select value={selectedDepartment} onChange={chartHandler}>
              <option value="1">Electronic Engineering</option>
              <option value="2">Computer Engineering</option>
              <option value="3">Mechanical Engineering</option>
              <option value="4">Civil Engineering</option>
            </select>
          </form>
          <h1>There are no candidates for this department.</h1>
        </div>
      )}
      {!isVoted && authCtx.userRole == "rector" && concludeElection()}
    </div>
  );
}

export default Election;
