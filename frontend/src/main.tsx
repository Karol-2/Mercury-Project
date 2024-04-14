import { AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import FriendsPage from "./pages/FriendsPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import MessagingPage from "./pages/MessagingPage.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import VideoCallPage from "./pages/VideoCallPage.tsx";
import NotificationPage from "./pages/NotificationPage.tsx";

import "./styles/styles.scss";

import { store } from "./redux/store.ts";
import MeetingProvider from "./helpers/MeetingProvider.tsx";
import Protected from "./helpers/Protected.tsx";
import KeycloakUserProvider from "./helpers/KeycloakUserProvider.tsx";
import EditDataPage from "./pages/EditDataPage.tsx";

const body = document.getElementsByTagName("body")[0]!;
body.className = "bg-my-darker text-my-light";

const protectedRoutes = [
  { path: "/profile", element: <ProfilePage /> },
  { path: "/edit", element: <EditDataPage /> },
  { path: "/messages/:friendId", element: <MessagingPage /> },
  { path: "/friends", element: <FriendsPage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/meeting", element: <VideoCallPage /> },
  { path: "/notification", element: <NotificationPage /> }
];

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AnimatePresence mode="wait">
      <Router>
        <KeycloakUserProvider>
          <MeetingProvider>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {protectedRoutes.map((props, i) => (
                <Route
                  key={i}
                  path={props.path}
                  element={<Protected>{props.element}</Protected>}
                />
              ))}
              <Route path="/*" element={<PageNotFound />} />
            </Routes>
          </MeetingProvider>
        </KeycloakUserProvider>
      </Router>
    </AnimatePresence>
  </Provider>,
);
