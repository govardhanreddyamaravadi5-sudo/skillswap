import React from "react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

    useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("skillswapUser");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("skillswapUser");

    setUser(null);
    setOpen(false);

    navigate("/login");
  };

  const getInitial = () => {
    if (!user?.name) return "U";

    return user.name
      .charAt(0)
      .toUpperCase();
  };

  return (
    <header className="navbar">

      <div className="navbar-inner">

        {/* LOGO */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={() => setOpen(false)}
        >
          Skill<span>Swap</span>
        </Link>


        {/* RIGHT SIDE */}

        <div className="navbar-right">

          {user ? (

            <div
              className="user-menu"
              ref={dropdownRef}
            >

              {/* USER BUTTON */}

              <button
                type="button"
                className="user-menu-button"
                onClick={() =>
                  setOpen(!open)
                }
              >

                <div className="navbar-avatar">
                  {getInitial()}
                </div>

                <span className="navbar-user-name">
                  {user.name}
                </span>

                <span
                  className={
                    open
                      ? "dropdown-arrow open"
                      : "dropdown-arrow"
                  }
                >
                  ▾
                </span>

              </button>


              {/* DROPDOWN */}

              {open && (

                <div className="user-dropdown">

                  <div className="dropdown-user-info">

                    <div className="dropdown-avatar">
                      {getInitial()}
                    </div>

                    <div>

                      <strong>
                        {user.name}
                      </strong>

                      <span>
                        {user.email}
                      </span>

                    </div>

                  </div>


                  <div className="dropdown-divider" />


                  <Link
                    to="/dashboard"
                    className="dropdown-item"
                    onClick={() =>
                      setOpen(false)
                    }
                  >
                    <span>▦</span>
                    Dashboard
                  </Link>


                  <Link
                    to="/find-skills"
                    className="dropdown-item"
                    onClick={() =>
                      setOpen(false)
                    }
                  >
                    <span>⌕</span>
                    Find Skills
                  </Link>


                  <Link
                    to="/my-skills"
                    className="dropdown-item"
                    onClick={() =>
                      setOpen(false)
                    }
                  >
                    <span>✦</span>
                    My Skills
                  </Link>


                  <Link
                    to="/requests"
                    className="dropdown-item"
                    onClick={() =>
                      setOpen(false)
                    }
                  >
                    <span>↔</span>
                    Requests
                  </Link>

                  <Link
                    to="/sessions"
                    className="dropdown-item"
                    onClick={() => setOpen(false)}
                  >
                    <span>◷</span>
                    My Sessions
                  </Link>

                  <Link
                    to="/messages"
                    className="dropdown-item"
                    onClick={() => setOpen(false)}
                  >
                    <span>💬</span>
                    Messages
                  </Link>

                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() =>
                      setOpen(false)
                    }
                  >
                    <span>○</span>
                    Profile
                  </Link>


                  <div className="dropdown-divider" />


                  <button
                    type="button"
                    className="dropdown-logout"
                    onClick={logout}
                  >
                    <span>↪</span>
                    Logout
                  </button>

                </div>

              )}

            </div>

          ) : (

            <div className="navbar-auth">

              <Link
                to="/login"
                className="navbar-login"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="navbar-signup"
              >
                Get started
              </Link>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}

export default Navbar;