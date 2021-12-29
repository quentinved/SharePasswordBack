module.exports.dataModeler = (data, isValues) => {
  // console.log("DATA: ", data);
  if (data.error) return data;
  let newData = {
    spreadsheetId: data.spreadsheetId,
    title: data.properties.title,
  };
  if (isValues) {
    newData.sheets = data.sheets.map((sheet) => ({
        sheetId: sheet.properties.sheetId,
        title: sheet.properties.title,
        gridProperties: sheet.properties.gridProperties,
        data: sheet.data.map((data) =>
          data.rowData.map((values) => ({
            values: values.values
              .filter((data) => Object.keys(data).length !== 0 && data.userEnteredValue && data.userEnteredValue.stringValue.length > 0 && data.formattedValue)
              .map((value) => ({
                value: value.userEnteredValue.stringValue,
              })),
          })).filter((data) => data.values.length > 0),
        )[0],
      }));
  } else {
    newData.sheets = data.sheets.map((sheet) => ({
        sheetId: sheet.properties.sheetId,
        title: sheet.properties.title,
        gridProperties: sheet.properties.gridProperties,
      }));
  }
  return newData;
};

module.exports.parseSheet = (title, line, data, values, isQuery=true) => {
  for (let i = 0; i < title.length; i++) {
      if (title[i] == "")
          continue
      else if (values.indexOf(title[i]) != -1) {
        data[title[i]] = line[i]
      } else if (isQuery) {
          data.query[title[i]] = line[i]
      }
  }
  return data
}

function getAllElem(obj) {
  elem = {}
  for (x in obj) {
    if (typeof obj[x] !== 'object')
      elem[x] = obj[x]
    else
      elem = Object.assign(elem, getAllElem(obj[x]))
  }
  return elem
}

module.exports.appendSheet = (title, data) => {
  let values = new Array(title.length).fill("")
  for (obj in data) {
    for (x in data[obj]) {
      if (x !== "" &&  title.indexOf(x) !== -1) {
        idx = title.indexOf(x)
        if (typeof data[obj][x] === 'string')
          values[idx] = data[obj][x]
        else
          values[idx] = JSON.stringify(data[obj][x])
      }
    }
  }
  // console.log("valll,  ", title, values)
  return values
}