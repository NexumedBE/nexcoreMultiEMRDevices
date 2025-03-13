import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LoggedIn from "./pages/LoggedIn";
import NotLoggedIn from "./pages/NotLoggedIn";
// import UpdateNotification from "./components/UpdateNotification";

function App() {
  return (
    <HashRouter>
      {/* <UpdateNotification /> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/loggedIn" element={<LoggedIn />} />
        <Route path="/notLoggedIn" element={<NotLoggedIn />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

