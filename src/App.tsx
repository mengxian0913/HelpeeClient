import React, { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "./state/store";
import { setLoading1 } from "./state/loading/loading";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";

/** Normal  */
import Home from "./Normal/pages/Home/Home";
import Header from "./Normal/components/Header/Header";
import Market from "./Normal/pages/Market/Market";
import Donation from "./Normal/pages/Donation/Donation";
import Record from "./Normal/pages/Record/Record";
import Tracking from "./Normal/pages/Tracking/Tracking";
import Cart from "./Normal/pages/Cart/Cart";
import Profile from "./Normal/pages/Profile/Profile";

/** DisAdvantaged  */
import DisHome from "./Disadvantaged/pages/Home/Home";
import DisHeader from "./Disadvantaged/components/Header/Header";
import DisRecive from "./Disadvantaged/pages/Recive/Recive";
import DisRecord from "./Disadvantaged/pages/Record/Record";
import DisNotification from "./Disadvantaged/pages/Notification/Notification";

import { UserState, UserStateEnum } from "./utils/type";
import { apiCheckUserState } from "./API/auth";
import Loading1 from "./components/Loading1/Loading1";
import Register from "./pages/Register/Register";


const App: React.FC = () => {
  const getterState = useSelector((state: RootState) => state.getter);
  const modalState = useSelector((state: RootState) => state.modal);
  const loadingState = useSelector((state: RootState) => state.loading);
  const dispatch = useDispatch();

  const [userState, setUserState] = useState<UserState>(
    UserStateEnum.NONE
  );

  const handleCheckUserState = async () => {
    try {
      dispatch(setLoading1(true));
      const result = await apiCheckUserState();
      setUserState(result);
    } catch (err) {
      console.error("Error checking user state:", err);
    } finally {
      dispatch(setLoading1(false));
    }
  };

  useEffect(() => {
    handleCheckUserState();
    console.log("====================================");
    console.log("User State:", userState);
    console.log("====================================");
  }, [getterState.userState]);

  if (userState === UserStateEnum.NONE) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    );
  } else if (userState === UserStateEnum.NORMAL) {
    return (
      <BrowserRouter>
        {loadingState.isLoading1 && <Loading1 />}
        <Header />
        <Routes>
          <Route path="*" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<Market />} />
          <Route path="/donations" element={<Donation />} />
          <Route path="/orders" element={<Record />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    );
  } else {
    return (
      <BrowserRouter>
        {loadingState.isLoading1 && <Loading1 />}
        <DisHeader />\
        <Routes>
          <Route path="*" element={<DisHome />} />
          <Route path="/home" element={<DisHome />} />
          <Route path="/receive" element={<DisRecive />} />
          <Route path="/records" element={<DisRecord />} />
          <Route path="/notifications" element={<DisNotification />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    );
  }
};

export default App;
