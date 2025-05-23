import React from 'react';

const AnswerList = ({ answers, onVote }) => {
  const formatTimestamp = (timestamp) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="answer-list">
      {answers.map((answer, index) => (
        <div key={index} className="answer-card">
          <div className="answer-header">
            <span className="author">Answered by: {formatAddress(answer.author)}</span>
            <span className="timestamp">{formatTimestamp(answer.timestamp)}</span>
          </div>
          <div className="answer-content">
            {answer.content}
          </div>
          <div className="answer-footer">
            <div className="vote-buttons">
              <button 
                onClick={() => onVote(answer.questionId, index, true)}
                className="vote-button upvote"
              >
                👍 {answer.upvotes}
              </button>
              <button 
                onClick={() => onVote(answer.questionId, index, false)}
                className="vote-button downvote"
              >
                👎 {answer.downvotes}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnswerList; 