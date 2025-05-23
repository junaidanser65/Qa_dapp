import React, { useState } from 'react';

const AnswerForm = ({ questionId, onSubmit, isSubmitting }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;
    
    try {
      await onSubmit(questionId, answer);
      setAnswer('');
    } catch (error) {
      console.error('Error posting answer:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="answer-form">
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        rows="4"
        disabled={isSubmitting}
      />
      <button 
        type="submit" 
        disabled={!answer.trim() || isSubmitting}
        className="submit-button"
      >
        {isSubmitting ? 'Posting...' : 'Post Answer'}
      </button>
    </form>
  );
};

export default AnswerForm; 