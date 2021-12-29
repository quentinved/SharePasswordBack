const sheetAPI = require("../../api/sheet");
const { dataModeler } = require("../../utils/sheetData.modeler");

module.exports.getFiles = async function (provider) {
  if (provider.scope === "SHEET") {
    try {
      const { data } = await sheetAPI.drive.get(
        `/files?q=mimeType='application/vnd.google-apps.spreadsheet'`,
        {
          headers: {
            Authorization: `Bearer ${await provider.getAccessToken()}`,
          },
        }
      );
      return data;
    } catch (err) {
      return { error: true, message: "Can't get files in drive", err };
    }
  } else {
    return { error: true, message: "Invalid Scope !" };
  }
};

module.exports.getFile = async function (provider, id, isValues = false) {
  if (provider.scope === "SHEET") {
    // try {
      const { data } = await sheetAPI.api.get(`/${id}`, {
        headers: {
          Authorization: `Bearer ${await provider.getAccessToken()}`,
        },
        params: {
          includeGridData: true,
        },
      });
      // return data
      let dataModeled = dataModeler(data, isValues);
      return dataModeled;
    // } catch (err) {
    //   return { error: true, message: "Can't get repos", err };
    // }
  } else {
    return { error: true, message: "Invalid Scope !" };
  }
};

module.exports.getColumnsField = async function (provider, id, idSheet) {
  let file = await this.getFile(provider, id, false);
  // console.log(data)
  if (file.error)
    return file
  let title = null
  for (let i = 0; file.sheets.length; i++) {
    if (file.sheets[i].sheetId == idSheet) {
      title = file.sheets[i].title
      break
    }
  }
  if (title == null)
    return { error: true, message: "Invalid idSheet !" };
  if (provider.scope === "SHEET") {
    // try {
      const { data } = await sheetAPI.api.get(`/${id}/values/'${title}'!A1:Z100`, {
        headers: {
          Authorization: `Bearer ${await provider.getAccessToken()}`,
        }
      });
      data.title = file.title
      data.sheet = title
      if (data.values)
        data.values.splice(1, data.values.length - 1)
      else
        data.values = []
      return data
      // let dataModeled = dataModeler(data, isValues);
      // return dataModeled;
    // } catch (err) {
    //   return { error: true, message: "Can't get repos", err };
    // }
  } else {
    return { error: true, message: "Invalid Scope !" };
  }
  // let data = await this.getFile(provider, id, true);
  // if (data.error) {
  //   return { ...data };
  // }
  // let sheetData = data.sheets.filter((sheet) => sheet.sheetId !== idSheet);
  // console.log("sheetData: ", sheetData);
  // if (sheetData.length >= 1) {
  //   sheetData = sheetData[0];
  //   if (sheetData.data.length >= 1) {
  //     return sheetData.data[0];
  //   }
  // }
  // return [];
};

module.exports.getRowsData = async function (provider, id, idSheet) {
  console.log("SHEET get data", provider.scope, id, idSheet)
  let file = await this.getFile(provider, id, false);
  // console.log(data)
  if (file.error)
    return file
  let title = null
  for (let i = 0; file.sheets.length; i++) {
    if (file.sheets[i].sheetId == idSheet) {
      title = file.sheets[i].title
      break
    }
  }
  if (title == null)
    return { error: true, message: "Invalid idSheet !" };
  if (provider.scope === "SHEET") {
    // try {
      const { data } = await sheetAPI.api.get(`/${id}/values/'${title}'!A1:Z100`, {
        headers: {
          Authorization: `Bearer ${await provider.getAccessToken()}`,
        }
      });
      data.title = file.title
      data.sheet = title
      if (data.values)
        data.values.splice(0, 1)
      else
        data.values = []
      return data
      // let dataModeled = dataModeler(data, isValues);
      // return dataModeled;
    // } catch (err) {
    //   return { error: true, message: "Can't get repos", err };
    // }
  } else {
    return { error: true, message: "Invalid Scope !" };
  }
  // if (data.error) {
  //   return { ...data };
  // }
  // // return data
  // let sheetData = data.sheets.filter((sheet) => sheet.sheetId !== idSheet);
  // console.log("sheetData: ", sheetData);
  // if (sheetData.length >= 1) {
  //   sheetData = sheetData[0];
  //   if (sheetData.data.length >= 1) {
  //     return sheetData.data.filter((data, index) => index !== 0);
  //   }
  // }
  // return [];
};

module.exports.appendRow = async function (provider, id, idSheet, values) {
  let file = await this.getFile(provider, id, false);
  // console.log(data)
  if (file.error)
    return file
  let title = null
  for (let i = 0; file.sheets.length; i++) {
    if (file.sheets[i].sheetId == idSheet) {
      title = file.sheets[i].title
      break
    }
  }
  if (title == null)
    return { error: true, message: "Invalid idSheet !" }; 
  console.log("tilte gfdgfdgfd", title) 
  if (provider.scope === "SHEET") {
    const { data } = await sheetAPI.api
      .post(
        `/${id}/values/'${title}'!A1:Z1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
        {
          range: `'${title}'!A1:Z1`,
          majorDimension: "ROWS",
          values: [...values],
        },
        {
          headers: {
            Authorization: `Bearer ${await provider.getAccessToken()}`,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((err) => {
        console.log("My ERROR: ", err.response);
      });
    return data;
  } else {
    return { error: true, message: "Invalid Scope !" };
  }
};