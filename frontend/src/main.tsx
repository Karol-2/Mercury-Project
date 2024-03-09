import { AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import FriendsPage from "./pages/FriendsPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import MessagingPage from "./pages/MessagingPage.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";
import ProfilePage from "./pages/Profile.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import VideoCallPage from "./pages/VideoCallPage.tsx";

import "./styles/styles.scss";

import UserProvider from "./helpers/UserProvider.tsx";
import { store } from "./redux/store.ts";
import EditDataPage from "./pages/EditDataPage.tsx";

const body = document.getElementsByTagName("body")[0]!;
body.className = "bg-my-darker text-my-light";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AnimatePresence mode="wait">
      <UserProvider>
        <Router>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/edit" element={<EditDataPage />} />
            <Route path="/messages/:friendId" element={<MessagingPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/meeting" element={<VideoCallPage />} />
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </UserProvider>
    </AnimatePresence>
  </Provider>,
);
