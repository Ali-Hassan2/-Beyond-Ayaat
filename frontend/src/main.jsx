import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import { UserContext, UserProvider } from "./Context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
    <GoogleOAuthProvider clientId="441532330663-qe2s7nela9f44mfbka1oal43n8knhnpm.apps.googleusercontent.com">
      {" "}
     
      <App />
    
    </GoogleOAuthProvider>
    </UserProvider>
  </StrictMode>
);
