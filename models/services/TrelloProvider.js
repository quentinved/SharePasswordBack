const trelloApi = require("../../api/trello");
const appkey = require("../../config/auth.config")

// list all board
module.exports.listBoards = async function(provider) {
  if (provider.scope == "TRELLO") {
    try {
      const { data } = await trelloApi.trello.get(`/members/${provider.uuidP}/boards?key=${appkey.TRELLO.clientID}&token=${provider.accessToken}&fields=id,name,desc`,{
        headers: {
          Authorization: `Bearer ${await provider.getAccessToken()}`,
        },
      });
      console.log("DATA = ", data);
        return data;
      } catch (err) {
        return {
          error: true,
          message: "Can't fetch files",
          err
        };
      }
    } else {
      return {error: true, message: "Scope not found !"};
    }
};

// list all card on a board
module.exports.listinBoard = async function(provider, idboard) { 
  if (provider.scope == "TRELLO") {
    try {
      const { data } = await trelloApi.trello.get(`boards/${idboard}/lists?key=${appkey.TRELLO.clientID}&token=${provider.accessToken}`,{
        headers: {
          Authorization: `Bearer ${await provider.getAccessToken()}`,
        },
      });
      // console.log("DATA = ", data);
        return data;
      } catch (err) {
        return {
          error: true,
          message: "Can't fetch files",
          err
        };
      }
    } else {
      return {error: true, message: "Scope not found !"};
    }
};

module.exports.listinList = async function(provider, idlist) { 
  if (provider.scope == "TRELLO") {
      // console.log("idlist provider", idlist, provider.accessToken)
      const { data } = await trelloApi.trello.get(`lists/${idlist}/cards?key=${appkey.TRELLO.clientID}&token=${provider.accessToken}`,{
        headers: {
          Authorization: `Bearer ${await provider.getAccessToken()}`,
        },
      });
        let resultTitle = data.map((card) => ({name: card.name, idCard:  card.id, description: card.desc, date: card.dateLastActivity}))
        // console.log("DATA = ", resultTitle);
        return resultTitle;
    } else {
      return {error: true, message: "Scope not found !"};
    }
};

// create card on a board
module.exports.createList = async function(provider, idBoard, titleList) { 
  if (provider.scope == "TRELLO") {
    try {
      const { data } = await trelloApi.trello.post(`boards/${idBoard}/lists?key=${appkey.TRELLO.clientID}&token=${provider.accessToken}&name=${titleList}`, 
      {
        headers: {
          Authorization: `Bearer ${await provider.getAccessToken()}`,
        },
      });
      // console.log("DATA = ", data);
        return data;
      } catch (err) {
        return {
          error: true,
          message: "Can't fetch files",
          err
        };
      }
    } else {
      return {error: true, message: "Scope not found !"};
    }
};

// create card on a board
module.exports.createCard = async function(provider, idList, nameCard, desc) { 
  console.log("PENIS", appkey.TRELLO.clientID, idList, nameCard)
  if (provider.scope == "TRELLO") {
    try {
      const { data } = await trelloApi.trello.post(`cards?key=${appkey.TRELLO.clientID}&token=${provider.accessToken}&idList=${idList}&name=${nameCard}&desc=${desc}`,
      {
        headers: {
          Authorization: `Bearer ${await provider.getAccessToken()}`,
        },
      });
      // console.log("DATA = ", data);
        return data;
      } catch (err) {
        return {
          error: true,
          message: "Can't fetch files",
          err
        };
      }
    } else {
      return {error: true, message: "Scope not found !"};
    }
};