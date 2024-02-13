import React, { useRef } from "react";
import { Modal, Form, Input,message } from "antd";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/loadersSlice";
import { AddMemberToproject } from "../../../apicalls/projects";
import {getAntdFormInputRules} from '../../../utils/helpers'
const MemberForm = ({
  showMemberForm,
  setShowMemberForm,
  reloadData,
  project,
}) => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const onFinish = async(values) => {
    try {
      const emailExists = project.members.find(
        (member) => member.user.email === values.email
      );
      if(emailExists){
        throw new Error('User is already member of the project')
      }else{
        dispatch(setLoading(true));

        const response=await AddMemberToproject({
            projectId:project._id,
            email:values.email,
            role:values.role
        })
        dispatch(setLoading(false))

        if(response.success){
            message.success(response.message)
            reloadData()
                setShowMemberForm(false)
        }else{
            message.error(response.message)
          }
      }
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };
  return (
    <Modal
      title="Add Member"
      open={showMemberForm}
      onCancel={() => setShowMemberForm(false)}
      centered
      okText="Add"
      onOk={() => {
        formRef.current.submit();
      }}
    >
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        <Form.Item label="Email" name="email"   rules={getAntdFormInputRules()}>
          <input placeholder="Email" />
        </Form.Item>
        <Form.Item label="Role" name="role"  rules={getAntdFormInputRules()}>
          <select>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MemberForm;
