// import React, { useEffect, useState } from "react";
// import {
//   completedProjects,
//   countProjects,
//   ongoingProjects,
//   pendingProjects,
// } from "../../services/projectService";
// import "./projectSummery.css";
// import CountUp from "react-countup";
// import { Add } from "@mui/icons-material"; // Material-UI icons
// const ProjectSummery = () => {
//   const [CountProjects, setCountProjects] = useState("");
//   const [completedCount, setcompletedCount] = useState("");
//   const [ongoingCount, setongoingCount] = useState("");
//   const [pendingCount, setpendingCount] = useState("");
//   useEffect(() => {
//     countProjects()
//       .then((res) => {
//         console.log(res.data);
//         setCountProjects(res.data.projectsCount);
//       })
//       .catch((err) => console.log(err));
//     completedProjects()
//       .then((res) => setcompletedCount(res.data.completedCount))
//       .catch((err) => console.log(err));

//     ongoingProjects()
//       .then((res) => setongoingCount(res.data.ongoingCount))
//       .catch((err) => console.log(err));

//     pendingProjects()
//       .then((res) => setpendingCount(res.data.pendingCount))
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <div classNameName="project-summery-conatiner">
//       <div classNameName="total-projects">
//         <h4 classNameName="title">Total Projects</h4>

//         <p classNameName="number">
//           <Add style={{ fontSize: "16px" }} />
//           <CountUp
//             duration={4}
//             classNameName="counter"
//             start={0}
//             end={CountProjects}
//           />
//         </p>
//       </div>
//       <div classNameName="completed-projects">
//         <h4 classNameName="title"> Completed Project</h4>
//         <p classNameName="number">
//           <Add style={{ fontSize: "16px" }} />
//           <CountUp
//             duration={4}
//             classNameName="counter"
//             start={0}
//             end={completedCount}
//           />
//         </p>
//       </div>
//       <div classNameName="ongoing-projects">
//         <h4 classNameName="title">Ongoing Projects</h4>
//         <p classNameName="number">
//           <Add style={{ fontSize: "16px" }} />
//           <CountUp
//             duration={4}
//             classNameName="counter"
//             start={0}
//             end={ongoingCount}
//           />
//         </p>
//       </div>
//       <div classNameName="pending-projects">
//         <h4 classNameName="title">Upcoming Projects</h4>
//         <p classNameName="number">
//           <Add style={{ fontSize: "16px" }} />
//           <CountUp
//             duration={4}
//             classNameName="counter"
//             start={0}
//             end={pendingCount}
//           />
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ProjectSummery;
// import React, { useEffect, useState } from "react";
// import {
//   completedProjects,
//   countProjects,
//   ongoingProjects,
//   pendingProjects,
// } from "../../services/projectService";
// import "./projectSummery.css";
// import CountUp from "react-countup";
// import {
//   CheckCircle,
//   HourglassEmpty,
//   AccessAlarm,
//   Assignment,
// } from "@mui/icons-material"; // Material-UI icons

// const ProjectSummery = () => {
//   const [CountProjects, setCountProjects] = useState(0);
//   const [completedCount, setCompletedCount] = useState(0);
//   const [ongoingCount, setOngoingCount] = useState(0);
//   const [pendingCount, setPendingCount] = useState(0);

//   useEffect(() => {
//     countProjects()
//       .then((res) => setCountProjects(res.data.projectsCount))
//       .catch((err) => console.log(err));

//     completedProjects()
//       .then((res) => setCompletedCount(res.data.completedCount))
//       .catch((err) => console.log(err));

//     ongoingProjects()
//       .then((res) => setOngoingCount(res.data.ongoingCount))
//       .catch((err) => console.log(err));

