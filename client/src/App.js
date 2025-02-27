// import React, { useEffect, createContext, useContext } from "react";
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar';
import Home from "./components/Home";
import Profile from "./components/Profile";
import Signin from "./components/Signin";
import Signup from "./components/Signup";


// import CreatePost from "./components/CreatePost";
import "./App.css"; 
import Polls from './components/Polls';
import EventCalendar from './components/EventCalendar';
import Explore from './components/Explore';
import Notice from './components/Notice';


// import { reducer, initialState } from "./reducer/userReducer";

// export const UserContext = createContext();

// const Routing = () => {
//   const navigate = useNavigate();
//   const { dispatch } = useContext(UserContext);

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user) {
//       dispatch({ type: "USER", payload:user });
//     }else{
//       navigate("/signin")
  //   }
    
  // }, );
// return(
//   <Routes>
//       {/* <Route exact path="/" element={state.user? <Home /> : <Signin/>} /> */}
//       <Route path="/signin" element={<Signin />} />
//       <Route path="/signup" element={<Signup />} />
//       {/* <Route path="/profile" element={(state.user)? <Profile /> :  <Signin/>} /> */}
//       {/* <Route path="/createpost" element={state.user? <CreatePost /> :  <Signin/>} /> */}
//     </Routes>
// )
// };



function App() {
  // const [state, dispatch] = useReducer(reducer, initialState);

  return (
    // <UserContext.Provider>
      <BrowserRouter>
        <NavBar />
        <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={ <Profile />} />
      <Route path="/polls" element={ <Polls />} />
      <Route path="/events" element={ <EventCalendar isAdmin={true} />} />
      <Route path="/explore" element={ <Explore/>} />
      <Route path="/notices" element={ <Notice/>} />
    </Routes>
      </BrowserRouter>
    // </UserContext.Provider>
  );
}

export default App;