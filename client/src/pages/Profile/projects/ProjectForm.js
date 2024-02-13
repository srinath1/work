import React from 'react'
import {Modal,Input,Form,message} from 'antd'
import TextArea from 'antd/es/input/TextArea'
import {useDispatch,useSelector} from 'react-redux'
import {setLoading} from '../../../redux/loadersSlice'
import { EditProject, createProject } from '../../../apicalls/projects'

const ProjectForm = ({show,setShow,reloadData,project}) => {
    const {user}=useSelector(state=>state.users)

    const formRef=React.useRef(null)
    const dispatch=useDispatch()
    const onFinish=async(values)=>{
       try {
        dispatch(setLoading(true))
        let response=null
        if(project){
            values._id=project._id
            response=await EditProject(values)
            setShow(false)
            reloadData()

        }else{
            values.owner=user._id;
            values.members=[
                {
                    user:user._id,
                    role:"owner"
                }
            ]
             response=await createProject(values)
            if(response.success){
                message.success(response.message)
                reloadData()
                setShow(false)
            }else{
                throw new Error(response.error)
            }

            dispatch(setLoading(false))



        }
        dispatch(setLoading(false))

        
       } catch (error) {
        dispatch(setLoading(false))
        
       }
    }
  return (
    <Modal

    title={project ?"Edit Project":"Add Project"}
    open={show}
    onCancel={()=>setShow(false)}
    centered
    width={700}
    onOk={()=>{
        formRef.current.submit()
    }}
    okText="Save"
    >
<Form layout='vertical' onFinish={onFinish} ref={formRef} initialValues={project}>
    <Form.Item label="Project Name" name="name">
        <Input placeholder='Project Name'/>
    </Form.Item>
    <Form.Item label="Project Description" name="description">

<TextArea placeholder='Project Description'/>
    </Form.Item>
</Form>

    </Modal>
  )
}

export default ProjectForm