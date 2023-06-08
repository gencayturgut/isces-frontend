import { useContext, useState } from "react";
import "./CandidateForm.css";
import axios from "axios";
import AuthContext from "../context/AuthContext";
export default function CandidateForm() {
  const studentNum = localStorage.getItem("uid");
  const [transcript, setTranscript] = useState("");
  const [criminalRecord, setCriminalRecord] = useState();
  const [validCandidate, setValidCandidate] = useState(false);
  const [alertBoxContent, setAlertBoxContent] = useState("");

  const authCtx = useContext(AuthContext);
  // user id'im ile aday adayı olmadığım belli olacak. eğer ispending ise değiştir olacak. eğer kabulsem sayfada zaten adaysın yazacak.
  //const apply = async (candidateData) => {
  const apply = async () => {
    try {
      /*const formData = new FormData();
      formData.append("studentNum", candidateData.studentNum);
      formData.append("transcript", candidateData.transcript);
      formData.append("criminalRecord", candidateData.criminalRecord);*/

      /*const response = await axios.post(
        `http://localhost:8080/uploadFolder`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );*/
      await axios.get(`http://localhost:8080/applyToBeCandidate/${localStorage.getItem("uid")}`);
    } catch (error) {
      console.error(error);
    }
  };

  function submitHandler(e) {
    e.preventDefault();
    /* if (transcript && criminalRecord) {
      const candidateData = {
        studentNum,
        transcript,
        criminalRecord,
      };
     // apply(candidateData);
      setTranscript("");
      setCriminalRecord("");
      setValidCandidate(true);
      setAlertBoxContent("Başvurunuz başarıyla alınmıştır.");
    } else {
      setValidCandidate(false);
      setAlertBoxContent("Lütfen tüm bilgileri doldurun.");
    }
   */ apply();
  }

  return (
    <div className="be-candidate-container">
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
  );
}
