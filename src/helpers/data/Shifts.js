//use this to get all shifts
import Axios from "axios";
import { baseURL } from "../../ConnectionBroker";
import { axiosConfigs, generalFunctions } from "../HelperScripts";

const shifts = async () => {
  var shifts = [];
  var duration = 0;

  let getShifts = await Axios.get(
    `${baseURL}/BaqSvc/GEN_Shift`,
    axiosConfigs.config("GET")
  );
  let retShifts = getShifts.data.value;
  console.log("GEN_Shift results:", retShifts);

  let tempShifts = retShifts.map((s) => {
    var start = parseFloat(s.JCShift_StartTime);
    var end = parseFloat(s.JCShift_EndTime);
    var actualStartDateTime = new Date();
    var actualEndDateTime = new Date();
    var offsetStartDateTime = new Date();
    var offsetEndDateTime = new Date();
    var today = new Date();
    var actualStart;
    var offsetStart;
    var actualEnd;
    var offsetEnd;

    if (end > start) {
      //when shift ends in the same day
      duration = (end - start).toFixed(2);
    } else {
      //when shift ends the next day
      duration = (end + parseFloat(24.0) - start).toFixed(2);
    }

    // get hour and minute equivalents of decimal duration
    let startTimeHour = parseInt(s.JCShift_StartTime.split(".")[0]);
    let startTimeMinute = parseInt(s.JCShift_StartTime.split(".")[1]) * 0.6;
    let durationHour = parseInt(duration.toString().split(".")[0]);
    let durationMinute = parseInt(duration.toString().split(".")[1]) * 0.6;
    let endTimeHour = startTimeHour + durationHour;
    if (endTimeHour >= 24) {
      endTimeHour -= 24;
    }
    let endTimeMinute = startTimeMinute + durationMinute;

    // Monday - Sunday : 1 - 7
    let daysToSaturday = Math.abs(6 - today.getDay());
    let daysToSunday = Math.abs(7 - today.getDay());

    switch (s.JCShift_Shift) {
      case 8:
        actualStartDateTime.setDate(today.getDate() + daysToSaturday);
        actualEndDateTime.setDate(today.getDate() + daysToSaturday);
        offsetStartDateTime.setDate(today.getDate() + daysToSaturday);
        offsetEndDateTime.setDate(today.getDate() + daysToSaturday);
        offsetStart = offsetStartDateTime.setHours(
          startTimeHour,
          startTimeMinute - (durationMinute + 90),
          0
        );
        offsetEnd = offsetEndDateTime.setHours(
          endTimeHour,
          endTimeMinute - 90,
          0
        );
        actualStart = actualStartDateTime.setHours(
          startTimeHour,
          startTimeMinute,
          0
        );
        actualEnd = actualEndDateTime.setHours(endTimeHour, endTimeMinute, 0);
        break;
      case 9:
        actualStartDateTime.setDate(today.getDate() + daysToSunday);
        actualEndDateTime.setDate(today.getDate() + daysToSunday);
        offsetStartDateTime.setDate(today.getDate() + daysToSunday);
        offsetEndDateTime.setDate(today.getDate() + daysToSunday);
        offsetStart = offsetStartDateTime.setHours(
          startTimeHour,
          startTimeMinute - (durationMinute + 90),
          0
        );
        offsetEnd = offsetEndDateTime.setHours(
          endTimeHour,
          endTimeMinute - 90,
          0
        );
        actualStart = actualStartDateTime.setHours(
          startTimeHour,
          startTimeMinute,
          0
        );
        actualEnd = actualEndDateTime.setHours(endTimeHour, endTimeMinute, 0);
        break;
      default:
        if (end < start) {
          // Shift crosses over midnight
          if (
            today.getHours() <= endTimeHour &&
            today.getHours() < startTimeHour
          ) {
            // Currently after midnight & before shift end-time, so set start-date to yesterday
            actualStartDateTime.setDate(today.getDate() - 1);
            offsetStartDateTime.setDate(today.getDate() - 1);
          } else if (today.getHours() > endTimeHour) {
            // Currently before midnight, so set end-date to tomorrow
            actualEndDateTime.setDate(today.getDate() + 1);
            offsetEndDateTime.setDate(today.getDate() + 1);
          }
        }
        offsetStart = offsetStartDateTime.setHours(
          startTimeHour,
          startTimeMinute - (durationMinute + 90),
          0
        );
        offsetEnd = offsetEndDateTime.setHours(
          endTimeHour,
          endTimeMinute - 90,
          0
        );
        actualStart = actualStartDateTime.setHours(
          startTimeHour,
          startTimeMinute,
          0
        );
        actualEnd = actualEndDateTime.setHours(endTimeHour, endTimeMinute, 0);
    }

    offsetStart = offsetStartDateTime;
    offsetEnd = offsetEndDateTime;
    actualStart = actualStartDateTime;
    actualEnd = actualEndDateTime;

    console.log(
      `Shift: ${s.JCShift_Shift} (${s.JCShift_Description}) ~ actualStart: ${actualStart} ~ actualEnd: ${actualEnd}`
    );

    let renamedS = {
      shiftID: s.JCShift_Shift,
      shiftDesc: s.JCShift_Description,
      startTime: generalFunctions.convertHoursToHhmm(s.JCShift_StartTime),
      endTime: generalFunctions.convertHoursToHhmm(s.JCShift_EndTime),
      startDateTimeActual: actualStart,
      endDateTimeActual: actualEnd,
      startDateTimeOffset: offsetStart,
      endDateTimeOffset: offsetEnd,
      endOffset: generalFunctions.convertHoursToHhmm(s.JCShift_EndTime - 1.5),
    };
    return renamedS;
  });
  shifts = tempShifts;

  return shifts;
};
export default shifts;

// let tempShifts = retShifts.map((s) => {
//   console.log("shift", s.JCShift_Shift, s.JCShift_Description);
//   var start = parseFloat(s.JCShift_StartTime);
//   var end = parseFloat(s.JCShift_EndTime);
//   var actualStartDateTime = new Date();
//   var actualEndDateTime = new Date();
//   var offsetStartDateTime = new Date();
//   var offsetEndDateTime = new Date();
//   var saturdayActualStartDateTime = new Date();
//   var saturdayActualEndDateTime = new Date();
//   var saturdayOffsetStartDateTime = new Date();
//   var saturdayOffsetEndDateTime = new Date();
//   var sundayActualStartDateTime = new Date();
//   var sundayActualEndDateTime = new Date();
//   var sundayOffsetStartDateTime = new Date();
//   var sundayOffsetEndDateTime = new Date();
//   var today = new Date();
//   var actualStart;
//   var offsetStart;
//   var actualEnd;
//   var offsetEnd;
//   console.log("start", start);
//   console.log("end", end);

//   if (end > start) {
//     //when shift ends in the same day
//     duration = (end - start).toFixed(2);
//   } else {
//     //when shift ends the next day
//     duration = (end + parseFloat(24.0) - start).toFixed(2);
//   }

//   // get hour and minute equivalents of decimal duration
//   let startTimeHour = parseInt(s.JCShift_StartTime.split(".")[0]);
//   let startTimeMinute = parseInt(s.JCShift_StartTime.split(".")[1]) * 0.6;
//   let durationHour = parseInt(duration.toString().split(".")[0]);
//   let durationMinute = parseInt(duration.toString().split(".")[1]) * 0.6;
//   let endTimeHour = startTimeHour + durationHour;
//   let endTimeMinute = startTimeMinute + durationMinute;

//   // Monday - Sunday : 1 - 7
//   console.log("daytoday", today.getDay());
//   let daysToSaturday = Math.abs(6 - today.getDay());
//   let daysToSunday = Math.abs(7 - today.getDay());
//   console.log("daysToSaturday", daysToSaturday);
//   console.log("daysToSunday", daysToSunday);

//   saturdayOffsetStartDateTime.setDate(today.getDate() + daysToSaturday);
//   sundayOffsetStartDateTime.setDate(today.getDate() + daysToSunday);

//   saturdayOffsetEndDateTime.setDate(today.getDate() + daysToSaturday);
//   sundayOffsetEndDateTime.setDate(today.getDate() + daysToSunday);

