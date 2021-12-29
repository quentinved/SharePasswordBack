const googleAPI = require("../../api/google");
const timeZone = "Europe/Paris"

module.exports.getCalendars = async function(provider) {
    console.log("google calendar service get calendars,", provider.scope);
    if (provider.scope === 'CALENDAR') {
      try {
        const { data } = await googleAPI.calendar.get(`/users/me/calendarList`,
          {
            headers: {
                Authorization: `Bearer ${await provider.getAccessToken()}`,
              }
          })
        return data; // + id : 'primary'
      } catch (err) {
        return {
          error: true,
          message: "Can't get calendars",
          err
        };
      }
    } else {
      return {error: true, message: "Invalid Scope !"};
    }
  };

module.exports.createEvent = async function(provider, id, start, end, query) {
  console.log("google calendar service create event,", provider.scope, id, start, end, query);
  if (provider.scope === 'CALENDAR') {
      try {
          let body = JSON.stringify(Object.assign({
              start: {
                  dateTime: start,
                  timeZone: timeZone
              },
              end: {
                  dateTime: end,
                  timeZone: timeZone
              }
            }, query))
          const { data } = await googleAPI.calendar.post(`/calendars/${id}/events`,
          body,
          {
          headers: {
              Authorization: `Bearer ${await provider.getAccessToken()}`,
            }
        })
      return data;
    } catch (err) {
      return {
        error: true,
        message: "Can't create event",
        err
      };
    }
  } else {
    return {error: true, message: "Invalid Scope !"};
  }
};

module.exports.getCalendarEvent = async function(provider, id) {
  console.log("google calendar event,", provider.scope, id);
  if (provider.scope === 'CALENDAR') {
      try {
          const { data } = await googleAPI.calendar.get(`/calendars/${id}/events`,
          {
          headers: {
              Authorization: `Bearer ${await provider.getAccessToken()}`,
            }
        })
      // console.log(data)
      return data;
    } catch (err) {
      return {
        error: true,
        message: "Can't get calendar event",
        err
      };
    }
  } else {
    return {error: true, message: "Invalid Scope !"};
  }
};

module.exports.getEvents = async function(provider) {
    console.log("google calendar service get events,", provider.scope);
    const calendars = await this.getCalendars(provider)
    if (calendars.error)
      return calendars
    let calendarsEvents = []
    for (let i = 0; i < calendars.items.length; i++) {
      calendarsEvents.push(this.getCalendarEvent(provider, calendars.items[i].id)
      .then(events => ({i, events}))
      .catch(err => console.log(err)))
    }
    // "primary" a l'air d'etre une duplication d'un des calendrier deja existants 
    // calendarsEvents.push(this.getCalendarEvent(provider, "primary")
    // .then(events => ({i: calendars.items.length, events}))
    // .catch(err => console.log(err)))
    let data = await Promise.all(calendarsEvents).then((events) => {
      // events = events.filter(e => e.events.error != true)
      return events
        .filter(e => e.events.error != true)
        .filter(e => e.events.items.length > 0)
        .map(e => {
        let calendarId = (e.i < calendars.items.length) ? calendars.items[e.i].id : "primary"
        return {calendarId: calendarId, summary: e.events.summary, event: e.events}
      })
    })
    return data
  }