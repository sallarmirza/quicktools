import { useContext, useState, useEffect } from "react";
import { Notepad } from "../components/Notepad";
import { Camera } from "../components/Camera";
import { Ask } from "../components/Ask";
import { ServiceContext } from "../context/ServiceContext";
import { UserContext } from "../context/UserContext";
import { DropDown } from "../components/DropDown";

export function Home() {
  const { state, dispatch } = useContext(ServiceContext);
  const [authSidebar, setAuthSidebar] = useState(null);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useContext(UserContext);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const navItems = [
    { name: "Notepad", action: "OpenNote", icon: "📝" },
    { name: "Camera", action: "OpenCamera", icon: "📷" },
    { name: "Ask", action: "OpenAsk", icon: "❓" },
  ];

  const renderContent = () => {
    switch (state.currentView) {
      case "Notepad":
        return <Notepad />;
      case "Camera":
        return <Camera />;
      case "Ask":
        return <Ask />;
      default:
        return <Notepad />;
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!authForm.name.trim()) {
      errors.name = "Username is required";
    }
    
    if (authSidebar === "signup") {
      if (!authForm.email.trim()) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(authForm.email)) {
        errors.email = "Email is invalid";
      }
    }
    
    if (!authForm.password) {
      errors.password = "Password is required";
    } else if (authForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    if (authSidebar === "signup" && authForm.password !== authForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    return errors;
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsLoading(true);
    setFormErrors({});
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (authSidebar === "login") {
        console.log("Login submitted:", {
          name: authForm.name,
          password: authForm.password,
        });
        setUser({ name: authForm.name, email: authForm.email });
      } else if (authSidebar === "signup") {
        console.log("Signup submitted:", authForm);
        setUser({ name: authForm.name, email: authForm.email });
      }
      
      setAuthSidebar(null);
      setAuthForm({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (error) {
      console.error("Auth error:", error);
      setFormErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuthForm({
      ...authForm,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const handleAuthSidebarClose = () => {
    setAuthSidebar(null);
    setAuthForm({ name: "", email: "", password: "", confirmPassword: "" });
    setFormErrors({});
  };

  // Close auth sidebar when user logs in
  useEffect(() => {
    if (user) {
      setAuthSidebar(null);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">QuickTools</h1>
              <div className="ml-4 flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">
                    {user ? user.name.charAt(0).toUpperCase() : "G"}
                  </span>
                </div>
                <span className="ml-2 text-gray-700">
                  {user ? user.name : "Guest"} 👋
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => dispatch({ type: item.action })}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center
                      ${
                        state.currentView === item.name
                          ? "bg-blue-100 text-blue-700 shadow-sm"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      }`}
                  >
                    <span className="mr-1.5 text-base">{item.icon}</span>
                    {item.name}
                  </button>
                ))}
              </nav>

              <div className="flex space-x-2">
                {!user ? (
                  <>
                    <button
                      onClick={() => setAuthSidebar("login")}
                      className="py-2 px-4 rounded-md text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 border border-blue-100"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setAuthSidebar("signup")}
                      className="py-2 px-4 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <DropDown onLogout={() => setUser(null)} />
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden pb-3 flex justify-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => dispatch({ type: item.action })}
                className={`py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center
                  ${
                    state.currentView === item.name
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="sr-only">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-grow">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 m-4 p-4 md:p-6 min-h-[calc(100vh-10rem)]">
            {renderContent()}
          </div>
        </main>

        {/* Auth Sidebar */}
        {authSidebar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="w-full max-w-md bg-white shadow-xl overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {authSidebar === "login" ? "Welcome Back" : "Create Account"}
                  </h2>
                  <button
                    onClick={handleAuthSidebarClose}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {formErrors.submit && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                      {formErrors.submit}
                    </div>
                  )}

                  {authSidebar === "signup" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={authForm.email}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        required={authSidebar === "signup"}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={authForm.name}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={authForm.password}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                    )}
                  </div>

                  {authSidebar === "signup" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={authForm.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                        }`}
                        required={authSidebar === "signup"}
                      />
                      {formErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      authSidebar === "login" ? "Sign In" : "Create Account"
                    )}
                  </button>

                  <div className="text-center text-sm text-gray-600 pt-2">
                    {authSidebar === "login" ? (
                      <>
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setAuthSidebar("signup")}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setAuthSidebar("login")}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recording Button - Fixed position */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={toggleRecording}
          className={`relative inline-flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ease-in-out
            ${isRecording
              ? 'bg-red-500 hover:bg-red-600 ring-4 ring-red-300 animate-pulse'
              : 'bg-blue-600 hover:bg-blue-700'
            }
          `}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          <svg
            className={`w-6 h-6 transition-colors duration-300 ease-in-out text-white`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 14.5a7 7 0 01-7-7v-3a7 7 0 0114 0v3a7 7 0 01-7 7zM10 16a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>

          {isRecording && (
            <span className="absolute -bottom-7 text-xs font-medium text-gray-700 bg-white/90 px-2 py-1 rounded-full shadow-sm">
              Recording...
            </span>
          )}
        </button>
      </div>

      {/* Footer */}
      <footer className="py-4 border-t border-gray-200 bg-white mt-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Simple tools for your daily needs • v1.0
          </p>
        </div>
      </footer>
    </div>
  );
}