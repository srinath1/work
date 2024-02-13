import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, notification } from "antd";
import { GetLoggedInUser } from "../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications, setUser } from "../redux/usersSlice";
import { setLoading } from "../redux/loadersSlice";
import { GetAllNotifications } from "../apicalls/notifications";
import { Avatar, Badge, Space } from "antd";
import Notifications from "./Notifications";

const ProtectedPage = ({ children }) => {
  const[showNotifications,setShowNotifications]=useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user,notifications } = useSelector((state) => {
    return state.users;
  });
  const getUser = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetLoggedInUser();
      dispatch(setLoading(false));
      if (response.success) {
        dispatch(setUser(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      localStorage.removeItem("token");
      dispatch(setLoading(false));
      navigate("/login");
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUser();
    } else {
      navigate("/login");
    }
  }, []);

  const getNotifications = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetAllNotifications();
      console.log("Resp Notif", response);
      dispatch(setLoading(false));
      if (response.success) {
        dispatch(setNotifications(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };
  useEffect(()=>{
   
    getNotifications()
   

  },[])
  return (
    user && (
      <div>
        <div className="flex justify-between items-center bg-primary text-white p-3">
          <h1
            className="text-2xl cursor-pointer "
            onClick={() => navigate("/")}
          >
            JUC TASK TRACKER
          </h1>
          <div className="flex items-center bg-white px-5 py-2 rounded cursor-pointer">
            <span
              className=" text-primary underline mr-2"
              onClick={() => navigate("/profile")}
            >
              {user?.firstName}
            </span>
            <Badge count={notifications.filter(notification=>!notification.read).length} showZero>
              <Avatar
                shape="square"
                size={"large"}
                icon={
                  <i className="ri-notification-line text-white  rounded-full cursor-pointer"></i>

                }
                onClick={()=>setShowNotifications(true)}
              />
            </Badge>
            <i
              className="ri-logout-box-r-line ml-10 text-primary pointer"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            ></i>
          </div>
        </div>
        <div className="px-5 py-3">{children}</div>{" "}
        {showNotifications && (
          <Notifications
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          
          />
        )}
      </div>
    )
  );
};

export default ProtectedPage;
