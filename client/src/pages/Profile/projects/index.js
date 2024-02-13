import React, { useState } from "react";
import { Button, Table,message } from "antd";
import ProjectForm from "./ProjectForm";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/loadersSlice";
import { DeleteProject, getAllProjects } from "../../../apicalls/projects";
import { getDateFormat } from "../../../utils/helpers";

const Index = () => {
  const [show, setShow] = useState(false);
  const [projects, setProjects] = useState([]);
  const[selectedProject,setSelectedProject]=useState(null)
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllProjects({ owner: user._id });
      if (response.success) {
        setProjects(response.data);
      } else {
        throw new Error(response.error);
      }
      dispatch(setLoading(false))

    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message)
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    { title: "Description", dataIndex: "description" },
    { title: "status", dataIndex: "status" ,render:(text)=>{
    return  text.toUpperCase()
    }},
    { title: "created At", dataIndex: "createdAt",render:(text)=>getDateFormat(text) },
    {title:'Action',dataIndex:'action',render:(text,record)=>{
      return(
        <div className="flex gap-4">
<i className="ri-delete-bin-line cursor-pointer" onClick={()=>onDelete(record._id)}></i>
<i className="ri-pencil-line cursor-pointer" onClick={()=>{
  setSelectedProject(record)
  setShow(true)
}}></i>
        </div>
      )
    }}
  ];
  React.useEffect(()=>{
    getData()

  },[])
  const onDelete=async(id)=>{
    try {
      dispatch(setLoading(true))
      const response=await DeleteProject(id)
      if(response.success){
        message.success(response.message)
        getData()
      }else{
        throw new Error(response.error)
      }
      dispatch(setLoading(false))
      
    } catch (error) {
      message.error(error.message)
      dispatch(setLoading(false))
      
    }
  }
  return (
    <div>
      <div className="flex justify-end my-2">
        <Button type="primary" onClick={() => {
          setShow(true)
          setSelectedProject(null)
        }}>
          Add Project
        </Button>
      </div>
{projects && (      <Table columns={columns} dataSource={projects} />)} 
     {show && (
        <ProjectForm show={show} setShow={setShow} reloadData={getData} project={selectedProject} />
      )}
    </div>
  );
};

export default Index;
