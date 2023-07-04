import { useEffect } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import LockedScreen from "./Pages/LockedScreen";
import Messenger from "./Pages/Messenger";
import SearchPapers from "./Pages/SearchPapers";
import Home from "./Pages/Home";
import Notification from "./Pages/Notification";
import SearchFriends from "./components/SearchFriends";
import PostsComponet from "./components/PostsComponet";
import Profile from "./components/Profile";
import ChatMemberMsgs from "./components/ChatMemberMsgs";
import Authorized from "./components/Authorised";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LockedScreen />} />
          <Route path="/messenger" element={<Messenger />}>
            <Route path=":friendId" element={<ChatMemberMsgs />} />
          </Route>
          <Route
            path="/find-friends"
            element={
              <Authorized>
                <SearchFriends />
              </Authorized>
            }
          />

          <Route
            path="/searchpapers/:category?/:paperId?"
            element={<SearchPapers />}
            exact
          />
          <Route path="/home" element={<Home />} exact />
          <Route path="/notifications" element={<Notification />} exact />
          <Route
            path="profile/:profileId"
            element={
              <Authorized>
                <Profile />
              </Authorized>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
