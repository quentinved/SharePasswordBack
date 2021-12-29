const driveAPI = require("../../api/drive");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

module.exports.getFiles = async function (provider) {
  if (provider.scope === "DRIVE") {
    try {
      const { data } = await driveAPI.api.get("/files", {
        headers: {
          Authorization: `Bearer ${await provider.getAccessToken()}`,
        },
      });
      return data.files;
    } catch (err) {
      return { error: true, message: "Can't fetch files", err };
    }
  } else {
    return { error: true, message: "Scope not found !" };
  }
};

module.exports.getFileId = async function (provider, id) {
  if (provider.scope === "DRIVE") {
    try {
      const { data } = await driveAPI.api.get(`/files/${id}`, {
        headers: {
          Authorization: `Bearer ${await provider.getAccessToken()}`,
        },
      });
      return data;
    } catch (err) {
      return { error: true, message: "Can't fetch files", err };
    }
  } else {
    return { error: true, message: "Scope not found !" };
  }
};

module.exports.getFolders = async function (provider) {
  if (provider.scope === "DRIVE") {
    try {
      const { data } = await driveAPI.api.get(
        "/files?q=mimeType='application/vnd.google-apps.folder'",
        {
          headers: {
            Authorization: `Bearer ${await provider.getAccessToken()}`,
          },
        }
      );
      return data.files;
    } catch (err) {
      return { error: true, message: "Can't fetch files", err };
    }
  } else {
    return { error: true, message: "Scope not found !" };
  }
};

module.exports.uploadFile = async function (
  provider,
  name,
  file = null,
  data = 'Nothing to report',
  idFile = null,
  mimeType = null
) {
  if (provider.scope === "DRIVE") {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: await provider.getAccessToken(),
    });

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    let string = "Hello my name is Rémi";

    var fileMetadata = {
      'name': name,
      'mimeType': (mimeType) ? mimeType : null,
      "parents": (idFile) ? [idFile] : [],
    };
    var media = {
      mimeType: (mimeType) ? mimeType : null,
      body: (file) ? Buffer.from(file).toString() : data,
    };
    let ret = await new Promise(resolve => drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: "id",
        uploadType: 'media'
      },
      function (err, file) {
        if (err) {
          // Handle error
          console.log("ERROR: ", err);
          console.log("ERROR: ", err.response.data);
        } else {
          console.log("File Id:", file);
        }
        return (err) ? resolve(err.response.data) : resolve(file.data);
      }
    ));
    return ret;
    // } catch (err) {
    //   return { error: true, message: "Can't fetch files", err };
    // }
  } else {
    return { error: true, message: "Scope not found !" };
  }
};


// try {
//   const {data} = await driveAPI.upload.post(
//     "/files?uploadType=media",
//     {
//         parents: [idFile],
//         mimeType: mimeType,
//         name: name
//     },
//     {
//         headers: {
//             Authorization: `Bearer ${await provider.getAccessToken()}`,
//         },
//     }
//   );
//   console.log("Data: ", data);