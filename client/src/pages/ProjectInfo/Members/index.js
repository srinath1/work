import React, { useState } from "react";
import { Button, Table, message } from "antd";
import MemberForm from "./MemberForm";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/loadersSlice";
import { RemoveMemberToproject } from "../../../apicalls/projects";

const Members = ({ project, reloadData }) => {
  const[role,setRole]=useState('')
  const [showMemberForm, setShowMemberForm] = useState(false);
  const { user } = useSelector((state) => state.users);
  const  dispatch  = useDispatch();
  const isOwner = project.owner._id === user._id;
  console.log("Project.Owner", project);
  const deleteMember = async (memberId) => {
    try {
      dispatch(setLoading(true));
      const response = await RemoveMemberToproject({
        projectId: project._id,
        memberId,
      });
      if (response.success) {
        reloadData();
        message.success(response.message);
      } else {
        throw new Error(response.messge);
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };
  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      render: (text, record) => record.user.firstName,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      render: (text, record) => record.user.lastName,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => record.user.email,
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (text, record) => record.role.toUpperCase(),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        console.log("Record delete", record);
        return (
          isOwner && (
            <Button
              type="link"
              danger
              onClick={() => deleteMember(record._id)}
            >
              Remove
            </Button>
          )
        );
      },
    },
  ];
  if(!isOwner){
    columns.pop()
  }
  return (
    <div>
      <div className="flex justify-end">
        {isOwner && (
          <Button type="default" onClick={() => setShowMemberForm(true)}>
            ADD MEMBER
          </Button>
        )}
      </div>
      <div className="w-48">
        <span>Select Role</span>
        <select onChange={e=>setRole(e.target.value)} value={role}>
          <option value="">All</option>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>
      </div>
      <Table columns={columns} dataSource={project.members.filter(member=>{
        if(role===""){
          return project.members
        }else{
          return member.role===role
        }
      })} className="mt-4" />
      {showMemberForm && (
        <MemberForm
          showMemberForm={showMemberForm}
          setShowMemberForm={setShowMemberForm}
          reloadData={reloadData}
          project={project}
        />
      )}
    </div>
  );
};

export default Members;