//   saturdayActualStartDateTime.setDate(today.getDate() + daysToSaturday);
//   sundayActualStartDateTime.setDate(today.getDate() + daysToSunday);

//   saturdayActualEndDateTime.setDate(today.getDate() + daysToSaturday);
//   sundayActualEndDateTime.setDate(today.getDate() + daysToSunday);

//   offsetStartDateTime.setHours(
//     startTimeHour,
//     startTimeMinute - (durationMinute + 90),
//     0
//   );
//   saturdayOffsetStartDateTime.setHours(
//     startTimeHour,
//     startTimeMinute - (durationMinute + 90),
//     0
//   );
//   sundayOffsetStartDateTime.setHours(
//     startTimeHour,
//     startTimeMinute - (durationMinute + 90),
//     0
//   );

//   offsetEndDateTime.setHours(endTimeHour, endTimeMinute - 90, 0);
//   saturdayOffsetEndDateTime.setHours(endTimeHour, endTimeMinute - 90, 0);
//   sundayOffsetEndDateTime.setHours(endTimeHour, endTimeMinute - 90, 0);

//   actualStartDateTime.setHours(startTimeHour, startTimeMinute, 0);
//   saturdayActualStartDateTime.setHours(startTimeHour, startTimeMinute, 0);
//   sundayActualStartDateTime.setHours(startTimeHour, startTimeMinute, 0);

//   actualEndDateTime.setHours(endTimeHour, endTimeMinute, 0);
//   saturdayActualEndDateTime.setHours(endTimeHour, endTimeMinute, 0);
//   sundayActualEndDateTime.setHours(endTimeHour, endTimeMinute, 0);

//   switch (s.JCShift_Shift) {
//     case 8:
//       actualStart = saturdayActualStartDateTime;
//       actualEnd = saturdayActualEndDateTime;
//       offsetStart = saturdayOffsetStartDateTime;
//       offsetEnd = saturdayOffsetEndDateTime;
//       break;
//     case 9:
//       actualStart = sundayActualStartDateTime;
//       actualEnd = sundayActualEndDateTime;
//       offsetStart = sundayOffsetStartDateTime;
//       offsetEnd = sundayOffsetEndDateTime;
//       break;
//     default:
//       actualStart = actualStartDateTime;
//       actualEnd = actualEndDateTime;
//       offsetStart = offsetStartDateTime;
//       offsetEnd = offsetEndDateTime;
//   }
//   console.log("actualStart", actualStart);
//   console.log("actualEnd", actualEnd);
//   console.log("offsetStart", offsetStart);
//   console.log("offsetEnd", offsetEnd);

//   let renamedS = {
//     shiftID: s.JCShift_Shift,
//     shiftDesc: s.JCShift_Description,
//     startTime: generalFunctions.convertHoursToHhmm(s.JCShift_StartTime),
//     endTime: generalFunctions.convertHoursToHhmm(s.JCShift_EndTime),
//     startDateTimeActual: actualStart,
//     // s.JCShift_Shift == 8
//     //   ? saturdayActualStartDateTime
//     //   : s.JCShift_Shift == 9
//     //   ? sundayActualStartDateTime
//     //   : actualStartDateTime,
//     endDateTimeActual: actualEnd,
//     // s.JCShift_Shift == 8
//     //   ? saturdayActualEndDateTime
//     //   : s.JCShift_Shift == 9
//     //   ? sundayActualEndDateTime
//     //   : actualEndDateTime,
//     startDateTimeOffset: offsetStart,
//     // s.JCShift_Shift == 8
//     //   ? saturdayOffsetStartDateTime
//     //   : s.JCShift_Shift == 9
//     //   ? sundayOffsetStartDateTime
//     //   : offsetStartDateTime,
//     endDateTimeOffset: offsetEnd,
//     // s.JCShift_Shift == 8
//     //   ? saturdayOffsetEndDateTime
//     //   : s.JCShift_Shift == 9
//     //   ? sundayOffsetEndDateTime
//     //   : offsetEndDateTime,
//     endOffset: generalFunctions.convertHoursToHhmm(s.JCShift_EndTime - 1.5),
//   };
//   return renamedS;
// });
