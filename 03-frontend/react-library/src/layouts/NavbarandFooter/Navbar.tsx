import { Link, NavLink } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";

export const Navbar = () => {
  const { oktaAuth, authState } = useOktaAuth();

  if (!authState) {
    <SpinnerLoading />;
  }

  console.log(authState);
  const handleLogout = async () => oktaAuth.signOut();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark main-color py-3">
      <div className="container-fluid">
        <span className="navbar-brand">Library</span>
        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="true"
          aria-label="Toggle Navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to="/home" className="nav-link">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/search" className="nav-link">
                Search Books
              </NavLink>
            </li>
            {authState && authState.isAuthenticated && (
              <li className="nav-item">
                <NavLink to={"/shelf"} className="nav-link">
                  Shelf
                </NavLink>
              </li>
            )}
            {authState && authState.isAuthenticated && (
              <li className="nav-item">
                <NavLink to={"/messages"} className="nav-link">
                  Library Services
                </NavLink>
              </li>
            )}

            {authState && authState.isAuthenticated && (
              <li className="nav-item">
                <NavLink to={"/fees"} className="nav-link">
                  Pay fees
                </NavLink>
              </li>
            )}

            {authState &&
              authState.isAuthenticated &&
              authState.accessToken?.claims.userType === "admin" && (
                <li className="nav-item">
                  <NavLink to={"/admin"} className="nav-link">
                    Admin
                  </NavLink>
                </li>
              )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {!authState?.isAuthenticated ? (
              <li className="nav-item">
                <Link
                  type="button"
                  className="btn btn-outline-light"
                  to="/login"
                >
                  Sign in
                </Link>
              </li>
            ) : (
              <li>
                <button
                  className="btn btn-outline-light"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
