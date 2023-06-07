import React from "react";

const CandidateCard = (props) => {
  return (
    <div className="container">
      <div className="card">
        <div>
          <img src={props.image} alt={props.name} />
          <div>{props.name}</div>
          <div>{props.gpa}</div>
          <div>{props.department}</div>
          <div>{props.description}</div>
          <div>{props.currentVote}</div>
        </div>
        <button onClick={props.showAlertBoxHandler}>Vote</button>
      </div>
    </div>
  );
};

export default CandidateCard;
