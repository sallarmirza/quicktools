import { createContext, useReducer } from "react";

export const ServiceContext = createContext();

const initialState = {
  currentView: "Ask", // default view
};

const reducer = (state, action) => {
  switch (action.type) {
    case "OpenNote":
      return { ...state, currentView: "Notepad" };
    case "OpenCamera":
      return { ...state, currentView: "Camera" };
    case "OpenAsk":
      return { ...state, currentView: "Ask" };
    default:
      return state;
  }
};

export const ServiceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ServiceContext.Provider value={{ state, dispatch }}>
      {children}
    </ServiceContext.Provider>
  );
};
