import * as Cookies from "../../assets/components/CookieFunctions.js";
import appConfig from "../../Config.json";
import axios from "axios";
import { GifRounded } from "@material-ui/icons";

function mapPOHdr(
  company,
  country,
  poNum,
  msgText,
  approvalStatus,
  entryPerson,
  buyerID,
  buyerName,
  buyerLimit,
  approverName,
  approverLimit,
  vendorNum,
  vendorID,
  vendorName,
  poDate,
  dueDate,
  appovedAmount,
  totalCharges,
  totalTax,
  totalOrder,
  baseCurrencyCode,
  currencyCode,
  docTotalCharges,
  docTotalTax,
  docTotalOrder,
  docCurrencyCode
) {
  let poLines = [];
  let poReleases = [];
  return {
    company,
    country,
    poNum,
    msgText,
    approvalStatus,
    poStatus:
      approvalStatus === "U"
        ? "Unsubmitted"
        : approvalStatus === "P"
        ? "Pending Approval"
        : approvalStatus === "A"
        ? "Approved"
        : approvalStatus === "R"
        ? "Rejected"
        : "",
    entryPerson,
    buyerID,
    buyerName,
    buyerLimit: new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(buyerLimit),
    approverName,
    approverLimit: new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(approverLimit),
    vendorNum,
    vendorID,
    vendorName,
    poDate: new Date(poDate).toLocaleDateString("en-GB", {
      dateStyle: "medium",
    }),
    dueDate: new Date(dueDate).toLocaleDateString("en-GB", {
      dateStyle: "medium",
    }),
    appovedAmount: new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(appovedAmount),
    totalCharges: new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(totalCharges),
    totalTax: new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(totalTax),
    totalOrder: new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(totalOrder),
    baseCurrencyCode,
    currencyCode,
    docTotalCharges: new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(docTotalCharges),
    docTotalTax: new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(docTotalTax),
    docTotalOrder: new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(docTotalOrder),
    docCurrencyCode,
    poLines,
    poReleases,
  };
}

function mapPODtl(
  lineNum,
  openLine,
  voidLine,
  partNum,
  partDesc,
  lineQty,
  lineUOM,
  unitPrice,
  extCost,
  docExtCost,
  dueDate,
  capexProjectCode,
  partCategoryCode,
  projectID,
  phaseDesc
) {
  let lineReleases = [];
  return {
    lineNum,
    openLine,
    voidLine,
    partNum,
    partDesc,
    lineQty: new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(lineQty),
    lineUOM,
    unitPrice: new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(unitPrice),
    extCost: new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(extCost),
    docExtCost: new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(docExtCost),
    dueDate: new Date(dueDate).toLocaleDateString("en-GB", {
      dateStyle: "medium",
    }),
    capexProjectCode,
    partCategoryCode,
    projectID,
    phaseDesc,
    lineReleases,
  };
}

function mapPORel(
  lineNum,
  releaseNum,
  openRelease,
  voidRelease,
  partNum,
  dueDate,
  releaseQty,
  projectID,
  phaseDesc,
  plantID
) {
  return {
    id: `${lineNum}-${releaseNum}`,
    lineNum,
    releaseNum,
    openRelease,
    voidRelease,
    partNum,
    dueDate: new Date(dueDate).toLocaleDateString("en-GB", {
      dateStyle: "medium",
    }),
    releaseQty: new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(releaseQty),
    projectID,
    phaseDesc,
    plantID,
  };
}

