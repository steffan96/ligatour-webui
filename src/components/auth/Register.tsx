import type React from "react";
import { useState } from "react";
import { registerUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useToastStore } from "../../api/stores/useToastStore";

const RegisterComponent = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { showToast } = useToastStore();

	const validateEmail = (email: string) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	};

	const validatePassword = (password: string) =>
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateEmail(email)) {
			showToast("Invalid email format.", false);
			return;
		}

		if (!validatePassword(password)) {
			showToast(
				"Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
				false,
			);
			return;
		}

		if (password !== confirmPassword) {
			showToast("Passwords do not match.", false);
			return;
		}

		setIsLoading(true);
		try {
			await registerUser(email, password, confirmPassword);
			navigate("/login");
			showToast("Registration successful!", true);
		} catch (err: any) {
			// err will be the message string from the response
			showToast(err || "Registration failed.", false);
		} finally {
			setIsLoading(false);
		}
	};

	const inputClass =
		"w-full px-12 py-2 rounded-md border border-gray-300 " +
		"focus:border-green-900 focus:ring-2 focus:ring-green-200 focus:outline-none" +
		" text-gray-800 bg-white shadow-sm transition duration-150";
	const buttonClass =
		"w-full py-2 rounded-md bg-green-900 hover:bg-green-900 " +
		"text-white font-semibold transition duration-150 flex items-center justify-center";

	return (
		<div className="flex flex-col items-center w-full p-8">
			<div className="w-[95%] ml-auto">
				<h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
					Create an Account
				</h1>
				<p className="text-gray-600 mb-6 text-center">
					Join us today and start competing!
				</p>
			</div>
			<div className="flex flex-col items-center w-[95%] ml-auto p-8 rounded-lg shadow-md">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<input
							type="email"
							className={inputClass}
							placeholder="Email"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							required
						/>
					</div>
					<div>
						<input
							type="password"
							className={inputClass}
							placeholder="Password"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
							required
						/>
					</div>
					<div>
						<input
							type="password"
							className={inputClass}
							placeholder="Confirm Password"
							value={confirmPassword}
							onChange={(e) => {
								setConfirmPassword(e.target.value);
							}}
							required
						/>
					</div>
					<button type="submit" className={buttonClass} disabled={isLoading}>
						{isLoading && (
							<svg
								className="animate-spin h-5 w-5 mr-2 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v8z"
								></path>
							</svg>
						)}
						{isLoading ? "Registering..." : "Register"}
					</button>
				</form>
				<p className="text-gray-600 mt-6 text-center">
					Already have an account?{" "}
					<Link
						to="/login"
						className="text-green-900 hover:underline font-medium"
					>
						Login here
					</Link>
				</p>
			</div>
		</div>
	);
};

export default RegisterComponent;
