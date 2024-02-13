import { Modal, message } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../redux/loadersSlice";
import { MarkNotificationAsRead,DeleteAllNotifications } from "../apicalls/notifications";
import { setNotifications } from "../redux/usersSlice";

const Notifications = ({ showNotifications, setShowNotifications }) => {
  const { notifications } = useSelector((state) => state.users);
  console.log("Notifications", notifications);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const readNotifications = async () => {
    try {
      const response = await MarkNotificationAsRead();
      console.log("responot", response);
      if (response.success) {
        dispatch(setNotifications(response.data));
      }
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };
  useEffect(() => {
    if (notifications.length > 0) {
      readNotifications();
    }
  }, []);

  const deleteAllNotifications = async () => {
    try {
      dispatch(setLoading(true));
      const response = await DeleteAllNotifications();
      dispatch(setLoading(false));
      if (response.success) {
        dispatch(setNotifications([]));
      } else {
        dispatch(setLoading(false));
        message.error(response.error);
      }
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  return (
    <Modal
      title="Notification"
      open={showNotifications}
      onCancel={() => setShowNotifications(false)}
      centered
      footer={null}
      width={1000}
    >
      <div className="flex flex-col gap-5 mt-5">
        {notifications.length > 0 ? (
          <div className="flex justify-end">
            <span
              className="text-2xl underline cursor-pointer"
              onClick={() => deleteAllNotifications()}
            >
              Delete All
            </span>
          </div>
        ):(
          <div className="flex justify-end">
            <span className="text-2xl">No Notifications </span>
          </div>
        )}
        {notifications.map((notification) => {
          return (
            <div className="flex justify-between items-end border border-solid p-2 rounded cursor-pointer">
              <div
                onClick={() => {
                  setShowNotifications(false);
                  navigate(notification.onClick);
                }}
              >
                <p className="text-lg font-semibold text-md text-blue-700">
                  {notification.title}
                </p>
                <p className="text-sm">{notification.description}</p>
              </div>
              <div>
                <p className="text-sm">
                  {moment(notification.createdAt).fromNow()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default Notifications;
