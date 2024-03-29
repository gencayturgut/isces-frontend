import "./Council.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Council() {
  const [delegates, setDelegates] = useState([]);
  const url = "https://iztechelection.herokuapp.com/allDelegates";

  const fetchDelegates = async () => {
    try {
      const res = await axios.get(url);
      setDelegates(res.data);
    } catch (error) {
      console.error("Error fetching candidates:", error.message);
    }
  };

  useEffect(() => {
    fetchDelegates();
  }, []);

  return (
    <div className="council-container">
      <h1 className="our-council">OUR COUNCIL</h1>
      <h2 className="member-title">Department Representatives</h2>
      {delegates.length > 0 ? (
        <div className="delegate-container">
          {delegates.map((delegate) => (
            <div
              key={delegate.delegateId}
              className="council-member department-representative"
            >
              <h2 className="member-title">Department Representatives</h2>
              <div className="council-member-photo"></div>
              <div className="council-member-info">
                <div className="council-member-name">
                  {delegate.candidate.student.firstName}{" "}
                  {delegate.candidate.student.lastName}
                </div>
                <div className="council-member-department">
                  {delegate.candidate.student.department.departmentName}
                </div>
                <div className="council-member-contact">
                  {delegate.candidate.student.user.email}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h1>No delegates found.</h1>
      )}
    </div>
  );
}
