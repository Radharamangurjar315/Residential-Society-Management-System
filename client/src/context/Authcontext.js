import { createContext, useContext } from 'react';

const AuthContext = createContext({
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user')),
  
});

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const [resetEmail, setResetEmail] = useState(localStorage.getItem('resetEmail'));
  const [otpType, setOtpType] = useState(localStorage.getItem('otpType'));

  useEffect(() => {
    if (resetEmail) localStorage.setItem('resetEmail', resetEmail);
    else localStorage.removeItem('resetEmail');

    if (otpType) localStorage.setItem('otpType', otpType);
    else localStorage.removeItem('otpType');
  }, [resetEmail, otpType]);

  return (
    <AuthContext.Provider value={{ token, user, resetEmail, otpType, setResetEmail, setOtpType }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