//     pendingProjects()
//       .then((res) => setPendingCount(res.data.pendingCount))
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <div className="container">
//       <div className="row ">
//         <div className="col-xl-6 col-lg-6">
//           <div className="card l-bg-cherry">
//             <div className="card-statistic-3 p-4">
//               <div className="card-icon card-icon-large">
//                 <i className="fas fa-shopping-cart"></i>
//               </div>
//               <div className="mb-4">
//                 <h5 className="card-title mb-0">Completed Project</h5>
//               </div>
//               <div className="row align-items-center mb-2 d-flex">
//                 <div className="col-8">
//                   <h2 className="d-flex align-items-center mb-0">
//                     <CountUp
//                       duration={4}
//                       className="counter"
//                       start={0}
//                       end={completedCount}
//                     />
//                   </h2>
//                 </div>
//                 <div className="col-4 text-right">
//                   <span>
//                     <Assignment
//                       style={{ fontSize: "40px", color: "#17a2b8" }}
//                     />
//                   </span>
//                 </div>
//               </div>
//               <div
//                 className="progress mt-1 "
//                 data-height="8"
//                 style="height: 8px;"
//               >
//                 <div
//                   className="progress-bar l-bg-cyan"
//                   role="progressbar"
//                   data-width="25%"
//                   aria-valuenow="25"
//                   aria-valuemin="0"
//                   aria-valuemax="100"
//                   style="width: 25%;"
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-xl-6 col-lg-6">
//           <div className="card l-bg-blue-dark">
//             <div className="card-statistic-3 p-4">
//               <div className="card-icon card-icon-large">
//                 <i className="fas fa-users"></i>
//               </div>
//               <div className="mb-4">
//                 <h5 className="card-title mb-0">Totall Project</h5>
//               </div>
//               <div className="row align-items-center mb-2 d-flex">
//                 <div className="col-8">
//                   <h2 className="d-flex align-items-center mb-0">
//                     <CountUp
//                       duration={4}
//                       className="counter"
//                       start={0}
//                       end={CountProjects}
//                     />
//                   </h2>
//                 </div>
//                 <div className="col-4 text-right">
//                   <span>
//                     <CheckCircle
//                       style={{ fontSize: "40px", color: "#28a745" }}
//                     />
//                     {/* 9.23% <i className="fa fa-arrow-up"></i> */}
//                   </span>
//                 </div>
//               </div>
//               <div
//                 className="progress mt-1 "
//                 data-height="8"
//                 style="height: 8px;"
//               >
//                 <div
//                   className="progress-bar l-bg-green"
//                   role="progressbar"
//                   data-width="25%"
//                   aria-valuenow="25"
//                   aria-valuemin="0"
//                   aria-valuemax="100"
//                   style="width: 25%;"
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-xl-6 col-lg-6">
//           <div className="card l-bg-green-dark">
//             <div className="card-statistic-3 p-4">
//               <div className="card-icon card-icon-large">
//                 <i className="fas fa-ticket-alt"></i>
//               </div>
//               <div className="mb-4">
//                 <h5 className="card-title mb-0">Upcoming Project</h5>
//               </div>
//               <div className="row align-items-center mb-2 d-flex">
//                 <div className="col-8">
//                   <h2 className="d-flex align-items-center mb-0">
//                     {" "}
//                     <CountUp
//                       duration={4}
//                       className="counter"
//                       start={0}
//                       end={pendingCount}
//                     />
//                   </h2>
//                 </div>
//                 <div className="col-4 text-right">
//                   <span>
//                     <AccessAlarm
//                       style={{ fontSize: "40px", color: "#dc3545" }}
//                     />
//                     {/* 10% <i className="fa fa-arrow-up"></i> */}
//                   </span>
//                 </div>
//               </div>
//               <div
//                 className="progress mt-1 "
//                 data-height="8"
//                 style="height: 8px;"
//               >
//                 <div
//                   className="progress-bar l-bg-orange"
//                   role="progressbar"
//                   data-width="25%"
//                   aria-valuenow="25"
//                   aria-valuemin="0"
//                   aria-valuemax="100"
//                   style="width: 25%;"
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-xl-6 col-lg-6">
//           <div className="card l-bg-orange-dark">
//             <div className="card-statistic-3 p-4">
//               <div className="card-icon card-icon-large">
//                 <i className="fas fa-dollar-sign"></i>
//               </div>
//               <div className="mb-4">
//                 <h5 className="card-title mb-0">Ongoing Project</h5>
//               </div>
//               <div className="row align-items-center mb-2 d-flex">
//                 <div className="col-8">
//                   <h2 className="d-flex align-items-center mb-0">
//                     {" "}
//                     <CountUp
//                       duration={4}
//                       className="counter"
//                       start={0}
//                       end={ongoingCount}
//                     />
//                   </h2>
//                 </div>
//                 <div className="col-4 text-right">
//                   <span>
//                     <HourglassEmpty
//                       style={{ fontSize: "40px", color: "#ffc107" }}
//                     />
//                     {/* 2.5% <i className="fa fa-arrow-up"></i> */}
//                   </span>
//                 </div>
//               </div>
//               <div
//                 className="progress mt-1 "
//                 data-height="8"
//                 style="height: 8px;"
//               >
//                 <div
//                   className="progress-bar l-bg-cyan"
//                   role="progressbar"
//                   data-width="25%"
//                   aria-valuenow="25"
//                   aria-valuemin="0"
//                   aria-valuemax="100"
//                   style="width: 25%;"
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectSummery;

