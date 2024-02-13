import React, { useEffect, useState } from "react";
import { Button, Table, message, Modal, Divider } from "antd";
import TaskForm from "./TaskForm";
import { setLoading } from "../../../redux/loadersSlice";
import { DeleteTask, GetAllTasks, UpdateTask } from "../../../apicalls/tasks";
import { useDispatch, useSelector } from "react-redux";
import { getDateFormat } from "../../../utils/helpers";
import { AddNotification } from "../../../apicalls/notifications";

const Tasks = ({ project }) => {
  const [filters, setFilters] = useState({
    status: "all",
    assignedBy: "all",
    assignedTo: "all",
  });
  const { user } = useSelector((state) => state.users);
  const [showViewTask, setShowViewTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const [task, setTask] = useState(null);
  const dispatch = useDispatch();

  const isEmployee = project.members.find(
    (member) => member.role === "employee" && member.user._id === user._id
  );

  const getTasks = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetAllTasks({
        project: project?._id,
        ...filters,
      });
      dispatch(setLoading(false));
      if (response.success) {
        setTasks(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };
  React.useEffect(() => {
    getTasks();
  }, []);

  const deleteTasks = async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await DeleteTask(id);
      if (response.success) {
        getTasks();
        message.success(response.message);
      } else {
        throw new Error(response.message);
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  const onStatusUpdate = async ({ task, status }) => {
    console.log("Status", status);
    console.log("Task", task);
    try {
      dispatch(setLoading(true));
      const response = await UpdateTask({
        _id: task._id,
        status,
      });
      if (response.success) {
        getTasks();
        message.success(response.message);
        await AddNotification({
          title: "Task status updated",
          description: `${task.name} status has been updated to ${status}`,
          user: task.assignedBy._id,
          onClick: `/project/${project._id}`,
        });
      } else {
        throw new Error(response.message);
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span
          className="underline text-md cursor-pointer"
          onClick={() => {
            console.log("Record task", record);

            setTask(record);
            setShowViewTask(true);
          }}
        >
          {record.name}
        </span>
      ),
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      render: (text, record) =>
        record.assignedTo.firstName + " " + record.assignedTo.lastName,
    },
    {
      title: "Assigned By",
      dataIndex: "assignedBy",
      render: (text, record) =>
        record.assignedBy.firstName + " " + record.assignedBy.lastName,
    },
    {
      title: "Assigned On",
      dataIndex: "createdAt",
      render: (text, record) => {
        return getDateFormat(text);
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        console.log("Record Status", record);
        return (
          <select
            value={record.status}
            onChange={(e) => {
              onStatusUpdate({
                task: record,
                status: e.target.value,
              });
            }}
            disabled={record.assignedTo._id !== user._id && isEmployee}
          >
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-2">
            <Button
              type="primary"
              onClick={() => {
                setTask(record);
                setShowTaskForm(true);
              }}
            >
              Edit
            </Button>

            <Button
              type="primary"
              danger
              onClick={() => deleteTasks(record._id)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];
  if (isEmployee) {
    columns.pop();
  }
  useEffect(() => {
    getTasks();
  }, [filters]);

  return (
    <div>
      {!isEmployee && (
        <div className="flex justify-start">
          <Button type="default" onClick={() => setShowTaskForm(true)}>
            Add Task
          </Button>
        </div>
      )}

      <div className="flex gap-5">
        <div>
          <span>Status</span>
          <select
            value={filters.status}
            onChange={(e) => {
              setFilters({
                ...filters,
                status: e.target.value,
              });
            }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>

            <option value="progress">Progress</option>

            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <span>Assigned By</span>
          <select
            value={filters.assignedBy}
            onChange={(e) => {
              console.log("selecte", e.target.value);
              setFilters({
                ...filters,
                assignedBy: e.target.value,
              });
            }}
          >
            <option value="all">All</option>
            {project.members
              .filter((m) => m.role === "admin" || m.role === "owner")
              .map((m) => {
                return (
                  <option value={m.user._id}>
                    {m.user.firstName + " " + m.user.lastName}
                  </option>
                );
              })}
          </select>
        </div>
        <div>
          <span>Assigned To</span>
          <select
            value={filters.assignedTo}
            onChange={(e) => {
              console.log("selecte", e.target.value);
              setFilters({
                ...filters,
                assignedTo: e.target.value,
              });
            }}
          >
            <option value="all">All</option>
            {project.members
              .filter((m) => m.role === "employee")
              .map((m) => {
                return (
                  <option value={m.user._id}>
                    {m.user.firstName + " " + m.user.lastName}
                  </option>
                );
              })}
          </select>
        </div>
      </div>

      <Table columns={columns} dataSource={tasks} className="mt-5" />
      {showTaskForm && (
        <TaskForm
          showTaskForm={showTaskForm}
          setShowTaskForm={setShowTaskForm}
          project={project}
          reloadData={getTasks}
          task={task}
        />
      )}
      {showViewTask && (
        <Modal
          title="Task Details"
          open={showViewTask}
          onCancel={() => setShowViewTask(false)}
          centered
          footer={null}
          width={700}
        >
          <Divider />
          <div className="flex flex-col">
            <h1 className="text-xl text-primary">{task.name}</h1>
            <span className="text-[14px] text-gray-500">
              {task.description}
            </span>
            <div className="flex gap-5">
              {task.attachments.map((image) => {
                return (
                  <img
                    src={image}
                    alt=""
                    className="w-40 h-40 object-cover mt-2 p-2 border border-solid rounded"
                  />
                );
              })}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Tasks;
