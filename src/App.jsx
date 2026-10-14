import "./index.css";
import "./styles/Responsive.css";
import "./styles/General.css";
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FindSkills from "./pages/FindSkills";
import Dashboard from "./pages/Dashboard";
import MySkills from "./pages/MySkills";
import Requests from "./pages/Requests";
import Profile from "./pages/Profile";
import SkillDetails from "./pages/SkillDetails";
import Sessions from "./pages/Sessions";
import Messages from "./pages/Messages";
import ProtectedRoute from "./components/ProtectedRoute";


/* =========================================================
   APP
   ========================================================= */

function App() {

  return (

    <BrowserRouter>

      {/* NAVBAR */}

      <Navbar />


      <Routes>

        {/* =================================================
            PUBLIC ROUTES
            ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />


        <Route
          path="/login"
          element={<Login />}
        />


        <Route
          path="/register"
          element={<Register />}
        />


        {/* =================================================
            PROTECTED ROUTES
            ================================================= */}

        <Route
          element={<ProtectedRoute />}
        >

          {/* DASHBOARD */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          {/* FIND SKILLS */}

          <Route
            path="/find-skills"
            element={<FindSkills />}
          />


          {/* MY SKILLS */}

          <Route
            path="/my-skills"
            element={<MySkills />}
          />


          {/* REQUESTS */}

          <Route
            path="/requests"
            element={<Requests />}
          />

          <Route path="/sessions" element={<Sessions />} />
          
          <Route path="/messages" element={<Messages />} />
          {/* PROFILE */}

          <Route
            path="/profile"
            element={<Profile />}
          />


          {/* SKILL DETAILS */}

          <Route
            path="/skill/:id"
            element={<SkillDetails />}
          />

        </Route>

      </Routes>

    </BrowserRouter>

  );
}
export default App;