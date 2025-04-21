import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, BarChart3, Clock, Users, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const PollSystem = ({ user }) => {
  const [polls, setPolls] = useState([]);
  const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''], duration: 60 });
  const [error, setError] = useState('');

  useEffect(() => { fetchPolls(); }, []);

  const fetchPolls = async () => {
    if (!user || !user.societyId) {
      setError("User or society ID is missing.");
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/polls?societyId=${encodeURIComponent(user.societyId)}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (Array.isArray(data) && data.length === 0) {
        setPolls([]); // Set empty array to indicate no polls
      } else {
        setPolls(data);
      }
    } catch (error) {
      setError('Failed to fetch polls: ' + error.message);
      setPolls([]); // Ensure UI doesn't break even if there's an error
      setError();
    }
  };
  
  const createPoll = async (e) => {
    e.preventDefault();
    if (user.role !== 'admin') return setError('Only admins can create polls.');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/polls/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newPoll.question,
          options: newPoll.options.map(option => ({ text: option, votes: 0 })),
          societyId: user.societyId,  // Ensure societyId is provided
          duration: parseInt(newPoll.duration)
        })
        
      });
      if (response.ok) {
        setNewPoll({ question: '', options: ['', ''], duration: 60 });
        fetchPolls();
      }
    } catch (error) { setError('Failed to create poll'); }
  };

  const deletePoll = async (pollId) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/polls/${pollId}`);
      
      if (response.status === 200) {
        // Update state by filtering out deleted poll
        setPolls((prevPolls) => prevPolls.filter(poll => poll._id !== pollId));
      }
    } catch (error) {
      console.error("Error deleting poll:", error);
      setError("Failed to delete poll");
    }
  };
  
  const votePoll = async (pollId, optionIndex) => {
    if (!user || !user._id || !user.societyId) {  
      console.error("User ID is missing:", user);
      setError("User is not authenticated.");
      return;
    }
  
    try {
      console.log("Voting with:", { userId: user._id, userName: user.name, optionIndex });
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, optionIndex, userName: user.name, societyId: user.societyId })
      });
  
      if (response.ok) {
        fetchPolls();  // Refresh poll data
      } else {
        const errorMessage = await response.json();
        console.error("Vote error:", errorMessage);
        setError(errorMessage.message);
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("Failed to cast vote");
    }
  };

  // Calculate percentage for progress bars
  const calculatePercentage = (option, poll) => {
    const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
    if (totalVotes === 0) return 0;
    return Math.round((option.votes || 0) / totalVotes * 100);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex justify-between">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
            <button 
              type="button" 
              className="text-red-500 hover:text-red-700" 
              onClick={() => setError("")}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Admin-Only Create Poll Section */}
          {user.role === "admin" && (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">Create New Poll</h2>
              </div>
              
              <form onSubmit={createPoll} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Poll Question</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                    placeholder="What would you like to ask?"
                    value={newPoll.question}
                    onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                    required
                  />
                </div>
                
                {newPoll.options.map((option, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Option {index + 1}</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newPoll.options];
                        newOptions[index] = e.target.value;
                        setNewPoll({ ...newPoll, options: newOptions });
                      }}
                      required
                    />
                  </div>
                ))}
                
                <div className="flex flex-wrap gap-4 items-center">
                  <button 
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                    onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ""] })}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Option
                  </button>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
                    <input
                      type="number"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                      value={newPoll.duration}
                      onChange={(e) => setNewPoll({ ...newPoll, duration: e.target.value })}
                      min="1"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
                >
                  Create Poll
                </button>
              </form>
            </div>
          )}

          {/* Active Polls Section */}
          <div className={`${user.role === "admin" ? "lg:col-span-1" : "lg:col-span-2"}`}>
            <div className="flex items-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Active Polls</h2>
            </div>

            {polls.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-100">
                <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                  <BarChart3 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-500">No active polls available</h3>
                <p className="mt-2 text-sm text-gray-400">
                  {user.role === "admin" ? "Create a new poll to get started." : "Check back later for new polls."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-screen overflow-y-auto pr-1">
                {polls.map(poll => (
                  <div key={poll._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-800">{poll.question}</h3>
                        {user.role === "admin" && (
                          <button
                            onClick={() => deletePoll(poll._id)}
                            className="text-red-500 hover:text-red-700 focus:outline-none"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Created: {new Date(poll.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      {poll.options.map((option, index) => {
                        const percentage = calculatePercentage(option, poll);
                        return (
                          <div key={index} className="space-y-1">
                            <button
                              onClick={() => votePoll(poll._id, index)}
                              className="w-full text-left px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                            >
                              <div className="flex justify-between items-center">
                                <span>{option.text || option}</span>
                                <span className="font-medium text-indigo-600">{percentage}%</span>
                              </div>
                            </button>
                            
                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-indigo-600 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            
                            {/* Voters list */}
                            {option.voters && option.voters.length > 0 && (
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <Users className="h-3 w-3 mr-1" />
                                <span>
                                  Voted by: {option.voters.map(voter => voter.userName).join(", ")}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollSystem;