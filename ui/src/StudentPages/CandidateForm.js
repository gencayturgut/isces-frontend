import { useContext, useState, useEffect } from "react";
import "./CandidateForm.css";
import axios from "axios";
import AuthContext from "../context/AuthContext";
export default function CandidateForm() {
  const studentNum = localStorage.getItem("uid");
  const [transcript, setTranscript] = useState("");
  const [criminalRecord, setCriminalRecord] = useState();
  const [validCandidate, setValidCandidate] = useState(false);
  const [alertBoxContent, setAlertBoxContent] = useState("");
  const [isCandidacyOn, setIsCandidacyOn] = useState(false);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    checkCandidacyPeriod();
  }, []);
  const checkCandidacyPeriod = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/isInCandidacyProcess"
      );

      if (response.data) {
        setIsCandidacyOn(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const reload = () => {
    window.location.reload();
  };
  // user id'im ile aday adayı olmadığım belli olacak. eğer ispending ise değiştir olacak. eğer kabulsem sayfada zaten adaysın yazacak.
  //const apply = async (candidateData) => {
  const apply = async () => {
    try {
      /*const formData = new FormData();
      formData.append("studentNum", candidateData.studentNum);
      formData.append("transcript", candidateData.transcript);
      formData.append("criminalRecord", candidateData.criminalRecord);*/

      /*const response = await axios.post(
        `https://iztechelection.herokuapp.com/uploadFolder`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );*/
      const res = await axios.get(
        `https://iztechelection.herokuapp.com/applyToBeCandidate/${localStorage.getItem(
          "uid"
        )}`
      );
      if (res.status == 200) {
        reload();
      }
    } catch (error) {
      console.error(error.message);
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
    <div>
      {isCandidacyOn ? (
        authCtx.isApplied ? (
          <h1>Your application has already been received.</h1>
        ) : (
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

            <div className="alertBox-box">{alertBoxContent}</div>
          </div>
        )
      ) : (
        <h1>New candidacy period has not started yet!</h1>
      )}
    </div>
  );
}
