import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../redux/loadersSlice";
import { GetAllProjectsByRole } from "../../apicalls/projects";
import { Divider, message } from "antd";
import { getDateFormat } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetAllProjectsByRole();
      if (response.success) {
        setProjects(response.data);
      } else {
        throw new Error(response.message);
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      Hi,{user?.firstName} {user?.lastName} welcome to JUC Task Tracker!
      <div className="grid grid-cols-4 gap-5 mt-5">
        {projects?.map((project) => {
          return (
            <div
              className="flex flex-col gap-1 border border-solid border-gray-500 rounded-md p-2 mt-5 cursor-pointer"
              onClick={() => navigate(`/project/${project._id}`)}
            >
              <h1 className="text-primary text-lg uppercase font-semibold">
                {project.name}
              </h1>
              {/* <span className="text-gray-500 text-sm">{project.description}</span> */}
              <Divider />
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm font-semibold">
                  Created At:
                </span>
                <span>{getDateFormat(project.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm font-semibold">
                  Owner:
                </span>
                <span className="ml-2">{project.owner.firstName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm font-semibold">
                  Status:
                </span>
                <span className="ml-2">{project.status}</span>
              </div>
            </div>
          );
        })}
      </div>
      {projects?.length===0 && (
        <div className="flex justify-center items-center  h-96">
          <h1 className="text-primary text-xl text-red-900">No projects Found/yet</h1>
        </div>
      )}
    </div>
  );
};

export default Index;
