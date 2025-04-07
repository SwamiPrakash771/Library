import React from "react";
import { Navbar } from "./layouts/NavbarandFooter/Navbar";
import "./App.css";

import { Footer } from "./layouts/NavbarandFooter/Footer";
import { HomePage } from "./layouts/HomePage/HomePage";
import { SearchBooksPage } from "./layouts/SearchBooksPage/SearchBooksPage";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { BookCheckoutPage } from "./layouts/BookCheckoutPage/BookCheckoutPage";
import { oktaConfig } from "./lib/oktaConfig";
import { OktaAuth } from "@okta/okta-auth-js";
import { Security, LoginCallback, SecureRoute } from "@okta/okta-react";
import LoginWidget from "./Auth/LoginWidget";
import { ReviewListPage } from "./layouts/BookCheckoutPage/ReviewListPage/ReviewListPage";
import { ShelfPage } from "./layouts/ShelfPage/ShelfPage";
import PrivateRoutes from "./PrivateRoutes";
import { MessagesPage } from "./layouts/MessagesPage/MessagesPage";
import { ManageLibraryPage } from "./layouts/ManageLibraryPage/ManageLibraryPage";
import { PaymentPage } from "./layouts/PaymentPage/PaymentPage";

const oktaAuth = new OktaAuth(oktaConfig);

export const App = () => {
  const customAuthHandler = () => {
    navigate("/login");
  };

  const navigate = useNavigate();

  const restoreOriginalUri = async (_oktaAuth: any, OriginalUri: any) => {
    navigate(OriginalUri || "/", { replace: true });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Security
        oktaAuth={oktaAuth}
        restoreOriginalUri={restoreOriginalUri}
        onAuthRequired={customAuthHandler}
      >
        <Navbar />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Navigate replace to={"/home"} />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/search" element={<SearchBooksPage />} />
            <Route path="/reviewlist/:bookId" element={<ReviewListPage />} />
            <Route path="/checkout/:bookId" element={<BookCheckoutPage />} />
            <Route
              path="/login"
              element={<LoginWidget config={oktaConfig} />}
            />
            <Route path="/login/callback" element={<LoginCallback />} />
            {/* Private Routes */}
            <Route element={<PrivateRoutes />}>
              <Route path="/shelf" element={<ShelfPage />} />
            </Route>
            <Route element={<PrivateRoutes />}>
              <Route path="/messages" element={<MessagesPage />} />
            </Route>

            <Route element={<PrivateRoutes />}>
              <Route path="/admin" element={<ManageLibraryPage />} />
            </Route>
            <Route element={<PrivateRoutes />}>
              <Route path="/fees" element={<PaymentPage />} />
            </Route>
          </Routes>
        </div>

        <Footer />
      </Security>
    </div>
  );
};

export default App;
