import "./index.css";
import {BrowserRouter,Route,Routes} from "react-router"
import Landing from "./screens/Landing";
import Singup from "./screens/Singup";
import SignIn from "./screens/SignIn";
import VideotPage from "./screens/VideotPage";
import Uploads from "./screens/Uploads";
import Appbar from "./component/Appbar";
import Channels from "./screens/Channels";

export function App() {
  return (
      <>
    <BrowserRouter>
      <Appbar/>
    <Routes>
        <Route path="/watch" element={<VideotPage />}></Route>
        <Route path="/singup" element={<Singup/>}></Route>
        <Route path="/signin" element={<SignIn/>}></Route>
        <Route path="/uploads" element={<Uploads/>}></Route>
        <Route path="/channels/:username" element={<Channels/>}></Route>
        <Route path="/" element={<Landing/>}></Route>
    </Routes>
    </BrowserRouter>
      </>
   
  );
}

export default App;
