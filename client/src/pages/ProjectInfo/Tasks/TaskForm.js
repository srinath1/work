import React, { useRef, useState } from "react";
import { Modal, Form, Input, message ,Tabs,TabPane, Upload, Button} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/loadersSlice";
import { CreateTask, UpdateTask, UploadImage } from "../../../apicalls/tasks";
import { AddNotification } from "../../../apicalls/notifications";

const TaskForm = ({
  showTaskForm,
  setShowTaskForm,
  project,
  task,
  reloadData,
}) => {

  console.log('TaskImage',task)
  const [email, setEmail] = useState("");
  const[selectedTab,setSelectedTab]=useState("1")
  const { user } = useSelector((state) => state.users);
  const[file,setFile]=useState(null)
  const[images,setImages]=useState(task?.attachments || [])
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const onFinish = async (values) => {
    dispatch(setLoading(true));

    try {
      let response = null;
      const assignedToMember = project.members.find(
        (member) => member.user.email === email
      );
      const assignedToUserId = assignedToMember.user._id;
      if (task) {
        response = await UpdateTask({
          ...values,
          project: project._id,
          assignedTo: task.assignedTo._id,

          _id: task._id,
        });
      } else {
        const assignedBy = user._id;
        response = await CreateTask({
          ...values,
          project: project._id,
          assignedBy,
          assignedTo: assignedToUserId,
        });
      }
      if (response.success) {
        if (!task) {
          AddNotification({
            title: `You have been assigned a new task in ${project.name}`,
            user: assignedToUserId,
            onClick: `/project/${project._id}`,
            description: values.description,
          });
        }
        message.success(response.message);
        setShowTaskForm(false);
        reloadData();
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  const validateEmail = (values) => {
    const employeesInProject = project.members.filter(
      (member) => member.role === "employee"
    );
    const isEmailValid = employeesInProject.find(
      (employee) => employee.user.email === email
    );
    return isEmailValid ? true : false;
  };

  const uploadImage=async(image)=>{
    try {
      dispatch(setLoading(true))
      const formData=new FormData()
      formData.append('file',file)
      formData.append('taskId',task._id)
      console.log('formdata',formData)
      const response=await UploadImage(formData)
      if(response.success){
        console.log('Imgrespo',response)
        message.success(response.message)
        setImages([...images,response.data])
        reloadData()
      }else{
        throw new Error(response.message)
      }
      dispatch(setLoading(false))
      
    } catch (error) {
      message.error(error.message)
      dispatch(setLoading(false))
      
    }
  }
  const deleteImage=async(image)=>{
    try {
      dispatch(setLoading(true))
      const attachments=images.filter(img=>img !==image)

      console.log('Attachments',attachments)
      const response=await UpdateTask({
        ...task,
        attachments
      })
      if(response.success){
        message.success(response.message)
        setImages(attachments)
        reloadData()
      }else{
        throw new Error(response.message)
      }
      dispatch(setLoading(false))
      
    } catch (error) {
      message.error(error.message)
      dispatch(setLoading(false))
      
    }

  }
  return (
    <Modal
      title={task ? "Update Task" : "Add Task"}
      open={showTaskForm}
      onCancel={() => setShowTaskForm(false)}
      centered
      onOk={() => {
        formRef.current.submit();
      }}
      okText={task ? "Update" : "Create"}
      {...(selectedTab==="2" && {footer:null})}
    >
     <Tabs activeKey={selectedTab} onChange={(key=>setSelectedTab(key))}>
      <Tabs.TabPane tab="Task Details" key="1">
      <Form
        layout="vertical"
        ref={formRef}
        onFinish={onFinish}
        initialValues={{
          ...task,
          assignedTo: task ? task.assignedTo.email : "",
        }}

      >
        <Form.Item label="Task Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Task Description" name="description">
          <TextArea />
        </Form.Item>
        <Form.Item label="Assign To" name="assignedTo">
          <Input
            placeholder="Enter Email For the Task Assignment"
            disabled={task ? true : false}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        {email && !validateEmail() && (
          <div className="bg-red-500 text-sm p-2 rounded">
            <span className="text-white">
              Invalid Email or Employee is not found in the peoject
            </span>
          </div>
        )}
      </Form>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Attachment" key='2' disabled={!task}>
      <div className="flex gap-5 mb-5">
              {images.map((image) => {
                return (
                 <div className="flex gap-3 p-2 border border-solid rounded items-end">
                   <img
                    src={image}
                    alt=""
                    className="w-20 h-20 object-cover mt-2 "
                  />
                  <i className="ri-delete-bin-line text-red-900" onClick={()=>deleteImage(image)}></i>

                  </div>
                );
              })}
            </div>
        <Upload
        beforeUpload={()=>false}
        onChange={info=>{
            setFile(info.file)
        }}
        listType="picture"
        >
          <Button type="dashed">
            Select Images
          </Button>
        </Upload>
        <div className="flex justify-end mt-4 gap-5">
        <Button
          type="default"
          onClick={()=>setShowTaskForm(false)}
          >Cancel Image</Button>
          <Button
          type="primary"
          onClick={uploadImage}
          disabled={!file}
          >Upload Image</Button>
        </div>
      </Tabs.TabPane>
     </Tabs>
    </Modal>
  );
};

export default TaskForm;
