import { useContext, useState } from "react";
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
  const { user, setUser } = useContext(UserContext);

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

  const handleAuthSubmit = (e) => {
    e.preventDefault();

    if (authSidebar === "login") {
      console.log("Login submitted:", {
        name: authForm.name,
        password: authForm.password,
      });
      // Hardcode login success for now
      setUser({ name: authForm.name, email: authForm.email });
    } else if (authSidebar === "signup") {
      console.log("Signup submitted:", authForm);
      setUser({ name: authForm.name, email: authForm.email });
    }

    setAuthSidebar(null);
    setAuthForm({ name: "", email: "", password: "", confirmPassword: "" });
  };

  const handleInputChange = (e) => {
    setAuthForm({
      ...authForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-light text-gray-800">QuickTools</h1>
            <h3>{user ? user.name : "Guest"} 👋</h3>

            <div className="flex items-center space-x-4">
              <nav className="flex space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => dispatch({ type: item.action })}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center
                      ${
                        state.currentView === item.name
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
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
                      className="py-2 px-4 rounded-md text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setAuthSidebar("signup")}
                      className="py-2 px-4 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200"
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
        </div>
      </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-grow">
          <div className="bg-white rounded-none shadow-sm border-b border-gray-100 p-6 min-h-[calc(100vh-8rem)]">
            {renderContent()}
          </div>
        </main>

        {/* Auth Sidebar */}
        {authSidebar && (
          <div className="w-96 bg-white border-l border-gray-200 shadow-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-800">
                  {authSidebar === "login" ? "Login" : "Create Account"}
                </h2>
                <button
                  onClick={() => setAuthSidebar(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
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
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                      required={authSidebar === "signup"}
                    />
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                    required
                  />
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                    required
                  />
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
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                      required={authSidebar === "signup"}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white font-medium py-3 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                >
                  {authSidebar === "login" ? "Sign In" : "Create Account"}
                </button>

                {authSidebar === "login" ? (
                  <p className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthSidebar("signup")}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthSidebar("login")}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-4 border-t border-gray-200 bg-white">
        <div className="px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-500">
            Simple tools for your daily needs
          </p>
        </div>
      </footer>
    </div>
  );
}
