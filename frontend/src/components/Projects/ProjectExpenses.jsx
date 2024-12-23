import React, { useEffect, useState } from "react";
import { getProjectsExpenses } from "../../services/projectService";

const ProjectExpenses = ({ id }) => {
  const [expenses, setExpenses] = useState({});
  console.log(id);
  useEffect(() => {
    getProjectsExpenses(id)
      .then((res) => {
        console.log(res.data.total_expenses);
        setExpenses(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  return <td> {expenses.total_expenses} </td>;
};

export default ProjectExpenses;