function mapPOData(poDataResponse) {
  let companyList = ["All"];
  let approverList = ["All"];
  let poList = [];
  let poHdr = {};
  let poDtl = {};
  let poRel = {};
  let poNum = 0;
  let poLine = 0;

  for (const r of poDataResponse) {
    if (!companyList.includes(r.POApvMsg_Company)) {
      companyList.push(r.POApvMsg_Company);
    }
    if (!approverList.includes(r.PurAgent_Approver_Name)) {
      approverList.push(r.PurAgent_Approver_Name);
    }

    if (poNum !== r.POApvMsg_PONum) {
      poNum = r.POApvMsg_PONum;
      poLine = 0;

      poHdr = mapPOHdr(
        r.POApvMsg_Company,
        r.Company_Country,
        r.POApvMsg_PONum,
        r.POApvMsg_MsgText,
        r.POHeader_ApprovalStatus,
        r.POHeader_EntryPerson,
        r.POHeader_BuyerID,
        r.PurAgent_Buyer_Name,
        r.PurAgent_Buyer_POLimit,
        r.PurAgent_Approver_Name,
        r.PurAgent_Approver_POLimit,
        r.POHeader_VendorNum,
        r.Vendor_VendorID,
        r.Vendor_Name,
        r.POHeader_OrderDate,
        r.POHeader_DueDate,
        r.POHeader_ApprovedAmount,
        r.POHeader_TotalCharges,
        r.POHeader_TotalTax,
        r.POHeader_TotalOrder,
        r.Calculated_BaseCurr,
        r.POHeader_CurrencyCode,
        r.POHeader_DocTotalCharges,
        r.POHeader_DocTotalTax,
        r.POHeader_DocTotalOrder,
        r.Vendor_CurrencyCode
      );
      poList.push(poHdr);
    }

    if (poLine !== r.PODetail_POLine) {
      poLine = r.PODetail_POLine;

      poDtl = mapPODtl(
        r.PODetail_POLine,
        r.PODetail_OpenLine,
        r.PODetail_VoidLine,
        r.PODetail_PartNum,
        r.PODetail_LineDesc,
        r.PODetail_XOrderQty,
        r.PODetail_IUM,
        r.PODetail_UnitCost,
        r.PODetail_ExtCost,
        r.PODetail_DocExtCost,
        r.PODetail_DueDate,
        r.PODetail_ProjectCode_c,
        r.PODetail_SubCode_c,
        r.PORel_ProjectID,
        r.ProjPhase_Description
      );
      poHdr.poLines.push(poDtl);
    }

    poRel = mapPORel(
      r.PODetail_POLine,
      r.PORel_PORelNum,
      r.PORel_OpenRelease,
      r.PORel_VoidRelease,
      r.PODetail_PartNum,
      r.PORel_DueDate,
      r.PORel_RelQty,
      r.PORel_ProjectID,
      r.ProjPhase_Description,
      r.PORel_Plant
    );
    poDtl.lineReleases.push(poRel);
    poHdr.poReleases.push(poRel);
  }

  return { poList, companyList, approverList };
}

const apiConnection = (company) => {
  const epicorToken = Cookies.getCookie("epicorToken");
  const restServerURL = appConfig.ERPRestServerURL;
  let headerConfig = {
    baseURL: restServerURL,
    headers: {
      Authorization: "Bearer " + epicorToken,
      ContentType: "application/json",
    },
  };
  if (company != null && company != "") {
    const CallSettings = JSON.stringify({
      Company: `${company}`,
      Plant: "",
      Language: "",
      FormatCulture: "",
    });
    headerConfig.headers = { ...headerConfig.headers, CallSettings };
  }
  return axios.create(headerConfig);
};

export const getPOs = async (userID) => {
  const response = await apiConnection().get(
    `/BaqSvc/POsPendingApproval/?userID=${userID}`
  );
  return mapPOData(response.data.value);
};

export const getPO = async (poNum) => {
  const response = await apiConnection().get(
    `/BaqSvc/POsPendingApproval/?poNum=${poNum}`
  );
  console.log("[getPO] - response.data: ", response.data);
  if (response.data.value.length == 0) {
    throw new Error("PO is not avialable for Approval/Rejection");
  }
  return mapPOData(response.data.value).poList[0];
};

export const getPOApvMsg = async (company, poNum) => {
  console.log("[getPOApvMsg] ", "company:", company, "poNum:", poNum);
  let data = {
    whereClausePOApvMsg: `Company='${company}' and PONum=${poNum}`,
    pageSize: 0,
    absolutePage: 0,
  };
  try {
    const response = await apiConnection().post(
      "/Erp.BO.POApvMsgSvc/GetRows",
      data
    );
    console.log("[getPOApvMsg] - response.data: ", response.data);
    return response.data.returnObj.POApvMsg[0];
  } catch (error) {
    console.log("[getPOApvMsg] - Error: ", error);
  }
};

export const updatePOApvMsg = async (poApvMsgList) => {
  let isSuccess = false;
  const data = { ds: { POApvMsg: poApvMsgList, ExtensionTables: [] } };
  try {
    const response = await apiConnection(poApvMsgList[0].Company).post(
      "/Erp.BO.POApvMsgSvc/Update",
      data
    );
    isSuccess = true;
  } catch (error) {
    console.log(
      "[updatePOApvMsg] ",
      "error.response.data =====>",
      error.response.data,
      "REST payload data =====>",
      data
    );
  }
  return isSuccess;
};

export const checkApprovalLimit = async (company, poNum, amt) => {
  const requestData = {
    vPONum: poNum,
    vAprvAmt: `${amt}`,
    vApproved: "APPROVED",
  };
  try {
    const response = await apiConnection(company).post(
      "/Erp.BO.POApvMsgSvc/CheckApprovalLimit/",
      requestData
    );
    return response.data.parameters.vMessage;
  } catch (error) {
    console.log(
      "[checkApprovalLimit] ",
      "error =====>",
      error,
      "requestData =====>",
      requestData
    );
    return "";
  }
};
