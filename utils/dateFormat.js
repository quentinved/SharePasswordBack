module.exports.calendarDateFormat = (date, delay=0) => {
    let d = new Date(Date.parse(date) + delay * 1000)
    var datestring = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
   ("0"+(d.getDate())).slice(-2) + "T" + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)
   +":" +("0"+(d.getSeconds())).slice(-2) + "Z";
   return datestring
}

// * * * * * *
//   | | | | | |
//   | | | | | day of week
//   | | | | month
//   | | | day of month
//   | | hour
//   | minute
//   second ( optional )

module.exports.cronDateFormat = (timestamp) => {
    let d = new Date(timestamp)
    let day = d.getDay() - 1
    if (day < 0)
        day = 6
    var crondate = d.getSeconds() + " " + d.getMinutes() + " " +
    (d.getHours()) + " " + d.getDate() + " " + (d.getMonth() + 1) + " " + day
    return crondate
}

// module.exports.cronClockFormat = (time) => {
//     var d = Math.floor(time / (24*3600));
//     var h = Math.floor(time % (24*3600) / 3600);
//     var m = Math.floor(time % 3600 / 60);
//     var s = Math.floor(time % 3600 % 60);
//     return s + " " + m + " " + h + " */" + d + " * *"
// }
