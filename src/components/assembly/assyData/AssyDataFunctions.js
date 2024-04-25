//combination of old Jobslist.js and cells.js
import {
        generalFunctions,
        operationsFunctions,
        axiosConfigs,
      } from "../../../helpers/HelperScripts";


export const AssyData ={

    assyCells: function (dataset) {
        var tmpAssyCells = [];

        dataset.length === 0
          ? (tmpAssyCells = [])
          : (tmpAssyCells = dataset.filter(c => c.UDCodes_LongDesc ==='ASPK').map((c) => {
              let renamedC = {
                cellID: c.UDCodes_CodeID,
                cellDesc: c.UDCodes_CodeDesc,
              };
              return renamedC;
            }));
        return tmpAssyCells;
      },
      
      
       assyJobs :function(datasets,line,job)  {
        var assyJobs = [];
        var tempAssyJobs = [];
        var tempSetup = [];
        var tempProd = [];
        var tempSetupComplete = [];
        var tempProdComplete = [];
        var tempLabourDtl = [];
        var lowStock = [];
        var binStock = [];
        var jobEfficiency = 0.0;
        var currentActivity = undefined;
        let lineParam = line;
        let jobParam = job;
        let getAssyJobs = {};
      
        // let getLowStock = await Axios.get(
        //   `${baseURL}/BaqSvc/ASSY_JobStockCheck/?$filter=enoughStock%20eq%20false`,
        //   axiosConfigs.config("GET")
        // );
        // let getLowStock = datasets 

        let retLowStock = datasets.jobstockcheck.filter(j => j.enoughStock == false );
   
        //get all assy cells
        let tempLowStock = retLowStock.map((s) => {
          let renamedS = {
            job: s.JobNum,
            part: s.PartNum,
          };
          return renamedS;
        });
        lowStock = tempLowStock;
     
        // let getBinStock = await Axios.get(
        //   `${baseURL}/BaqSvc/ASSY_BinStockCheck`,
        //   axiosConfigs.config("GET")
        // );
        // let retBinStock = getBinStock.data;
        let tempBinStock = datasets.binstockcheck.map((s) => {
          let renamedS = {
            job: s.JobNum,
            part: s.PartNum,
            bin: s.BinNum,
            onHand: s.OnhandQty,
            uom: s.IUM,
            stockLevel: s.sbStockLevel,
          };
          return renamedS;
        });
        binStock = tempBinStock;
      
       //list jobs and indicate if low stock and if setup is complete
        if (lineParam === undefined && jobParam === undefined) {
        //   getAssyJobs = await Axios.get(
        //     `${baseURL}/BaqSvc/GEN_JobsDashboard/?$filter=JCDept%20eq%20'ASPK'`,
        //     axiosConfigs.config("GET")
        //   );
         getAssyJobs = datasets.jobs.filter(j => j.JCDept == 'ASPK')}

        else if (lineParam === undefined) {
        //   getAssyJobs = await Axios.get(
        //     `${baseURL}/BaqSvc/GEN_JobsDashboard/?$filter=JCDept%20eq%20'ASPK'%20and%20JobNum%20eq%20'${jobParam}'`,
        //     axiosConfigs.config("GET")
        //   );
        getAssyJobs = datasets.jobs.filter(j => j.JCDept == 'ASPK' && j.JobNum =={job} )
        } else {
        //   getAssyJobs = await Axios.get(
        //     `${baseURL}/BaqSvc/GEN_JobsDashboard/?$filter=JCDept%20eq%20'ASPK'%20and%20ResourceID%20eq%20'${lineParam}'`,
        //     axiosConfigs.config("GET")
        //   );
        getAssyJobs = datasets.jobs.filter(j => j.JCDept == 'ASPK' && j.JobNum =={job} && j.ResourceID == {line})
        }
        //list the jobs with setup complete
        // let getLabourDtl = await Axios.get(
        //   `${baseURL}/BaqSvc/ASSY_LabourDtl`,
        //   axiosConfigs.config("GET")
        // );
      
        let getLabourDtl = datasets.labourdtl;
        
          //get active labour for jobs
        // let getActiveLabour = await Axios.get(
        //   `${baseURL}/BaqSvc/ASSY_ActiveLabor`,
        //   axiosConfigs.config("GET")
        // );
        var tempActiveLabour = datasets.activelabour;
      
      //JobNum with setup and prod labour dtls
        if (getLabourDtl.length > 0) {
        //   tempLabourDtl = getLabourDtl.data;
          tempSetup = getLabourDtl.filter((a) => a.LaborType === "S");
          tempSetupComplete = tempSetup.filter((a) => a.Complete);
          tempProd = getLabourDtl.filter((a) => a.LaborType === "P");
          tempProdComplete = tempProd.filter((a) => a.Complete);
        }
        
        if (getAssyJobs.length > 0) {
         
          tempAssyJobs = getAssyJobs.map((e) => {
            var lastPartialPalletCompleted = 0;
      
            var jobLabourDtl = tempLabourDtl.filter(
              (l) => l.JobNum === e.JobNum
            );
      
            var stdPalletQty = Number(e.QtyPerPallet);
            var qtyReceived = Number(e.JobProd_ReceivedQty);
      
            var fullPalCompCount = Math.floor(
              e.QtyCompleted / stdPalletQty
            );
            var fullPalRcvdCount = Math.floor(qtyReceived / stdPalletQty);
            var partialQtyRecvd = qtyReceived - fullPalRcvdCount * stdPalletQty;
      
            var lastFullPalletRcvd = jobLabourDtl.filter(
              (l) =>
                l.JobNum === e.JobNum &&
                l.LaborQty === e.QtyPerPallet_c
            );
      
            lastPartialPalletCompleted =
              Number(e.QtyCompleted) -
              Number(fullPalCompCount) * Number(stdPalletQty);
      
            var qtyReqdPallet =
              e.QtyCompleted === e.ProdQty
                ? 0
                : Number(e.WIPQty) + Number(lastPartialPalletCompleted) <
                  Number(stdPalletQty)
                ? e.WIPQty
                : Number(stdPalletQty);
            // : stdPalletQty - lastPartialPalletCompleted;
      
            var prodStartDate = generalFunctions.composeDateTime(
              new Date(e.attecStartDate),
              "customTime",
              e.MattecStartHour
            );
            var prodEndDate = generalFunctions.composeDateTime(
              new Date(e.MattecEndDate),
              "customTime",
              e.MattecEndHour
            );
            var setup = tempSetup.filter(
              (s) => s.JobNum === e.obNum
            );
            var setupComplete = tempSetupComplete.filter(
              (s) => s.JobNum === e.obNum
            );
            var setupStartDateTime = prodStartDate;
            var tempSetupEndDateTime = new Date(prodStartDate);
            let setupEndHour = tempSetupEndDateTime.getHours();
            let setupEndMin = tempSetupEndDateTime.getMinutes();
            tempSetupEndDateTime.setHours(
              setupEndHour,
              setupEndMin + e.EstSetHours * 60
            );
            if (setup.length > 0) {
              var lastSetupIndex = setup.length - 1;
              var lastSetupObj = setup[lastSetupIndex];
              setupStartDateTime = generalFunctions.composeDateTime(
                new Date(lastSetupObj.ClockInDate),
                "custom",
                lastSetupObj.ClockinTime
              );
              tempSetupEndDateTime = new Date(setupStartDateTime);
              let setupEndHour = tempSetupEndDateTime.getHours();
              let setupEndMin = tempSetupEndDateTime.getMinutes();
              tempSetupEndDateTime.setHours(
                setupEndHour,
                setupEndMin + e.EstSetHours * 60
              );
            }
            var setupEndDateTime = generalFunctions.composeDateTime(
              tempSetupEndDateTime,
              "dateTime"
            );
            var prod = tempProd.filter((s) => s.JobNum === e.JobNum);
      
            let totLaborQty = prod.reduce(function (total, dtl) {
              return total + +dtl.LaborQty;
            }, 0);
      
            let stdManHours = parseFloat(
              (e.ProdCrewSize * (totLaborQty / e.ProdStd)) / 60
            ).toFixed(2);
      
            let actualManHours = parseFloat(
              prod.reduce(function (total, dtl) {
                return total + +dtl.LaborHrs;
              }, 0)
            ).toFixed(2);
            if (stdManHours > 0) {
              jobEfficiency = parseFloat(
                (stdManHours / actualManHours) * 100
              ).toFixed(2);
            } else {
              jobEfficiency = 0.0;
            }
      
            var convTimeLeft = parseFloat(e.TimeLeft).toFixed(2);
      
            var partBinStockLevel = binStock.filter(
              (s) => s.job === e.JobNum
            )[0];
      
            let activeLabour = tempActiveLabour.filter(
              (a) => a.JobNum === e.JobNum
            );
            if (activeLabour.length > 0) {
              currentActivity = activeLabour[0].LaborType;
            } else {
              currentActivity = undefined;
            }
            let renamedE = {
              dept: e.JCDept,
              deptDesc: e.JCDept_Description,
              cellID: e.Cell_c,
              lineID: e.ResourceID,
              lineDesc: e.Description,
              jobNum: e.JobNum,
              partNum: e.PartNum,
              partDesc: e.PartDescription,
              opSeq: e.OprSeq,
              asSeq: e.AssemblySeq,
              resGrp: e.ResourceGrpID,
              resGrpDesc: e.Description,
              op: e.OpCode,
              opDesc: e.OpDesc,
              labRate: e.SetupLabRate,
              constraint: operationsFunctions.stockCheck(
                e.JobNum,
                tempLowStock
              ),
              binStockLevel:
                partBinStockLevel === undefined
                  ? "none"
                  : partBinStockLevel.stockLevel,
              qtyReqd: e.ProdQty,
              qtyDone: e.QtyCompleted,
              qtyLeft: e.WIPQty,
              qtyReqdPerPallet: qtyReqdPallet,
              qtyPerPallet: e.QtyPerPallet_c,
              qtyPerCtn: e.QtyPerCarton_c,
              qtyPartialReceipt: partialQtyRecvd,
              qtyReceived: qtyReceived,
              palletQty: stdPalletQty,
              timeLeft: convTimeLeft,
              uom: e.IUM,
              startDate: prodStartDate,
              endDate: prodEndDate,
              setupCrewSize: e.SetUpCrewSize,
              setUpStartDateTime: setupStartDateTime,
              setUpEndDateTime: setupEndDateTime,
              setupIsComplete: setupComplete.some(
                (l) => l.JobNum === e.JobNum
              )
                ? "YES"
                : "NO",
              setUpHours: e.EstSetHours,
              prodCrewSize: parseFloat(e.ProdCrewSize).toFixed(2),
              prodStd: parseFloat(e.ProdStd).toFixed(2), // pc/min
              InBin: e.InputBinNum,
              outWhse: e.OutputWhse,
              outBin: e.OutputBinNum,
              setupDtl: setup,
              prodDtl: prod,
              lastPartialQtyBooked: lastPartialPalletCompleted,
              lastFullQtyBooked:
                lastFullPalletRcvd.length > 0
                  ? parseInt(
                      lastFullPalletRcvd[lastFullPalletRcvd.length - 1]
                        .LaborQty
                    ).toFixed(2)
                  : 0,
              jobLabourDtl: jobLabourDtl,
              jobEfficiency: jobEfficiency,
              currentActivity: currentActivity,
            };
            return renamedE;
          });
        }
        assyJobs = tempAssyJobs;
        return assyJobs;
      }
}