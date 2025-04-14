import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import NavBar from "@/components/Navbar";
import Home from "@/components/Home";
import Profile from "@/components/Profile";
import Signin from "@/components/Signin";
import Signup from "@/components/Signup";
import Polls from "@/components/Polls";
import EventCalendar from "@/components/EventCalendar";
import Explore from "@/components/Explore";
import Notice from "@/components/Notice";
import MediaGallery from "@/components/MediaGallery";
import AdminUpload from "./components/AdminUpload";
import AdminComplaint from "./components/AdminComplaint";
import ComplaintFile from "./components/ComplaintFile";
import Contact from "./components/Contact";
import ForgotPassword from "./components/screens/ForgotPassword";

// import OtpRequest from "./components/screens/otpRequest";
// import OtpVerify from "./components/screens/otpVerify";
// import ResetPassword from "./components/screens/ResetPassword";
// import VisitorForm from "./components/visitor/VisitorForm";
// import VisitorList from "./components/visitor/VisitorList";
// import VisitorCard from "./components/visitor/VisitorCard";
import MaintenanceForm from "./components/payments/MaintenanceForm";
import MaintenanceDashboard from "./components/payments/MaintenanceDashboard";
// import UserDetails from "@/components/utils/UserDetails";

function App() {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    return (
        <BrowserRouter>
            <NavBar user={user} setUser={setUser} />
            <Routes>
                {/* Public Routes - Only accessible before login */}
                <Route path="/signin" element={!user ? <Signin setUser={setUser} /> : <Navigate to="/home" />} />
                <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/home" />} />

                {/* Private Routes - Accessible after login */}
                <Route path="/home" element={user ? <Home /> : <Navigate to="/signin" />} />
                <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/signin" />} />
                <Route path="/polls" element={user ? <Polls user={user} /> : <Navigate to="/signin" />} />
                <Route path="/explore" element={user ? <Explore /> : <Navigate to="/signin" />} />
                <Route path="/events" element={user ? <EventCalendar user={user} /> : <Navigate to="/signin" />} />
                <Route path="/notices" element={user ? <Notice user={user} /> : <Navigate to="/signin" />} />
                <Route path="/mediagallery" element={user ? <MediaGallery user={user} /> : <Navigate to="/signin" />} />
                <Route path="/adminupload" element={user ? <AdminUpload user={user} /> : <Navigate to="/signin" />} />
                <Route path="/admincomplaints" element={user ? <AdminComplaint user={user} /> : <Navigate to="/signin" />} />
                <Route path="/filecomplaint" element={user ? <ComplaintFile user={user} /> : <Navigate to="/signin" />} />
                <Route path="/contacts" element={user ? <Contact user={user} /> : <Navigate to="/signin" />} />
                {/* <Route path="/visitorform" element={user ? <VisitorForm user={user} societyId={user.societyId} /> : <Navigate to="/signin" />} />
                <Route path="/visitorcard" element={user ? <VisitorCard user={user} societyId={user.societyId} /> : <Navigate to="/signin" />} />
                <Route path="/visitorlist" element={user ? <VisitorList user={user}  societyId={user.societyId}/> : <Navigate to="/signin" />} />
                
                 */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/maintenanceform" element={user ? <MaintenanceForm user={user} /> : <Navigate to="/signin" />} />
                <Route path="/maintenancedashboard" element={user ? <MaintenanceDashboard user={user} /> : <Navigate to="/signin" />} />
                    {/* <Route path = "/userdetails" element = {<UserDetails/>}/> */}

                    {/* <Route path="/otp-request" element={<OtpRequest type="login" />} />
<Route path="/forgot-password" element={<OtpRequest type="fp" />} />
<Route path="/verify-otp" element={<OtpVerify />} />
<Route path="/reset-password" element={<ResetPassword />} /> */}
                {/* Catch-All Redirect */}
                <Route path="*" element={<Navigate to={user ? "/home" : "/signin"} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
