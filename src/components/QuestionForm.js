import React, { useState } from 'react';

const QuestionForm = ({ onSubmit, isSubmitting }) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    try {
      await onSubmit(question);
      setQuestion('');
    } catch (error) {
      console.error('Error posting question:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="question-form">
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your question here..."
        rows="4"
        disabled={isSubmitting}
      />
      <button 
        type="submit" 
        disabled={!question.trim() || isSubmitting}
        className="submit-button"
      >
        {isSubmitting ? 'Posting...' : 'Post Question'}
      </button>
    </form>
  );
};

export default QuestionForm; 