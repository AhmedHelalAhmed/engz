import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import Swal from "sweetalert2";
import LabelForm from "./LabelForm";
import LabelsList from "./LabelsList";
import SearchForm from "./SearchForm";

function Labels(props) {
  const endpoint = `${process.env.REACT_APP_API_URL}`;
  const labelsEndpoint = `${endpoint}/labels`;

  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const getLabels = async (search = "") => {
    setLoading(true);
    const labelsApi = await fetch(`${labelsEndpoint}/?title=${search}`);
    const labelsArray = await labelsApi.json();
    setLabels(labelsArray);
    setLoading(false);
  };

  const createTaskAPI = async (label) => {
    setLoading(true);
    const taskApi = await fetch(`${labelsEndpoint}/`, {
      method: "POST",
      body: JSON.stringify({ title: label }),
      headers: { "Content-Type": "application/json" },
    });
    const taskData = await taskApi.json();
    // todo set errors
    if (taskData.errors) {
      setErrors(taskData.errors);
    }
    if (taskData.statusCode === 200) {
      setErrors([]);
      Swal.fire("Created!", "Label has been created.", "success");

      labels.unshift(taskData.payload);
      setLabels(labels);
    }
    setLoading(false);
  };

  useEffect(() => {
    document.title = "Labels | Engz".toUpperCase();
    getLabels();
  }, [`${labelsEndpoint}/${props.type}`]);

  return (
    <>
      {loading ? (
        <>
          <Loader type="Oval" color="#00BFFF" height={80} width={80} />
        </>
      ) : (
        <>
          {!props.type && (
            <LabelForm createTaskAPI={createTaskAPI} errors={errors} />
          )}
          <h4 className="gray"> Labels ({labels.length}) </h4>
          <SearchForm getLabels={getLabels} />
          <LabelsList
            labels={labels}
            setLabels={setLabels}
            setLoading={setLoading}
          />
        </>
      )}
    </>
  );
}

export default Labels;
