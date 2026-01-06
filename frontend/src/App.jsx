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

      </Routes>
      {/* Global Footer */}
      <Footer />
    </>
  );
};

export default App;











