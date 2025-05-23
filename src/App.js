import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ABI } from './contractABI';
import MetaMaskConnect from './components/MetaMaskConnect';
import QuestionForm from './components/QuestionForm';
import QuestionList from './components/QuestionList';
import AnswerForm from './components/AnswerForm';
import AnswerList from './components/AnswerList';
import './App.css';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (contract) {
      loadQuestions();
    }
  }, [contract]);

  useEffect(() => {
    if (contract && selectedQuestion) {
      loadAnswers(selectedQuestion);
    }
  }, [contract, selectedQuestion]);

  const loadQuestions = async () => {
    try {
      const questionCount = await contract.questionCount();
      const loadedQuestions = [];
      
      for (let i = 1; i <= questionCount; i++) {
        const question = await contract.getQuestion(i);
        loadedQuestions.push(question);
      }
      
      setQuestions(loadedQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const loadAnswers = async (questionId) => {
    try {
      const loadedAnswers = await contract.getAnswers(questionId);
      setAnswers(loadedAnswers);
    } catch (error) {
      console.error('Error loading answers:', error);
    }
  };

  const handleConnect = async (provider) => {
    const signer = await provider.getSigner();
    const QAContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    setProvider(provider);
    setContract(QAContract);
  };

  const handlePostQuestion = async (content) => {
    setIsSubmitting(true);
    try {
      const tx = await contract.postQuestion(content);
      await tx.wait();
      await loadQuestions();
    } catch (error) {
      console.error('Error posting question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostAnswer = async (questionId, content) => {
    setIsSubmitting(true);
    try {
      const tx = await contract.postAnswer(questionId, content);
      await tx.wait();
      await loadAnswers(questionId);
    } catch (error) {
      console.error('Error posting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuestionVote = async (questionId, isUpvote) => {
    try {
      const tx = await contract.voteQuestion(questionId, isUpvote);
      await tx.wait();
      await loadQuestions();
    } catch (error) {
      console.error('Error voting on question:', error);
    }
  };

  const handleAnswerVote = async (questionId, answerIndex, isUpvote) => {
    try {
      const tx = await contract.voteAnswer(questionId, answerIndex, isUpvote);
      await tx.wait();
      await loadAnswers(questionId);
    } catch (error) {
      console.error('Error voting on answer:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧠 Decentralized Q&A Board</h1>
        <MetaMaskConnect onConnect={handleConnect} />
      </header>

      <main className="app-main">
        {contract ? (
          <>
            <section className="questions-section">
              <h2>Ask a Question</h2>
              <QuestionForm onSubmit={handlePostQuestion} isSubmitting={isSubmitting} />
              
              <h2>Questions</h2>
              <QuestionList 
                questions={questions}
                onVote={handleQuestionVote}
                onSelectQuestion={setSelectedQuestion}
              />
            </section>

            {selectedQuestion && (
              <section className="answers-section">
                <h2>Answers</h2>
                <AnswerForm 
                  questionId={selectedQuestion}
                  onSubmit={handlePostAnswer}
                  isSubmitting={isSubmitting}
                />
                <AnswerList 
                  answers={answers}
                  onVote={handleAnswerVote}
                />
              </section>
            )}
          </>
        ) : (
          <div className="connect-prompt">
            Please connect your MetaMask wallet to start using the app.
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
