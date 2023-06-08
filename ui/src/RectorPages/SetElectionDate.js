import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "./SetElectionDate.css";

const SetElectionDate = () => {
  const [enteredStartDate, setEnteredStartDate] = useState(null);
  const [enteredEndDate, setEnteredEndDate] = useState(null);
  const [showAlertBox, setShowAlertBox] = useState(false);
  const [isInElectionProcess, setIsInElectionProcess] = useState(false);
  const [isElectionSettedNotStarted, setIsElectionSettedNotStarted] =
    useState(false);

  const electionSettedSuccessfully = (
    <div>
      <h1>Election Set Successfully</h1>
      <p>-Details-</p>
      <p>Start Date:{enteredStartDate}</p>
      <p>End Date: {enteredEndDate}</p>
      <button onClick={finishElection}>Cancel Election</button>
    </div>
  );
  const alertBox = (
    <div className="AlertBox">
      <h5>Invalid date</h5>
      <button onClick={changeAlertBoxVisible}>OK</button>
    </div>
  );

  const inElectionBox = (
    <div>
      <h1 className="alert-box-header">We are in election!</h1>
      <p>Start Date:{enteredStartDate}</p>
      <p>End Date: {enteredEndDate}</p>
      <button onClick={finishElection}>Cancel Election</button>;
    </div>
  );
  function changeAlertBoxVisible() {
    setEnteredStartDate(null);
    setEnteredEndDate(null);
    setShowAlertBox(!showAlertBox);
  }

  const handleDateTimeChange = (date, inputType) => {
    if (inputType === "start") {
      setEnteredStartDate(date);
    } else if (inputType === "end") {
      setEnteredEndDate(date);
    }
  };
  async function electionFetch(startDate, endDate) {
    try {
      const url = `https://iztechelection.herokuapp.com/enterElectionDate/${startDate}/${endDate}`;
      console.log(startDate);
      const response = await axios.get(url);
    } catch (error) {
      console.log(error.message);
    }
  }
  function isInputValid(startDate, endDate) {
    if (startDate && endDate) {
      const currentDate = new Date();

      return startDate < endDate && startDate > currentDate;
    }
    return false;
  }
  const handleSubmit = (e) => {
    localStorage.setItem("isDateSet", true);
    if (isInputValid(enteredStartDate, enteredEndDate)) {
      let startDateConverted = new Date(
        enteredStartDate.getTime() + 3 * 60 * 60 * 1000
      );
      let endDateConverted = new Date(
        enteredEndDate.getTime() + 3 * 60 * 60 * 1000
      );
      electionFetch(startDateConverted, endDateConverted);
    } else {
      changeAlertBoxVisible();
    }
  };

  const setElectionForm = (
    <div className="set-election-date-container">
      <form onSubmit={handleSubmit}>
        <div className="date-time-boxes">
          <div className="start-date-time-box date-time-box">
            <label htmlFor="start-date-time">Set Start Date and Time</label>
            <br />
            <br />
            <DatePicker
              id="start-date-time"
              selected={enteredStartDate}
              onChange={(date) => handleDateTimeChange(date, "start")}
              dateFormat="yyyy-MM-dd HH:mm"
              showTimeInput
              timeInputLabel="Time:"
              timeFormat="HH:mm"
              placeholderText="YYYY-MM-DD HH:mm"
            />
          </div>
          <div className="end-date-time-box date-time-box">
            <label htmlFor="end-date-time">Set End Date and Time</label>
            <br />
            <br />

            <DatePicker
              id="end-date-time"
              selected={enteredEndDate}
              onChange={(date) => handleDateTimeChange(date, "end")}
              dateFormat="yyyy-MM-dd HH:mm"
              showTimeInput
              timeInputLabel="Time:"
              timeFormat="HH:mm"
              placeholderText="YYYY-MM-DD HH:mm"
            />
          </div>
        </div>
        <br />
        <br />
        <button className="set-election-date-button" type="submit">
          Set
        </button>
      </form>
    </div>
  );
  useEffect(() => {
    getElectionDetails();
  }, []);
  async function finishElection() {
    try {
      const response = await axios.get(`https://iztechelection.herokuapp.com/finishElection`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }
  const getElectionDetails = async () => {
    try {
      const response = await axios.get(`https://iztechelection.herokuapp.com/electionDate`);
      const startDate = new Date(response.data.startDate);
      const endDate = new Date(response.data.endDate);
      const currentDate = new Date();
      console.log(response);
      if (startDate > currentDate) {
        setIsElectionSettedNotStarted(true);
        setIsInElectionProcess(false);
        setEnteredStartDate(response.data.startDate);
        setEnteredEndDate(response.data.endDate);
      } else if (startDate < currentDate && endDate > currentDate) {
        setEnteredStartDate(response.data.startDate);
        setEnteredEndDate(response.data.endDate);
        setIsElectionSettedNotStarted(false);
        setIsInElectionProcess(true);
      } else if (endDate < currentDate) {
        finishElection();
        setIsElectionSettedNotStarted(false);
        setIsInElectionProcess(false);
      } else {
        setIsElectionSettedNotStarted(false);
        setIsInElectionProcess(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {isInElectionProcess && inElectionBox}
      {showAlertBox && alertBox}
      {isElectionSettedNotStarted && electionSettedSuccessfully}
      {!isElectionSettedNotStarted &&
        !showAlertBox &&
        !isInElectionProcess &&
        setElectionForm}
    </div>
  );
};
export default SetElectionDate;
