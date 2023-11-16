import ReactDOM from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AdminPage from "./pages/AdminPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import MessagingPage from "./pages/MessagingPage.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";

import { AnimatePresence } from "framer-motion";
import "./styles/styles.scss";

const body = document.getElementsByTagName("body")[0]!;
body.className = "bg-my-darker text-my-light";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<AnimatePresence mode="wait">
		<Router>
			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/profile" element={<ProfilePage />} />
				<Route path="/admin" element={<AdminPage />} />
				<Route path="/messages" element={<MessagingPage />} />
				<Route path="/search" element={<SearchPage />} />
				<Route path="/*" element={<PageNotFound />} />
			</Routes>
		</Router>
	</AnimatePresence>,
);
