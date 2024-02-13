import React, { useEffect ,useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setLoading } from "../../redux/loadersSlice";
import { GetProjectById } from "../../apicalls/projects";
import { Tabs, message } from "antd";
import { getDateFormat } from "../../utils/helpers";
import { Divider } from "antd";
import Tasks from "./Tasks";
import Members from "./Members";

const ProjectInfo = () => {
  const [project, setProject] = useState(null);
  const[currentUserRole,setCurrentUserRole]=useState("")
  const {user}=useSelector(state=>state.users)
  const dispatch = useDispatch();
  const params = useParams();


  const getData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetProjectById(params.id);
      dispatch(setLoading(false));
      if (response.success) {
        setProject(response.data);
        const currentUserRole=response.data.members.find(member=>member.user._id===user._id)
        setCurrentUserRole(currentUserRole.role)
      }
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    project && (
        <div>
      <div className="flex justify-between">
        <div>
          <h1 className="text-primary text-2xl font-semibold uppercase">
            {" "}
            {project?.name}
          </h1>
          <span className="text-gray-600 text-sm">{project?.description}</span>
          <div className="flex gap-1">
          <span className="text-primary text-sm font-semibold ">
        My Role:
          </span>          
          <span className="text-gray-600 text-sm uppercase ">{currentUserRole}</span>
        </div>
        </div>
       <div>
       <div className="flex gap-5">
          <span className="text-primary text-sm font-semibold ">
          Created At:
          </span>
          {" "}
          <span className="text-gray-600 text-sm">{getDateFormat(project?.createdAt)}</span>
        </div>
        <div className="flex gap-5">
          <span className="text-primary text-sm font-semibold ">
          Created By:
          </span>
          {" "}
          <span className="text-gray-600 text-sm">{project?.owner.firstName} {project?.owner.lastName}</span>
        </div>
        
       </div>
      </div>
      <Divider/>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Tasks" key="1"  ><Tasks project={project}/></Tabs.TabPane>
        <Tabs.TabPane tab="Members" key="2"  ><Members project={project} reloadData={getData}/></Tabs.TabPane>
        <Tabs.TabPane tab="Settings" key="3"  ></Tabs.TabPane>


      </Tabs>
    </div>
    )
  );
};

export default ProjectInfo;
