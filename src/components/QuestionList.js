import React from 'react';
import { ethers } from 'ethers';

const QuestionList = ({ questions, onVote, onSelectQuestion }) => {
  const formatTimestamp = (timestamp) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="question-list">
      {questions.map((question) => (
        <div key={question.id} className="question-card">
          <div className="question-header">
            <span className="author">Posted by: {formatAddress(question.author)}</span>
            <span className="timestamp">{formatTimestamp(question.timestamp)}</span>
          </div>
          <div className="question-content" onClick={() => onSelectQuestion(question.id)}>
            {question.content}
          </div>
          <div className="question-footer">
            <div className="vote-buttons">
              <button 
                onClick={() => onVote(question.id, true)}
                className="vote-button upvote"
              >
                👍 {question.upvotes}
              </button>
              <button 
                onClick={() => onVote(question.id, false)}
                className="vote-button downvote"
              >
                👎 {question.downvotes}
              </button>
            </div>
            <button 
              onClick={() => onSelectQuestion(question.id)}
              className="view-answers-button"
            >
              View Answers
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionList; 