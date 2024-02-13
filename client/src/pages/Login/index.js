import React, { useEffect } from "react";
import { Form, Input, Button, message, loading } from "antd";
import { Link } from "react-router-dom";
import Divider from "../../components/Divider";
import { LoginUser } from "../../apicalls/users";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setButtonLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";

const Login = () => {
  const navigate = useNavigate();
  const { buttonLoading } = useSelector((state) => state.loaders);
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(setButtonLoading(true));
      const response = await LoginUser(values);
      dispatch(setButtonLoading(false));
      if (response.success) {
        localStorage.setItem("token", response.data);
        message.success(response.message);
        window.location.href = "/";
      } else {
        throw new Error(response.message);
        dispatch(setButtonLoading(false));
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/";
    }
  }, []);
  return (
    <div className="grid grid-cols-2">
      <div className="bg-primary h-screen flex flex-col justify-center items-center">
        <div>
          <h1 className="text-7xl text-white">JUC Task Tracker</h1>
          <span className="text-white mt-5">One Place For All Your Tasks</span>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="w-[420px]">
        <div className="flex flex-col">
        <span className="text-green-700 ">
            (Use Email:owner@owner.com,Password:password to login as Owner to
            create Projects and allot Projects to admins & members)
          </span>
          <span className="text-blue-700  ">
            (Use Email:admin@admin.com,Password:password to login as admin to
            create tasks and allot tasks to members)
          </span>
        </div>

          <h1 className="text-2xl text-gray-700 mt-4">
            Login In To Your Account
          </h1>
          <Divider />
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={getAntdFormInputRules()}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={getAntdFormInputRules()}
            >
              <Input type="password" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={buttonLoading}
            >
              {buttonLoading ? "loading" : "Login"}
            </Button>
            <div className="flex justify-center mt-5">
              <span>
                Dont have an account?.<Link to="/register">Register</Link>
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
