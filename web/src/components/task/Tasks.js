import React, { useState, useEffect } from "react";
import Form, { Field } from "@atlaskit/form";
import Button from "@atlaskit/button";
import TextField from "@atlaskit/textfield";
import styled from "styled-components";
import DynamicTable from "@atlaskit/dynamic-table";
import Moment from "react-moment";
import InlineEdit from "@atlaskit/inline-edit";
import Page, { Grid, GridColumn } from "@atlaskit/page";
import Swal from "sweetalert2";
import { Checkbox } from "@atlaskit/checkbox";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Badge from "@atlaskit/badge";
import SearchForm from "./SearchForm";
import TaskForm from "./TaskForm";
import ReadViewContainer from "../shared/ReadViewContainer";

function createKey(input) {
  return input ? input.replace(/^(the|a|an)/, "").replace(/\s/g, "") : input;
}
function Tasks(props) {
  const endpoint = `${process.env.REACT_APP_API_URL}`;
  const tasksEndpoint = `${endpoint}/tasks`;
  const labelsEndpoint = `${endpoint}/labels`;
  const [tasks, setTasks] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const title = `(${tasks.length}) ` + (props.type ? props.type : "Todo");
  const Wrapper = styled.div`
    min-width: 600px;
  `;

  const ButtonWrapper = styled.div`
    margin-top: 1.9em;
  `;
  const getLabels = async (search = "") => {
    setLoading(true);
    const labelApi = await fetch(
      `${labelsEndpoint}/${props.type}/?title=${search}`
    );
    const labelsArray = await labelApi.json();
    setLabels(labelsArray);
    setLoading(false);
  };

  const getTasks = async (search = "") => {
    setLoading(true);
    const tasksApi = await fetch(
      `${tasksEndpoint}/${props.type}/?title=${search}`
    );
    const tasksArray = await tasksApi.json();
    setTasks(tasksArray);
    setLoading(false);
  };

  const createTaskAPI = async (task) => {
    console.log("🚀🚀🚀🚀🚀🚀 task");
    console.log(task);
    console.log("----------------------------------------------------");
    console.log();
    setLoading(true);
    const taskApi = await fetch(`${tasksEndpoint}/`, {
      method: "POST",
      body: JSON.stringify({ title: task.title, labels: task.labels }),
      headers: { "Content-Type": "application/json" },
    });

    const taskData = await taskApi.json();
    if (taskData.errors) {
      setErrors(taskData.errors);
    }
    if (taskData.statusCode === 200) {
      setErrors([]);
      Swal.fire("Created!", "Task has been created.", "success");
      tasks.unshift(taskData.payload);
      setTasks(tasks);
      setLoading(false);
    }
  };

  // todo use this
  const deleteTaskAPI = (task) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.value) {
        setLoading(true);
        const taskApi = await fetch(`${tasksEndpoint}/${task._id}`, {
          method: "DELETE",
        });
        const taskData = await taskApi.json();
        if (taskData.statusCode === 200) {
          Swal.fire("Deleted!", "Task has been deleted.", "success");
          const newTasks = tasks.filter(function (tas) {
            return tas._id !== task._id;
          });
          setTasks(newTasks);
        }
        setLoading(false);
      }
    });
  };
  const updateTaskAPI = async (task) => {
    setLoading(true);
    const taskApi = await fetch(`${tasksEndpoint}/`, {
      method: "PUT",
      body: JSON.stringify({
        _id: task._id,
        title: task.title,
        status: task.status,
        // labels: task.labels, todo
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const taskData = await taskApi.json();
    if (taskData.statusCode === 200) {
      Swal.fire("Updated!", "Task has been updated.", "success");
      let newTasks = tasks.map((p) =>
        p._id === taskData.payload._id ? { ...taskData.payload } : p
      );

      // remove task if marked as completed
      if (props.type == "" && taskData.payload.status) {
        newTasks = newTasks.filter(function (el) {
          return el.status == false;
        });
      }
      // remove task if marked as uncompleted
      if (props.type == "completed" && !taskData.payload.status) {
        newTasks = newTasks.filter(function (el) {
          return el.status == true;
        });
      }
      setTasks(newTasks);
      setLoading(false);
    }
  };

  const listLabels = useEffect(() => {
    getLabels();
  }, [`${labelsEndpoint}`]);

  const listTasks = useEffect(() => {
    document.title = title.toUpperCase() + " | Engz";
    getTasks();
  }, [`${tasksEndpoint}/${props.type}`]);

  const head = {
    cells: [
      {
        key: "Check",
        content: "Check",
      },
      {
        key: "title",
        content: "Title",
      },
      {
        key: "label",
        content: "Label",
      },
      {
        key: "createdAt",
        content: "createdAt",
      },
      {
        key: "updatedAt",
        content: "updatedAt",
      },
      {
        key: "DeleteAction",
        content: "Delete?",
      },
    ],
  };
  const rows =
    tasks.length &&
    tasks.map((task) => ({
      key: createKey(task._id),
      cells: [
        {
          key: createKey("check"),
          content: (
            <p>
              <Checkbox
                defaultChecked={task.status ? " checked" : ""}
                onChange={(e) => {
                  updateTaskAPI({
                    ...task,
                    status: !task.status,
                  });
                }}
                name="checkbox-basic"
              />
            </p>
          ),
          isSortable: true,
        },
        {
          key: createKey(task.title),
          content: (
            <div>
              {" "}
              <InlineEdit
                defaultValue={task.title}
                editView={(fieldProps) => (
                  <TextField {...fieldProps} autoFocus />
                )}
                readView={() => (
                  <ReadViewContainer>
                    {task.title || "Click to enter value"}
                  </ReadViewContainer>
                )}
                onConfirm={(value) => {
                  updateTaskAPI({ ...task, title: value });
                }}
              />{" "}
            </div>
          ),
          isSortable: true,
        },
        {
          key: createKey(
            task.labels && task.labels.length ? task.labels[0].title : task._id
          ),
          content: task.labels && task.labels.length && (
            <ul>
              {task.labels.map((label) => (
                <li key={label._id}>
                  <Badge>{label.title}</Badge>
                </li>
              ))}
            </ul>
          ),
          isSortable: true,
        },
        {
          key: createKey(task.createdAt),
          content: (
            <p>
              <Moment fromNow>{task.createdAt}</Moment>
            </p>
          ),
          isSortable: true,
        },
        {
          key: createKey(task.updatedAt),
          content: (
            <p>
              <Moment fromNow>{task.updatedAt}</Moment>
            </p>
          ),
          isSortable: true,
        },
        {
          key: createKey(task._id),
          content: (
            <p>
              <Button appearance="danger" onClick={() => deleteTaskAPI(task)}>
                Delete
              </Button>
            </p>
          ),
          isSortable: true,
        },
      ],
    }));
  return (
    <>
      {loading ? (
        <>
          <Loader type="Oval" color="#00BFFF" height={80} width={80} />
        </>
      ) : (
        <>
          <TaskForm
            createTaskAPI={createTaskAPI}
            errors={errors}
            labels={labels}
          />

          <h4 className="uppercase gray">{title} tasks</h4>

          <SearchForm getTasks={getTasks} />

          <Wrapper>
            <DynamicTable
              head={head}
              rows={rows}
              rowsPerPage={5}
              defaultPage={1}
              loadingSpinnerSize="large"
              isLoading={false}
              isFixedSize
              onSort={() => console.log("onSort")}
              onSetPage={() => console.log("onSetPage")}
            />
          </Wrapper>
        </>
      )}
    </>
  );
}

export default Tasks;