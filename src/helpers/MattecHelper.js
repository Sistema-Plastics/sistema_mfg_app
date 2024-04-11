const _ = require("lodash");

export const mattecHelpers = {
  buildEpicorJobList: function (jsonArray) {
    const arr = jsonArray.map((ro) => {
      const {
        JobHead_JobNum,
        JobOper_OprSeq,
        JobHead_PartNum,
        JobHead_PartDescription,
        JobHead_ProdQty,
        JobOper_MattecStartDate_c,
        JobOper_MattecStartHour_c,
        Calculated_ProdCrewSize,
      } = ro;
      /**JobHead_Company: "SISTNZ"
JobHead_JobNum: "A0203314"
JobHead_PartNum: "1008642"
JobHead_PartDescription: "5.25L Basket Charcoal (6)"
JobHead_ProdQty: "2310.00000000"
JobHead_IUM: "CT"
JobHead_DueDate: "2020-04-28T00:00:00"
JobHead_DueHour: "0.00"
JobHead_JobClosed: false
JobOper_Machine_ID_c: "H05"
JobOpDtl_ResourceID: "T642"
JobOper_MattecStartDate_c: "2020-03-20T00:00:00"
JobOper_MattecStartHour_c: "0.82"
JobOper_MattecLastUpdated_c: "2020-04-16T15:01:40.02"
JobOper_MattecEndDate_c: "2020-04-28T00:00:00"
JobOper_MattecEndHour_c: "11.70"
JobOper_OprSeq: 10
JobOpDtl_OpDtlSeq: 10
Calculated_ProdCrewSize: "1.50"
RowIdent: "ac5e8075-728f-483d-bbe7-6c18aac571ce" */
      const ao = {
        id: JobHead_JobNum,
        JobNum: JobHead_JobNum,
        OpNo: JobOper_OprSeq,
        title: JobHead_JobNum,
        PartNum: JobHead_PartNum,
        PartDescription: JobHead_PartDescription,
        RequiredQty: Number(JobHead_ProdQty),
        MattecStartDate: new Date(
          JobOper_MattecStartDate_c
        ).toLocaleDateString(),
        MattecStartHour: new Date(
          JobOper_MattecStartHour_c
        ).toLocaleTimeString(),
        Crewsize: Number(Calculated_ProdCrewSize),
      };
      return ao;
    });
    return arr;
  },
  //build a list of all teh current running jobs. this is a shorter list than Machine Job List as it exclude down machnes
  buildRunningMattecJobsList: function (jsonArray) {
    const arr = jsonArray.map((j) => {
      const {
        //TODO: remove Calculated_jobLvl,
        Calculated_MachNo,
        Calculated_JobID,
        Calculated_MoldID,
        Calculated_MoldDesc,
        Calculated_PartID,
        Calculated_PartDesc,
        Calculated_MachID,
        Calculated_MachDesc,
        Calculated_SchedQty,
        Calculated_qtyToGo,
        Calculated_timToGo,
        Calculated_DeptNo,
        Calculated_DeptName,
        Calculated_ShiftBoundsNo,
        Calculated_SetupTime,
        Calculated_TearDownTime,
      } = j;
      const jr = {
        JobLevel: 0,
        JobNum: Calculated_JobID.replace("100010", "").trim(),
        MachNo: Number(Calculated_MachNo),
        MachID: Calculated_MachID.trim(),
        MachDesc: Calculated_MachDesc.trim(),
        DeptNo: Number(Calculated_DeptNo),
        DeptName: Calculated_DeptName.trim(),
        PartNum: Calculated_PartID,
        PartDesc: Calculated_PartDesc.trim(),
        MoldID: Calculated_MoldID.trim(),
        MoldDesc: Calculated_MoldDesc.trim(),
        SchedQTY: Number(Calculated_SchedQty),
        QtyToGo: Number(Calculated_qtyToGo),
        TimeToGo: Number(Calculated_timToGo),
        TimeToGoHHMMSS: this.SecondsTohhmmss(Number(Calculated_timToGo)),
        SetupTime: Number(Calculated_SetupTime),
        TeardownTime: Number(Calculated_TearDownTime),
        ShiftBoundsNo: Number(Calculated_ShiftBoundsNo),
        SchedStart: 0,
        SchedStartDateTime: null,
        SchedEnd: 0,
        SchedEndDateTime: null,
        Status: "Current",
      };
      return jr;
    });
    return arr;
  },

  //build a list of all machines and ther current status /jobs
  buildMachineJobList: function (
    allMachineArray,
    runningJobsArray,
    resinByJobArray,
    mbatchByJobArray
  ) {
    const arr = allMachineArray.map((j) => {
      const {
        Calculated_MachNo,
        Calculated_MachID,
        Calculated_DeptNo,
        Calculated_DeptDesc,
        Calculated_DownNo,
        Calculated_DownDesc,
        Calculated_JobID,
        //TODO: remove  Calculated_JobSeq,
      } = j;
      const rja = runningJobsArray.filter((j) => j.MachNo === Calculated_MachNo);
      const rj = rja[0];

      let lvl,
        moldid,
        molddesc,
        partid,
        partdesc,
        machdesc,
        schedqty,
        qtytg,
        timtg,
         //TODO: remove oldtimtg,
        shiftbounds,
        setup,
        teardown,
        resinPN,
        resinDesc,
        resinQty,
        mbatchPN,
        mbatchDesc,
        mbatchQty;
      resinPN = "";
      resinQty = "";
      resinDesc = "";
      mbatchPN = "";
      mbatchDesc = "";
      mbatchQty = "";

      if (rj !== undefined) {
        let tmpJobID = "";
        try {
          tmpJobID = Calculated_JobID.replace("100010", "").trim();
        } catch {}

        let rs = resinByJobArray.filter((r) => r.JobMtl_JobNum === tmpJobID);

        let mb = mbatchByJobArray.filter((r) => r.JobMtl_JobNum === tmpJobID);

        if (rs.length > 0) {
          resinPN = rs[0].JobMtl_PartNum;
          resinDesc = rs[0].Part_PartDescription;
          resinQty =
            String(Number(rs[0].JobMtl_RequiredQty)) + " " + rs[0].JobMtl_IUM;
        }
        if (mb.length > 0) {
          mbatchPN = mb[0].JobMtl_PartNum;
          mbatchDesc = mb[0].Part_PartDescription;
          mbatchQty =
            String(Number(mb[0].JobMtl_RequiredQty)) + " " + mb[0].JobMtl_IUM;
        }

         //TODO: remove lvl = rj.JobLevel;
        moldid = rj.MoldID;
        molddesc = rj.MoldDesc;
        partid = rj.PartNum;
        partdesc = rj.PartDesc;
        machdesc = rj.MachDesc;
        schedqty = rj.SchedQTY;
        qtytg = rj.QtyToGo;
        timtg = rj.TimeToGo;
        shiftbounds = rj.ShiftBoundsNo;
        setup = rj.SetupTime;
        teardown = rj.TeardownTime;
      }
      const jr = {
        JobLevel: 0,
        JobNum:
          Calculated_JobID != null
            ? Calculated_JobID.replace("100010", "").trim()
            : null,
        MachNo: Number(Calculated_MachNo),
        MachID: Calculated_MachID.trim(),
        MachDesc: machdesc,
        DeptNo: Number(Calculated_DeptNo),
        DeptName: Calculated_DeptDesc.trim(),
        DownNo: Number(Calculated_DownNo),
        DownReason:
          Calculated_DownDesc != null ? Calculated_DownDesc.trim() : null,
        PartNum: partid,
        PartDesc: partdesc,
        MoldID: moldid,
        MoldDesc: molddesc,
        Crewsize: 0,
        MaxCrewsize: 0,
        ToolChanges: 0,
        MaterialChanges: 0,
        SchedQTY: schedqty,
        QtyToGo: qtytg,
        TimeToGo: timtg,
        TimeToGoHHMMSS: this.SecondsTohhmmss(Number(timtg)),
        SetupTime: setup,
        TeardownTime: teardown,
        SchedStart: 0,
        SchedStartDateTime: null,
        SchedEnd: 0,
        SchedEndDateTime: null,
        ShiftBoundsNo: shiftbounds,
        Status: "Current",
        ResinPartNumber: resinPN,
        ResinDesc: resinDesc,
        ResinQty: resinQty,
        MasterbatchPartNumber: mbatchPN,
        MasterbatchDesc: mbatchDesc,
        MasterbatchQty: mbatchQty,
      };

      return jr;
    });

    return this.sortByMachine(arr);
  },

  buildMattecFullJobList: function (
    allMachineJobsArray,
    nextJobsJsonArray,
    resinByJobArray,
    mbatchByJobArray
  ) {
    //map the array of all machines
    let a1 = [];
    for (let i = 0; i < allMachineJobsArray.length; i++) {
      var j = allMachineJobsArray[i];
      //for each machien, filter out upcoming jobs
      const nj = nextJobsJsonArray.filter(
        (j1) => j1.Calculated_MachNo === j.MachNo
      );
      //map upcoming jobs to new array
      const nja = nj.map((nmj) => {
        const {
          Calculated_MachNo,
          Calculated_JobID,
          Calculated_MoldID,
          Calculated_MoldDesc,
          Calculated_PartID,
          Calculated_LvlOfNext,
          Calculated_PartDesc,
          Calculated_MachID,
          Calculated_SchedQty,
          Calculated_qtyToGo,
           //TODO: remove Calculated_timToGo,
          Calculated_DeptNo,
          Calculated_DeptName,
          Calculated_ShiftBoundsNo,
          Calculated_SetupTime,
          Calculated_TearDownTime,
          Calculated_RunTime,
        } = nmj;
        let resinPN = "";
        let resinDesc = "";
        let resinQty = "";
        let mbatchPN = "";
        let mbatchDesc = "";
        let mbatchQty = "";
        let rs = resinByJobArray.filter(
          (r) =>
            r.JobMtl_JobNum ===
            nmj.Calculated_JobID.replace("100010", "").trim()
        );
        let mb = mbatchByJobArray.filter(
          (r) =>
            r.JobMtl_JobNum ===
            nmj.Calculated_JobID.replace("100010", "").trim()
        );

        if (rs.length > 0) {
          resinPN = rs[0].JobMtl_PartNum;
          resinDesc = rs[0].Part_PartDescription;
          resinQty =
            String(Number(rs[0].JobMtl_RequiredQty)) + " " + rs[0].JobMtl_IUM;
        }
        if (mb.length > 0) {
          mbatchPN = mb[0].JobMtl_PartNum;
          mbatchDesc = mb[0].Part_PartDescription;
          mbatchQty =
            String(Number(mb[0].JobMtl_RequiredQty)) + " " + mb[0].JobMtl_IUM;
        }
        const fnmj = {
          JobLevel: Number(Calculated_LvlOfNext),
          JobNum: Calculated_JobID.replace("100010", "").trim(),
          MachNo: Number(Calculated_MachNo),
          MachID: Calculated_MachID.trim(),
          MachDesc: j.MachDesc,
          DeptNo: Number(Calculated_DeptNo),
          DeptName: Calculated_DeptName.trim(),
          PartNum: Calculated_PartID,
          PartDesc: Calculated_PartDesc.trim(),
          MoldID: Calculated_MoldID.trim(),
          MoldDesc: Calculated_MoldDesc.trim(),
          Crewsize: 0,
          SchedQTY: Number(Calculated_SchedQty),
          QtyToGo: Number(Calculated_qtyToGo),
          TimeToGo: Number(Calculated_RunTime),
          TimeToGoHHMMSS: this.SecondsTohhmmss(Number(Calculated_RunTime)),
          SetupTime: Number(Calculated_SetupTime),
          TeardownTime: Number(Calculated_TearDownTime),
          ShiftBoundsNo: Number(Calculated_ShiftBoundsNo),
          SchedStart: 0,
          SchedStartDateTime: null,
          SchedEnd: 0,
          SchedEndDateTime: null,
          Status: "Current",
          ResinPartNumber: resinPN,
          ResinDesc: resinDesc,
          ResinQty: resinQty,
          MasterbatchPartNumber: mbatchPN,
          MasterbatchDesc: mbatchDesc,
          MasterbatchQty: mbatchQty,
        };

        return fnmj;
      });
      //insert original job at start of mapped nexte jobs
      nja.unshift(j);
      //concat the new machine list to the return object
      //nja = this.setStartTimesByMachine(nja, shiftArray, shiftExceptionArray);
      a1 = a1.concat(nja);
    }

    return a1;
  },

  buildMattecShiftList: function (jsonArray) {
     //TODO: remove var tempShiftDef = [];
     //TODO: remove var tempShiftDesc = [];
    //TODO: remove  var ss = 0;
     //TODO: remove var se = 0;

    //this gets sunday at 12:00 am
    const epochDay0 = this.getDay0(new Date()).getTime() / 1000;

    //to get the correct day for shift we need to compensate for when daylight savings
    // moves back 1 hour this makeing Sunday saturday. We add 2 hours to make it sunday 2:00 am
    const epochDay0ShiftDate = epochDay0 + 7200;

    let padZeros = (a) => {
      let s = a + "";
      while (s.length < 2) s = "0" + s;
      return s;
    };

    const arr = jsonArray.map((sh) => {
      const {
        Calculated_ShiftBoundsNo,
        Calculated_DayNo,
        Calculated_WorkingFlag,
        Calculated_ShiftNo,
        Calculated_ShiftName,
        Calculated_StartOffset,
        Calculated_EndOffset,
        Calculated_ShiftBoundsDesc,
        so = Number(Calculated_StartOffset),
        eo = Number(Calculated_EndOffset),
        ss = so + Number(Calculated_DayNo) * 24 * 3600,
        se = eo + Number(Calculated_DayNo) * 24 * 3600,
        ess = epochDay0 + ss,
        ese = epochDay0 + se,
        dss = new Date(1000 * ess),
        dse = new Date(1000 * ese),
        sd = Number(Calculated_DayNo) * 24 * 3600,
      } = sh;
      const v1 = {
        ShiftBoundsNo: Number(Calculated_ShiftBoundsNo),
        ShiftBoundsDesc: Calculated_ShiftBoundsDesc.trim(),
        Day: Number(Calculated_DayNo),
        WorkingFlag: Number(Calculated_WorkingFlag),
        ShiftNo: Number(Calculated_ShiftNo),
        ShiftName: Calculated_ShiftName.trim(),
        StartOffset: Number(Calculated_StartOffset),
        EndOffset: Number(Calculated_EndOffset),
        ShiftDate: epochDay0ShiftDate + sd,
        ShiftDateDate: new Date(
          (epochDay0ShiftDate + sd) * 1000
        ).toLocaleDateString(), //the date represented by the shift definition in mattec

        ShiftStartWeek: ss,
        ShiftEndWeek: se,
        ShiftStart: ess,
        ShiftEnd: ese,
        ShiftStartDateTime: dss,
        ShiftEndDateTime: dse,
        ShiftSeq: Number(
          String(dss.getFullYear()) +
            this.getPaddedValue(dss.getMonth() + 1, 2) +
            this.getPaddedValue(dss.getDate(), 2) +
            Calculated_ShiftNo
        ),
      };
      return v1;
    });

    const noShiftDefs = arr.length - 1;

    for (var wk = 1; wk <= 8; wk++) {
      for (var di = 0; di < noShiftDefs; di++) {
        const v = {};
        v["ShiftBoundsNo"] = arr[di]["ShiftBoundsNo"];
        v["ShiftBoundsDesc"] = arr[di]["ShiftBoundsDesc"];
        v["Day"] = arr[di]["Day"];
        v["WorkingFlag"] = arr[di]["WorkingFlag"];
        v["ShiftNo"] = arr[di]["ShiftNo"];
        v["ShiftName"] = arr[di]["ShiftName"];
        v["StartOffset"] = arr[di]["StartOffset"];
        v["EndOffset"] = arr[di]["EndOffset"];

        //add 7 days worth of hours to the previous
        v["ShiftDate"] = arr[di]["ShiftDate"] + 168 * wk * 3600;
        v["ShiftStartWeek"] = arr[di]["ShiftStartWeek"] + 168 * wk * 3600;
        v["ShiftEndWeek"] = arr[di]["ShiftEndWeek"] + 168 * wk * 3600;

        v["ShiftDateDate"] = new Date(v.ShiftDate * 1000).toLocaleDateString();

        v["ShiftStart"] = epochDay0 + v.ShiftStartWeek;
        v["ShiftEnd"] = epochDay0 + v.ShiftEndWeek;
        v["ShiftStartDateTime"] = new Date(1000 * v.ShiftStart);
        v["ShiftEndDateTime"] = new Date(1000 * v.ShiftEnd);
         //TODO: remove let a = v.ShiftStartDateTime;

        v["ShiftSeq"] = Number(
          String(v.ShiftStartDateTime.getFullYear()) +
            padZeros(v.ShiftStartDateTime.getMonth() + 1) +
            padZeros(v.ShiftStartDateTime.getDate()) +
            String(v.ShiftNo)
        );
        arr.push(v);
      }
    }

    return arr;
  },

  buildMattecShiftExceptionList: function (jsonArray) {
    // Calculated_RecordNo: 3477
    // Calculated_MachNo: null
    // Calculated_MachID: null
    // Calculated_DeptNo: null
    // Calculated_DeptName: null
    // Calculated_ShiftSeq: 202004100
    // Calculated_AllDayFlag: 1
    // Calculated_WorkingFlag: 0
    const arr = jsonArray.map((sh) => {
      const {
        Calculated_RecordNo,
        Calculated_MachNo,
        Calculated_MachID,
        Calculated_DeptNo,
        Calculated_DeptName,
        Calculated_ShiftSeq,
        Calculated_AllDayFlag,
        Calculated_WorkingFlag,
      } = sh;
      const v1 = {
        RecordNo: Calculated_RecordNo,
        MachNo: Calculated_MachNo,
        MachID: Calculated_MachID != null ? Calculated_MachID.trim() : null,
        DeptNo: Calculated_DeptNo,
        DeptName:
          Calculated_DeptName != null ? Calculated_DeptName.trim() : null,
        ShiftSeq: Calculated_ShiftSeq,
        AllDayFlag: Calculated_AllDayFlag,
        WorkingFlag: Calculated_WorkingFlag,
      };
      return v1;
    });
    return arr;
  },

  filterJobList: function (aja, nja, msa, msea, cell, mc, sd, sr, sn, np) {
    let finalJobArray = _.cloneDeep(aja); //initially populate with a list of all machinejobs.
    let finalNextJobsArray = _.cloneDeep(nja); //initially popuklte next jobs from complete list

    let tmpArray = []; //create holding array to filter into and right out from

    //first of all filer out all machine jobs in down state if selected
    if (!np) {
       //TODO: remove  const rc = this.downReasonCodes();
      tmpArray = finalJobArray.filter(
        (job) => this.downReasonCodes().indexOf(job.DownReason) < 0
      );

      //now copy tmparray into return array
      finalJobArray = tmpArray.filter((job) => job.JobNum != null);
    }

    //now filter out mc's based on cell selection
    //use JobID!=null as this will include all jobs but using filter does a full copy rather than a ref copy

    if (cell !== "") {
      const cellSearch = "," + String(cell) + ",";
      tmpArray = finalJobArray.filter(
        (job) => cellSearch.indexOf("," + String(job.DeptNo) + ",") !== -1
      );
      //now copy tmparray into return array
      finalJobArray = tmpArray.filter((job) => job.JobNum != null);
      //and repaet for next jobs
      tmpArray = finalNextJobsArray.filter(
        (job) => cellSearch.indexOf("," + String(job.DeptNo) + ",") !== -1
      );
      finalNextJobsArray = tmpArray.filter((job) => job.JobNum != null);
    }

    if (mc !== "") {
      tmpArray = finalJobArray.filter((job) => job.MachNo === Number(mc));
      //now copy tmparray into return array
      finalJobArray = tmpArray.filter((job) => job.JobNum != null);
      //and repeat for next jobs
      tmpArray = finalNextJobsArray.filter((job) => job.MachNo === Number(mc));
      //now copy tmparray into return array
      finalNextJobsArray = tmpArray.filter((job) => job.JobNum != null);
    }

    //now we have a list of the current machines by their jobs
    //1st step is to get a full array of all current and upcoming jobs

    //if requyired now filter on date range
    let nj = [];
    if (sn !=="") {
      //get teh shift required

      for (let i = 0; i < finalJobArray.length; i++) {
        const j = finalJobArray[i];
        //create a ref to the jobid
        const jn = j.JobNum;
        //now blank it in teh job.
        //we will put it back later if valid shifts are found
        j.JobNum = null;

        //get a list of shifts foer this machine
        const machineShifts = this.getMcValidShiftList(
          j.MachID,
          j.DeptNo,
          j.ShiftBoundsNo,
          msa,
          msea
        );
        //check if the selected date is a valid shift for this machine

        let targetshift;
        let selDate = String(sd).substr(0, String(sd).indexOf(",")); //picker in react has , returnd, not in native so need to handle
        if (selDate === "") {
          selDate = sd;
        }

        selDate = new Date(selDate).toLocaleDateString();
        //console.log("Picked date :" + sd);
        for (let x = 0; x < machineShifts.length; x++) {
          const ms = machineShifts[x];
          const mcsd = ms.ShiftDateDate;
          const mcsn = ms.ShiftName;
          const mcsr = ms.ShiftBoundsDesc;
          if (mcsd === selDate && sn === mcsn && sr === mcsr) {
            targetshift = ms;
          }
          //exit loop when shift found by seeting the ncrement to the array length
          if (targetshift != null) x = machineShifts.length;
        }
         //TODO: remove  let arr = [];
        if (targetshift != null) {
          //if we have a valid shift, build array of jobs that occur in it\//first put teh job ID back in teh the
          //machinejob list so it doesn'r get filtered out
          j.JobNum = jn;
          for (let x = 0; x < finalNextJobsArray.length; x++) {
            nj = finalNextJobsArray[x];
            //store the job number to put back later if this job fits
            //then blank the id
            let njn = nj.JobNum;
            nj.JobNum = null;
            //If job start and end time before target shift ignore
            if (
              nj.SchedStart < targetshift.ShiftStart &&
              nj.SchedEnd < targetshift.ShiftStart
            ) {
            } //if job start and end time after target shift ignore
            else if (
              nj.SchedStart > targetshift.ShiftEnd &&
              nj.SchedEnd > targetshift.ShiftEnd
            ) {
            } else {
              //job  must cross shift start, shift end, occur with shift or start before and end after shift
              //put the job number back so teh filter at the end selectcts this
              nj.JobNum = njn;
            }
          }
        }
        //push arr to return final jobs array
      }
    }

    //if we have invalidated any jobs, filter them now

    let retarray = [];
    retarray.push(finalJobArray.filter((j) => j.JobNum != null));
    retarray.push(finalNextJobsArray.filter((j) => j.JobNum != null));

    return retarray;
  },

  //generic help scripts
  getDay0: function (d) {
    d = new Date(d);
    var day = d.getDay();
    var diff = d.getDate() - day; // adjust when day is sunday
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return new Date(d.setDate(diff));
  },

  setStartTimesByMachine: function (jobList, shiftArray, shiftExceptionArray) {
    const startJob = jobList[0];
    if (startJob.JobNum === null || startJob.JobNum === "null") return jobList;
    //get time stamp to mark when the script started and to pass as start time to 1st job if
    //in current shift

    let scriptStart = Math.floor(new Date().getTime() / 1000.0);

    //get the machine ID from the 1st array item
    const machID = startJob.MachID;
    const deptNo = startJob.DeptNo;
    const jobSBN = startJob.ShiftBoundsNo; //get a referebnce to the shiftbounds of this machine by rferecong teh 1st job on the mc

    const machineShifts = this.getMcValidShiftList(
      machID,
      deptNo,
      jobSBN,
      shiftArray,
      shiftExceptionArray
    );
    //now we have a list of shift that are on we can loop to get times
    //declar variable to hold new job start time after each job changes its end time

    //get a mark time for the 1st job to start
    let newJobStart = scriptStart;

    for (let i = 0; i < jobList.length; i++) {
      let job = jobList[i];
      let nextJob;
      let prevJob;
      //get prev and  next job for tool comparison. use try as will error on first (prev) and last (next)
      try {
        nextJob = jobList[i + 1];
      } catch {}

      try {
        prevJob = jobList[i - 1];
      } catch {}

      //now set the 1st job to its start tim.

      //if the 1st shift starttime is greater than teh scipt start time,
      //this must mean we are not in the current shift due to previous filter
      //and we need to set the starttime to the beginning of the 1st valied

      //if first run newjob start is either when the script started or teh start of the 1st valid shift
      //if later runs it will be set to teh end of teh previius job at teh end of this loop
      const firstShift = machineShifts[0];
      if (firstShift.ShiftStart > newJobStart)
        newJobStart = firstShift.ShiftStart;

      //Set the jobs prelimary times, end time will likely change as the shifts are looped
      job.SchedStart = newJobStart;
      job.SchedStartDateTime = new Date(newJobStart * 1000).toLocaleString();
      //reset anticipated end date
      job.SchedEnd = job.SchedStart + job.TimeToGo;
      job.SchedEndDateTime = new Date(job.SchedEnd * 1000).toLocaleString();

      //see JSON_Resturns
      let runtimeLeft = job.TimeToGo;

      //sort out if setup/teardown required
      let prevTool;
      if (prevJob !== undefined) prevTool = prevJob.MoldID;
      let currTool = job.MoldID;

      let nextTool;
      if (nextJob !== undefined) nextTool = nextJob.MoldID;

      //if prevtool = currtool or first (current) job then no setup required
      if (prevTool !== undefined && prevTool === currTool) {
        runtimeLeft -= Number(job.SetupTime);
      }

      //if nexttool = currtool or last job then no teardown required
      if (nextTool !== undefined && nextTool === currTool) {
        runtimeLeft -= Number(job.TeardownTime);
      }
      /* */
      //now loop through the machine shifts and set times

      let timeInShift = 0;
      for (var x = 0; x < machineShifts.length; x++) {
        let mcShift = machineShifts[x];

        //check if this is the shift bridging the start time
        if (
          job.SchedStart >= mcShift.ShiftStart &&
          job.SchedStart < mcShift.ShiftEnd
        ) {
          timeInShift = mcShift.ShiftEnd - job.SchedStart;
          runtimeLeft = runtimeLeft - timeInShift;
          job.SchedEnd = mcShift.ShiftEnd + runtimeLeft;
        } else if (
          //check if this shift is between  the start time and end time of the job
          job.SchedStart <= mcShift.ShiftStart &&
          job.SchedEnd > mcShift.ShiftEnd
        ) {
          timeInShift = mcShift.ShiftEnd - mcShift.ShiftStart;
          runtimeLeft = runtimeLeft - timeInShift;
          job.SchedEnd = mcShift.ShiftEnd + runtimeLeft;
        } else if (
          //check if this is the shift bridging the end time
          //mcShift.ShiftStart < job.SchedEnd &&
          mcShift.ShiftEnd > job.SchedEnd
        ) {
          //set the end time of the job
          job.SchedEnd = mcShift.ShiftStart + runtimeLeft;
          //set runtime to 0 to exit the shift loop
          runtimeLeft = 0;
        }

        if (runtimeLeft === 0) {
          job.SchedEndDateTime = new Date(job.SchedEnd * 1000).toLocaleString();
          newJobStart = job.SchedEnd;
          break;
        }
      }

      //console.log("Jbs Done");
    }

    const retJobs = jobList.filter((s) => s.ShiftBoundsNo !== 0);
    return retJobs;
  },

  addMachineSummaries: function (allJobs, nextJobs, erpJobs) {
    //as arrays are referenced updateing here updates the original
     //TODO: remove const reasoncodes = this.downReasonCodes();

    for (let i = 0; i < allJobs.length; i++) {
      const machJob = allJobs[i];
      //TODO: remove  let jobID = machJob.JobNum;

       //TODO: remove const downReason = machJob.DownReason;
      machJob.MaxCrewsize = 0;
      machJob.ToolChanges = 0;
      machJob.MaterialChanges = 0;

      const machiID = machJob.MachID;
      //get next jobs for this mc
      const nja = nextJobs.filter((job) => job.MachID === machiID);
      //get ERP job for current mattec one
       //TODO: remove  const ej = erpJobs.filter((job) => job.JobNum === jobID);
      let maxCrew = 0;
      let thisCrew = 0;

      let tc = 0;
      let mc = 0;

      //as the next jobs array include all jobs, onkly need maxcrewsize calcs here
      for (let x = 0; x < nja.length; x++) {
        const nj = nja[x];
        const nJobNum = nj.JobNum;
        const ej2 = erpJobs.filter((job) => job.JobNum === nJobNum);
        thisCrew = 0;
        //if we find a job and its crew size is bigger than current max, set max to it
        for (const j of ej2) {
          if (j.Crewsize > thisCrew) {
            thisCrew = j.Crewsize;
          }
        }
        if (thisCrew > maxCrew) maxCrew = thisCrew;

        if (x > 0) {
          //if we're not on the 1st loop
          if (nj.MasterbatchPartNumber !== nja[x - 1].MasterbatchPartNumber) {
            mc++;
          }
          if (nj.MoldID !== nja[x - 1].MoldID) {
            tc++;
          }
        }

        nj.Crewsize = thisCrew;
      }

      //only set the max crew size if the machine is set to run
      machJob.MaxCrewsize = maxCrew;
      machJob.ToolChanges = tc;
      machJob.MaterialChanges = mc;
    }
    return null;
  },

  getPaddedValue: function (origValue, finishedLen) {
    let s = origValue + "";
    while (s.length < finishedLen) s = "0" + s;
    return s;
  },

  sortByMachine: function (responseData) {
    const sorted = responseData.sort((a, b) => {
      return a.MachID < b.MachID ? -1 : a.MachID > b.MachID ? 1 : 0;
    });
    return sorted;
  },

  downReasonCodes: function () {
    return ["Not Scheduled to Run"];
  },

  getMcValidShiftList: function (
    machID,
    deptNo,
    shiftBoundsNo,
    shiftArray,
    shiftExceptionArray
  ) {
    //clone teh arrays to prevent refernce updates to original
    const sa = _.cloneDeep(shiftArray);
    const sea = _.cloneDeep(shiftExceptionArray);

    //filter out shifts for this machine and filter out prevuius ones
    //this shoudl ensure the 1st shift is either the current onemptied, or the next valid
    const scriptStart = Math.floor(new Date().getTime() / 1000.0);
    const shifts = sa.filter(
      (s) => s.ShiftBoundsNo === shiftBoundsNo && s.ShiftEnd > scriptStart
    );

    let exceptions = [];

    //get plant exception
    const plantShiftExceptions = sea.filter(
      (s) => s.MachID === null && s.DeptNo === null
    );
    exceptions = exceptions.concat(plantShiftExceptions);

    //get dept exceptions
    const deptShiftExcpetions = sea.filter((s) => s.DeptNo === deptNo);
    exceptions = exceptions.concat(deptShiftExcpetions);

    //get Machine exceptions
    const machineShiftExceptions = sea.filter(
      (s) => s.MachID != null && s.MachID === machID
    );
    exceptions = exceptions.concat(machineShiftExceptions);

    //mark shift exceptions in  the shift definitiions setting working flag to 0
    for (var i = 0; i < shifts.length; i++) {
      let shift = shifts[i];

       //TODO: remove let shiftSeq = shift.ShiftSeq;

      for (var x = 0; x < exceptions.length; x++) {
        let exception = exceptions[x];
        let exceptionShiftSeq = exception.ShiftSeq;
        //if all day flag and date are equal then change work flag if sßhift seq date portion matches
        if (
          exception.AllDayFlag === 1 &&
          String(exceptionShiftSeq).substring(0, 8) ===
            String(shift.ShiftSeq).substring(0, 8)
        ) {
          shift.WorkingFlag = exception.WorkingFlag;
        } else {
          if (exceptionShiftSeq === shift.ShiftSeq) {
            shift.WorkingFlag = exception.WorkingFlag;
          }
        }
      }
    }

    //We now have a list of shifts so we can filter out ones that are applicable to this machgine
    const machineShifts = shifts.filter(
      (s) => s.ShiftBoundsNo === shiftBoundsNo && s.WorkingFlag === 1
    );
    return machineShifts;
  },

  SecondsTohhmmss: function (totalSeconds, includeSeconds) {
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds - hours * 3600) / 60);
    var seconds = totalSeconds - hours * 3600 - minutes * 60;

    // round seconds
    seconds = Math.round(seconds * 100) / 100;

    var result = hours < 10 ? "0" + hours : hours;
    result += ":" + (minutes < 10 ? "0" + minutes : minutes);
    if (includeSeconds) {
      result += ":" + (seconds < 10 ? "0" + seconds : seconds);
    }
    return result;
  },

  getCellsFromRT: function (rtArray) {
    //get array with uniqie Field
    let tmpArr = [
      ...new Map(rtArray.map((item) => [item["DeptNo"], item])).values(),
    ];

    // showNonProd
    //   ? (tmpArr = tmpArr)
    //   : (tmpArr = tmpArr.filter((j) => j.DownNo != 56));

    tmpArr = tmpArr.map((rt) => ({
      DeptNo: rt.DeptNo,
      DeptDesc:typeof rt.DeptDesc != 'undefined' ? rt.DeptDesc.replace(
        "Airport Site",
        ""
      ).trim() /*.replace(/\s/g, "")*/: rt.DeptNo.toString(),
    }));

    console.log(tmpArr);
    tmpArr = tmpArr.sort(this.deptSort);

    return tmpArr;
  },

  getCellsFromRTbyCellFilter: function (rtArray, filter, downfilters) {

    let tmpArr;

    filter.length === 0
      ? (tmpArr = rtArray.map((rt) => rt))
      : (tmpArr = rtArray.filter((c) => filter.includes(c.DeptNo.toString())));

    if (downfilters.length > 0) {
      if (tmpArr.length > 0) {
        tmpArr = tmpArr.filter((c) => !downfilters.includes(c.DownNo));
        //console.log (myArr)
      }
    }

    tmpArr = tmpArr.map((rt) => {
      const obj = Object.assign({}, rt);
      obj["DeptDesc"] = obj["DeptDesc"]
        .replace("Airport Site", "")
        .trim(); /*.replace(/\s/g, "")*/
      return obj;
    });
    tmpArr = tmpArr.sort(this.deptSort); 

    return tmpArr;
  },

  getSortedMachineList: function (inArray) {
    let tmpArr = [
      ...new Map(inArray.map((item) => [item["MachNo"], item])).values(),
    ];
    tmpArr = tmpArr.sort(this.machineSort);
    return tmpArr;
  },
  deptSort(a, b) {
    if (a.DeptDesc < b.DeptDesc) {
      return -1;
    }
    if (a.DeptDesc > b.DeptDesc) {
      return 1;
    }
    return 0;
  },

  machineSort(a, b) {
    if (a.MachID < b.MachID) {
      return -1;
    }
    if (a.MachID > b.MachID) {
      return 1;
    }
    return 0;
  },
};
