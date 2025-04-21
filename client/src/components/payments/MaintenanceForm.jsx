import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SubmitMaintenanceForm() {
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState('UPI');
  const [txn, setTxn] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });
    
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/maintenance/submit`, {
        amount,
        paymentMethod: method,
        transactionId: txn,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      
      setStatus({ type: 'success', message: 'Payment submitted for verification' });
      
      setAmount('');
      setTxn('');
       // Redirect to dashboard after submission
       const user = JSON.parse(localStorage.getItem('user'));
        const role = user.role; 
    if (role === 'admin') {
      navigate('/maintenancedashboard');
    }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to submit payment' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form 
        onSubmit={handleSubmit} 
        className="p-6 bg-white rounded-lg shadow-lg border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Maintenance Payment</h2>
        
        {status.message && (
          <div className={`mb-4 p-3 rounded-md ${
            status.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {status.message}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount*
          </label>
          <input 
            id="amount"
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="Enter payment amount" 
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select 
            id="method"
            value={method} 
            onChange={(e) => setMethod(e.target.value)} 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-colors"
          >
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="txn" className="block text-sm font-medium text-gray-700 mb-1">
            Transaction ID (optional)
          </label>
          <input 
            id="txn"
            type="text" 
            value={txn} 
            onChange={(e) => setTxn(e.target.value)} 
            placeholder="Enter transaction reference" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full py-2 px-4 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Payment'}
        </button>
      </form>
    </div>
  );
}