import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './component/pages/Navbar';
import EventsPage from './component/pages/Eventsupcommingpages';
import SportEventDetailsPage from './component/Orginizer/SoprtsById';
import Footer from './component/Footer';
import HomePage from './component/Home';
import TeamPage from './component/Team';
import PastEventPage from './component/pages/PastEvent';
import RegistrationPaymentPage from './component/Orginizer/RegistrationPaymentPage';
import RegisterPage from './Context/RegisterStudentpgae';
import LoginPage from './Context/LoginPageStudent';
import CreateHackathon from './component/Orginizer/CreateHackathonform';
import CreateSeminar from './component/Orginizer/Seminarform';
import CreateSportsEvent from './component/Orginizer/SportsAddForm';
import PaymentHistory from './component/Orginizer/PaymentHistory';
import Mission from './component/pages/Mission';
import AboutHistory from './component/pages/AboutHistory';
import EventGallery from './component/pages/Photos';
import EventManagementDashboard from './component/Role/Organizer';
import AdminRegisterpage from './Context/AdminRegisterpage';
import AdminRegister from './Context/AdminRegisterpage';
import AdminLoginPage from './Context/AdminLoginPage';
import { OrgainserLogin, OrgainserRegsiter } from './ApiInstance/Allapis';
import OrganiserRegister from './Context/OrgainserRegister';
import OraginserLoginPage from './Context/OrgainserLogin';
import Gallerymemories from './component/pages/Gallerymemories';
import Galleryvideos from './component/pages/Galleryvideos';
import Gold from './component/pages/Sponsors/Gold';
import Sliver from './component/pages/Sponsors/Sliver';
import Bronze from './component/pages/Sponsors/Bronze';
import Support from './component/pages/Contact/Support';
import FeedBack from './component/pages/Contact/FeedBack';
import Emergency from './component/pages/Contact/Emergency';


const App = () => {
  return (
    <>
      {/* Global Header */}
      <Navbar />

      {/* Page Content */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events/upcoming" element={<EventsPage />} />
        <Route path="/events/past" element={<PastEventPage />} />
        <Route path="/events/upcoming/event/:id" element={<SportEventDetailsPage />} />
        <Route path='/about/team' element={<TeamPage />} />
        <Route path='/register' element={<RegistrationPaymentPage />} />
        <Route path='/registerstudent' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path="/orgniser/createHackathone" element={<CreateHackathon />} />
        <Route path="/orgniser/seminar" element={<CreateSeminar />} />
        <Route path="/orgniser/sports" element={<CreateSportsEvent />} />
        <Route path="/orgniser/history" element={<PaymentHistory />} />
        <Route path="/about/mission" element={<Mission />} />
        <Route path="/OrgniserDashboard" element={<EventManagementDashboard />} />
        <Route path="/about/history" element={<AboutHistory />} />
        <Route path="/gallery/photos" element={<EventGallery />} />
        <Route path="/AdminRegsiterPage" element={<AdminRegister />} />
        <Route path="/AdminLoginPage" element={<AdminLoginPage />} />


        <Route path="/OrganiserRegsiterPage" element={<OrganiserRegister />} />
        <Route path="/OrgainserLoginPage" element={<OraginserLoginPage />} />

        {/* /gallery/memories */}

        <Route path="/gallery/memories" element={<Gallerymemories />} />

        <Route path='/gallery/videos' element={<Galleryvideos />} />
        <Route path='/sponsors/gold' element={<Gold />} />
        <Route path='/sponsors/silver' element={<Sliver />} />
        <Route path='/sponsors/bronze' element={<Bronze />} />
        <Route path='/contact/support' element={<Support />} />
        <Route path='/contact/feedback' element={<FeedBack />} />
        <Route path='/contact/emergency' element={<Emergency />} />
      </Routes>
      {/* Global Footer */}
      <Footer />
    </>
  );
};

export default App;











