import { useState, useEffect } from "react";
import "./CandidateForm.css";
import axios from "axios";
export default function CandidateForm() {
  const studentNum = localStorage.getItem("uid");
  const [transcript, setTranscript] = useState("");
  const [criminalRecord, setCriminalRecord] = useState();
  const [validCandidate, setValidCandidate] = useState(false);
  const [alertBoxContent, setAlertBoxContent] = useState("");
  const [isApplied, setIsApplied] = useState("");
  useEffect(() => {
    getUser(studentNum);
  }, []);
  async function getUser(stNum) {
    try {
      const res = await axios.get(
        `https://iztechelection.herokuapp.com/getStudent/${stNum}`
      )
      console.log(res)
      setIsApplied(res.data.isAppliedForCandidacy)
    }
    catch (error) {
      console.error(error);
    }
  }
  async function apply(stNum) {
    try {
      await axios.get(
        `https://iztechelection.herokuapp.com/applyToBeCandidate/${stNum}`,
      );
      setIsApplied(true)
    } catch (error) {
      console.error(error);
    }
  }

  function submitHandler(e) {
    e.preventDefault();
    if (transcript && criminalRecord) {
      apply(studentNum, transcript, criminalRecord);
    } else {
      setValidCandidate(false);
      setAlertBoxContent("Lütfen tüm bilgileri doldurun.");
    }
  }
  const formbox = <div className="be-candidate-container">
    <form className="be-candidate-form" onSubmit={submitHandler}>
      <br />
      <br />
      <label className="transcript-record-label">
        <span>Transcript of Records:</span>
        <input
          className="transcript-input"
          type="file"
          accept="application/pdf"
          onChange={(e) => setTranscript(e.target.files[0])}
        />
      </label>
      <br />
      <label className="criminal-record-label">
        <span>Criminal Record:</span>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setCriminalRecord(e.target.files[0])}
        />
      </label>
      <br />

      <button className="be-candidate-button" type="submit">
        Be Candidate
      </button>
    </form>
    {validCandidate ? (
      <div className="alertBox-box">{alertBoxContent}</div> // true
    ) : (
      <div className="alertBox-box">{alertBoxContent}</div> // false
    )}
  </div>
  const alertBox = <div>You already applied</div>
  return (
    isApplied ? alertBox : formbox
  );
}
