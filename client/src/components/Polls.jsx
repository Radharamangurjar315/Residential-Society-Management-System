import React, { useState } from 'react';
import './Polls.css';

export function Poll() {
  const [options] = useState([
    { id: '1', text: 'React' },
    { id: '2', text: 'Vue' },
    { id: '3', text: 'Angular' },
    { id: '4', text: 'Svelte' },
  ]);

  const [votes, setVotes] = useState([]);
  const [voterName, setVoterName] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  const handleVote = () => {
    if (!selectedOption || !voterName.trim()) return;

    const newVote = {
      option: selectedOption,
      voter: voterName,
      timestamp: new Date(),
    };

    setVotes([...votes, newVote]);
    setVoterName('');
    setSelectedOption(null);
  };

  const getVoteCount = (optionId) => votes.filter((vote) => vote.option === optionId).length;

  const getTotalVotes = () => votes.length;

  const getVotePercentage = (optionId) => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return (getVoteCount(optionId) / total) * 100;
  };

  return (
    <div className="poll-container">
      <h2 className="poll-title">What's your favorite frontend framework?</h2>

      {/* Voting Interface */}
      <input
        type="text"
        placeholder="Enter your name"
        value={voterName}
        onChange={(e) => setVoterName(e.target.value)}
        className="poll-input"
      />

      <div className="poll-options">
        {options.map((option) => (
          <div
            key={option.id}
            className={`poll-option ${selectedOption === option.id ? 'selected' : ''}`}
            onClick={() => setSelectedOption(option.id)}
          >
            <span>{option.text}</span>
            <div className="poll-progress-bar">
              <div
                className="poll-progress-bar-filled"
                style={{ width: `${getVotePercentage(option.id)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleVote}
        disabled={!selectedOption || !voterName.trim()}
        className="poll-vote-btn"
      >
        Vote
      </button>

      {/* Vote History */}
      <div className="poll-history">
        <h3>Vote History</h3>
        {votes.map((vote, index) => (
          <div key={index} className="poll-history-item">
            <span>{vote.voter} voted for {options.find((opt) => opt.id === vote.option)?.text}</span>
            <span className="poll-history-timestamp">
              {new Date(vote.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      {/* Total Votes */}
      <div className="poll-total-votes">
        Total Votes: <strong>{getTotalVotes()}</strong>
      </div>
    </div>
  );
}

export default Poll;
