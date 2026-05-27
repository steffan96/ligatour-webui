import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AuthCallback from "../components/auth/AuthCallback";
import ForgotPasswordComponent from "../components/auth/ForgotPassword";
import LoginComponent from "../components/auth/Login";
import ProfileComponent from "../components/auth/Profile";
import RegisterComponent from "../components/auth/Register";
import ResetPasswordComponent from "../components/auth/ResetPassword";
import DashboardComponent from "../components/competitions/Dashboard";
import PublicKnockout from "../components/competitions/PublicKnockout";
import PublicRoundRobin from "../components/competitions/PublicRoundRobin";
import SingleCompetition from "../components/competitions/SingleCompetition";
import PublicLayout from "../components/home/PublicLayout";
import RootLayout from "../components/home/RootLayout";
// import { ProtectedRoute } from '../components/ProtectedRoute'

export const router = createBrowserRouter([
	{
		path: "/public",
		element: <PublicLayout />,
		children: [
			{
				path: "round_robin/:slug",
				element: <PublicRoundRobin />,
			},
			{
				path: "knockout/:slug",
				element: <PublicKnockout />,
			},
		],
	},
	{
		path: "/auth/callback",
		element: <AuthCallback />,
	},
	{
		path: "/",
		element: <RootLayout />,
		children: [
			// — Public auth routes —
			{
				path: "/register",
				element: <RegisterComponent />,
			},
			{
				path: "/login",
				element: <LoginComponent />,
			},
			{
				path: "/reset-password/:token",
				element: <ResetPasswordComponent />,
			},
			{
				path: "/forgot-password",
				element: <ForgotPasswordComponent />,
			},
			// — Protected routes —
			// {
			//   path: '/',
			//   index: true,
			//   element: <ProtectedRoute><DashboardComponent /></ProtectedRoute>,
			// },
			{
				path: "/",
				index: true,
				element: <DashboardComponent />,
			},
			{
				path: "/competitions",
				element: <DashboardComponent />,
			},
			{
				path: "/competition/:id",
				element: <SingleCompetition />,
			},
			{
				path: "/profile",
				element: <ProfileComponent />,
			},
		],
	},
]);
