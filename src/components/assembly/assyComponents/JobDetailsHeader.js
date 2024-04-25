import React from "react";
import JobRunTimeDetails from "./JobRunTimeDetails";
import { VscCollapseAll, VscExpandAll } from "react-icons/vsc";

export default function JobDetailsHeader(props) {
  let job = props.job;
  let expandDetails = props.expandDetails;
  let setExpandDetails = props.setExpandDetails;
  let nextJob = props.nextJob;
  let activeLabourDtls = props.activeLabourDtls;
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Machine</th>
            <th>Job</th>
            <th>Part</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr onClick={setExpandDetails}>
            <td>{job.lineID}</td>
            <td>{job.jobNum}</td>
            <td>
              {job.partNum} {job.partDesc}
            </td>
            <td>
              {expandDetails ? (
                <VscCollapseAll onClick={setExpandDetails} />
              ) : (
                <VscExpandAll onClick={setExpandDetails} />
              )}
            </td>
          </tr>
          {expandDetails ? (
            <tr>
              <td colSpan={4}>
                <JobRunTimeDetails
                  currentJob={job}
                  nextJob={nextJob}
                  activeLabourDtls={activeLabourDtls}
                />
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