// <div classNameName="container">
//   <div classNameName="row row-cols-1 row-cols-md-1 g-1">
//     {/* Total Projects */}
//     <div classNameName="col">
//       <div classNameName="card project-card animate__animated animate__fadeIn">
//         <CheckCircle style={{ fontSize: "40px", color: "#28a745" }} />
//         <div classNameName="card-body text-center">
//           <h4 classNameName="title">Total Projects</h4>
//           <p classNameName="number">
//             <CountUp
//               duration={4}
//               classNameName="counter"
//               start={0}
//               end={CountProjects}
//             />
//           </p>
//         </div>
//       </div>
//     </div>

//     {/* Completed Projects */}
//     <div classNameName="col">
//       <div classNameName="card project-card animate__animated animate__fadeIn">
//         <Assignment style={{ fontSize: "40px", color: "#17a2b8" }} />
//         <div classNameName="card-body text-center">
//           <h4 classNameName="title">Completed Projects</h4>
//           <p classNameName="number">
//             <CountUp
//               duration={4}
//               classNameName="counter"
//               start={0}
//               end={completedCount}
//             />
//           </p>
//         </div>
//       </div>
//     </div>

//     {/* Ongoing Projects */}
//     <div classNameName="col">
//       <div classNameName="card project-card animate__animated animate__fadeIn">
//         <HourglassEmpty style={{ fontSize: "40px", color: "#ffc107" }} />
//         <div classNameName="card-body text-center">
//           <h4 classNameName="title">Ongoing Projects</h4>
//           <p classNameName="number">
//             <CountUp
//               duration={4}
//               classNameName="counter"
//               start={0}
//               end={ongoingCount}
//             />
//           </p>
//         </div>
//       </div>
//     </div>

//     {/* Upcoming Projects */}
//     <div classNameName="col">
//       <div classNameName="card project-card animate__animated animate__fadeIn">
//         <AccessAlarm style={{ fontSize: "40px", color: "#dc3545" }} />
//         <div classNameName="card-body text-center">
//           <h4 classNameName="title">Upcoming Projects</h4>
//           <p classNameName="number">
//             <CountUp
//               duration={4}
//               classNameName="counter"
//               start={0}
//               end={pendingCount}
//             />
//           </p>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
import React, { useEffect, useState } from "react";
import {
  completedProjects,
  countProjects,
  ongoingProjects,
  pendingProjects,
} from "../../services/projectService";
import "./projectSummery.css";
import CountUp from "react-countup";
import {
  CheckCircle,
  HourglassEmpty,
  AccessAlarm,
  Assignment,
} from "@mui/icons-material"; // Material-UI icons

const ProjectSummery = () => {
  const [CountProjects, setCountProjects] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [ongoingCount, setOngoingCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    countProjects()
      .then((res) => setCountProjects(res.data.projectsCount))
      .catch((err) => console.log(err));

    completedProjects()
      .then((res) => setCompletedCount(res.data.completedCount))
      .catch((err) => console.log(err));

    ongoingProjects()
      .then((res) => setOngoingCount(res.data.ongoingCount))
      .catch((err) => console.log(err));

    pendingProjects()
      .then((res) => setPendingCount(res.data.pendingCount))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-md-2 g-8">
        <div className="col">
          <div className="card l-bg-cherry">
            <div className="card-statistic-3 p-4">
              <div className="card-icon card-icon-large">
                <Assignment style={{ fontSize: "40px", color: "#fff" }} />
              </div>
              <div className="mb-4">
                <h5 className="card-title mb-0">Completed Projects</h5>
              </div>
              <div className="row align-items-center mb-2 d-flex">
                <div className="col-8">
                  <h2 className="d-flex align-items-center mb-0">
                    <CountUp
                      duration={4}
                      className="counter"
                      start={0}
                      end={completedCount}
                    />
                  </h2>
                </div>
                <div className="col-4 text-right">
                  <span>
                    <CheckCircle style={{ fontSize: "40px", color: "#fff" }} />
                  </span>
                </div>
              </div>
              <div className="progress mt-1" style={{ height: "8px" }}>
                <div
                  className="progress-bar l-bg-cyan"
                  role="progressbar"
                  style={{ width: "25%" }}
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card l-bg-blue-dark">
            <div className="card-statistic-3 p-4">
              <div className="card-icon card-icon-large"></div>
              <div className="mb-4">
                <h5 className="card-title mb-0">Total Projects</h5>
              </div>
              <div className="row align-items-center mb-2 d-flex">
                <div className="col-8">
                  <h2 className="d-flex align-items-center mb-0">
                    <CountUp
                      duration={4}
                      className="counter"
                      start={0}
                      end={CountProjects}
                    />
                  </h2>
                </div>
                <div className="col-4 text-right">
                  <span>
                    <Assignment
                      style={{ fontSize: "40px", color: "#28a745" }}
                    />
                  </span>
                </div>
              </div>
              <div className="progress mt-1" style={{ height: "8px" }}>
                <div
                  className="progress-bar l-bg-green"
                  role="progressbar"
                  style={{ width: "25%" }}
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card l-bg-green-dark">
            <div className="card-statistic-3 p-4">
              <div className="card-icon card-icon-large"></div>
              <div className="mb-4">
                <h5 className="card-title mb-0">Upcoming Projects</h5>
              </div>
              <div className="row align-items-center mb-2 d-flex">
                <div className="col-8">
                  <h2 className="d-flex align-items-center mb-0">
                    <CountUp
                      duration={4}
                      className="counter"
                      start={0}
                      end={pendingCount}
                    />
                  </h2>
                </div>
                <div className="col-4 text-right">
                  <span>
                    <AccessAlarm
                      style={{ fontSize: "40px", color: "#dc3545" }}
                    />
                  </span>
                </div>
              </div>
              <div className="progress mt-1" style={{ height: "8px" }}>
                <div
                  className="progress-bar l-bg-orange"
                  role="progressbar"
                  style={{ width: "25%" }}
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card l-bg-orange-dark">
            <div className="card-statistic-3 p-4">
              <div className="card-icon card-icon-large"></div>
              <div className="mb-4">
                <h5 className="card-title mb-0">Ongoing Projects</h5>
              </div>
              <div className="row align-items-center mb-2 d-flex">
                <div className="col-8">
                  <h2 className="d-flex align-items-center mb-0">
                    <CountUp
                      duration={4}
                      className="counter"
                      start={0}
                      end={ongoingCount}
                    />
                  </h2>
                </div>
                <div className="col-4 text-right">
                  <span>
                    <HourglassEmpty
                      style={{ fontSize: "40px", color: "#ffc107" }}
                    />
                  </span>
                </div>
              </div>
              <div className="progress mt-1" style={{ height: "8px" }}>
                <div
                  className="progress-bar l-bg-cyan"
                  role="progressbar"
                  style={{ width: "25%" }}
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSummery;
