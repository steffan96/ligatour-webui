import React, { useState } from 'react';

const europeanCountries = [
  'Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia & Herzegovina',
  'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia',
  'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland',
  'Ireland {Republic}', 'Italy', 'Kosovo', 'Latvia', 'Liechtenstein',
  'Lithuania', 'Luxembourg', 'Macedonia', 'Malta', 'Moldova', 'Monaco',
  'Montenegro', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania',
  'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden',
  'Switzerland', 'Ukraine', 'United Kingdom', 'Vatican City',
];

const RegisterComponent = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [eloRating, setEloRating] = useState('');
  const [country, setCountry] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    if (!username) newErrors.username = 'Username is required.';
    if (!validateEmail(email)) newErrors.email = 'Invalid email address.';
    if (!validatePassword(password)) newErrors.password = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    if (!country) newErrors.country = 'Country is required.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(true);
      }, 1200);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-r from-blue-900 to-indigo-700 py-8">
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Create an Account</h1>
        <p className="text-gray-600 mb-6 text-center">Please fill in the details to register.</p>
        {success ? (
          <div className="text-green-600 text-center font-semibold">Registration successful!</div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-green-500 focus:outline-none text-gray-800"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>
          <div>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-green-500 focus:outline-none text-gray-800"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-green-500 focus:outline-none text-gray-800"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-green-500 focus:outline-none text-gray-800"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          <div>
            <input
              type="number"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-green-500 focus:outline-none text-gray-800"
              placeholder="Rating (optional)"
              value={eloRating}
              onChange={e => setEloRating(e.target.value)}
              min={0}
            />
          </div>
          <div>
            <select
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-green-500 focus:outline-none text-gray-800"
              value={country}
              onChange={e => setCountry(e.target.value)}
              required
            >
              <option value="">Select Country</option>
              {europeanCountries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold transition duration-150 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading && (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            )}
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        )}
        <p className="text-gray-600 mt-6 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-green-700 hover:underline font-medium">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterComponent;