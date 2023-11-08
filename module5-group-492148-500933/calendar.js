// make an array containing month names to utilize the return value of getMonth(), returns 0-11
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const currentDate = document.getElementById("current-date");
// get current date to display 
let date = new Date();
let currentYear = date.getFullYear()
let currentMonth = new Month(date.getFullYear(), date.getMonth()); // get month using given function
let events = [];
let eventlength = events.length;

//------- this is calendar code given from the course webpage ------- //

(function(){
  Date.prototype.deltaDays = function(c) {
    return new Date(this.getFullYear(),this.getMonth(),this.getDate()+c);
  };
  
  Date.prototype.getSunday = function() {
    return this.deltaDays(-1*this.getDay());
  }
})();

function Week(c){
  this.sunday=c.getSunday();

  this.nextWeek = function() {
    return new Week(this.sunday.deltaDays(7));
  };

  this.prevWeek = function() {
    return new Week(this.sunday.deltaDays(-7));
  };

  this.contains = function(b) {
    return this.sunday.valueOf()===b.getSunday().valueOf();
  };
  
  this.getDates = function() {
    let b;
    for(b=[],a=0;7>a;a++) b.push(this.sunday.deltaDays(a));
      return b;
  };
}

function Month(c,b){
  this.year=c;

  this.month=b;

  this.nextMonth = function() {
    return new Month(c+Math.floor((b+1)/12),(b+1)%12);
  };
  
  this.prevMonth = function() {
    return new Month(c+Math.floor((b-1)/12),(b+11)%12);
  };
  
  this.getDateObject = function(a) {
    return new Date(this.year,this.month,a);
  };
  
  this.getWeeks = function() {
    let a = this.getDateObject(1);
    let b = this.nextMonth().getDateObject(0);
    let c = [];
    
    a =new Week(a);

    for(c.push(a);!a.contains(b);) {
      a = a.nextWeek()
      c.push(a);
    }
    return c;
  };
}
//------- End of given code  ------- //


//------- Next Month Button Functionality  ------- //
document.getElementById("nextbtn").addEventListener("click",
  function(event) {
    //  update currentMonth to show next month 
    currentMonth = currentMonth.nextMonth(); 
    loadCalendar(events);
  }, false
);
  

//------- Previous Month Button Functionality  ------- //
document.getElementById("prevbtn").addEventListener(
  "click",
  function(event) {
    //  update currentMonth to show last month 
    currentMonth = currentMonth.prevMonth();
    loadCalendar(events);
  }, false
);

//------------ login & register requests ------------//
      
//checking if session variables are set
function session_check() {
    fetch("session_check.php", {
            method: "GET",
        })
        .then((response) => response.json())
        .then((data) => loginCallback("", data.username, data.token, data.success))
        .catch((err) => console.error(err));
}
//fetch request for newuser

$("#registerbtn").click(function (event) {
event.preventDefault();
// let registeruser = document.getElementById("register-user").value;
// let registerpassword = document.getElementById("register-password").value;
let values = $('#register-form').serialize();
if(values === ""){
        alert("Please input valid information.");
        return;
    }
    register(values);
});

function register(values){
    console.log(JSON.stringify(values));
    $.ajax({
        url: "newuser.php",
        type: "POST",
        data: values,
    }).done(function (data) {
        console.log(data);
    });

}

//fetch login request
function login(event) {
    event.preventDefault();
    const username = document.getElementById("userlogin").value;
    const password = document.getElementById("loginpwd").value;
    const data = { 'username': username, 'password': password};

    document.getElementById("userlogin").value = '';
    document.getElementById("loginpwd").value = '';
    fetch("calendarlogin.php", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "content-type": "application/json" },
        })
        .then((response) => response.json())
        .then((data) => loginCallback(data.message, data.username, data.token, data.success))
        .catch((err) => console.error(err));
        console.log(data.username);
}

function loginCallback(message, username, success) {
    if (success) {
        console.log("login successful");
        $("#error").hide();
        $("#login-form").hide();
        $("#register-form").hide();
        $(".loggedIn").show();
        $(".logoutbtn").show();
        $(".editevent").show();
        $(".newevent").show();
        console.log(message);
        $("#currentUser").text(`Current User: ${username}`);
        currentUser = username;
        //after success, get events corresponding to user
        //getEvent("login");
    } else {
        console.log(`You are not logged in ${message}`);
        $("#currentUser").hide();
        $(".logoutbtn").hide();
        $(".editevent").hide();
        $(".newevent").hide();
        $("#error").show();
        $("#login-form").show();
        $("#register-form").show();
        document.getElementById("error").textContent = message;
    }``
}
function logout(){
  fetch("calendarlogout.php", {
    method: "GET",
    headers: { "content-type": "application/json" },
  })
  .then((response) => response.json())
  .then((data) => logoutCallback(data.message, data.success))
  .catch((err) => console.error(err));
}

function logoutCallback(message, success){
  if(success){
    console.log(message);
    //set all events to nothing and hide everything
    $("#login-form").show();
    $("#register-form").show();
    $("#error").show();
    $(".loggedIn").hide();
    $(".logoutbtn").hide();
    $(".editevent").hide();
    $(".newevent").hide();
    //should the page reload here?
  }
}
// --------- end of login & register events ---------- //

//---------- event functions ----------- //
//edit -> called in loadCalendar
// function edit(event){
//   $(".editevent").show();
//   let target = event.target;

//   $("#editevent_year").val(currentMonth.year);
//   $("#editevent_month").val(currentMonth.month + 1);
//   $("#editevent_day").val(target.getAttribute("day"));
//   $("#editevent_hour").val(target.getAttribute("hour"));
//   $("#editevent_minute").val(target.getAttribute("minute"));
//   $("#editevent_title").val(target.getAttribute("title"));
//   $("editevent_summary").val(target.getAttribute("summary"));
//   $("#eventid").text(target.getAttribute("eventid"));
// }
//editEvent
function editEvent(){ //when we display the event id in the calendar (for each corresponding event) we would ask the user to list the event id. 
  //show a div one the side (or bottom) of calendar to edit.
  const year =  $("#editevent_year").val();
  const month = $("#editevent_month").val();
  const day = $("#editevent_day").val();
  const hour = $("#editevent_hour").val();
  const minute = $("#editevent_minute").val();
  const title = $("#editevent_title").val();
  const summary = $("editevent_summary").val();
  const eventid =   $("#event_id").val();
  const data = {
    year:year, month:month, day:day, hour:hour, minute:minute, title:title, summary:summary, eventid:eventid,
  };
  fetch("editEvent.php", {
    method:"POST",
    body: JSON.stringify(data),
    headers: { "content-type": "application/json" },
  })
  .then((response) => response.json())
  .then((data) =>editEventCallback(data.message, data.success))
  .catch((err) => console.error(err));
}

function editEventCallback(message, success){
  if(!success){
    editEventErrorCallback(message, false);
  }else{
    getEvent("edit");
  }
}
function editEventErrorCallback(err, success) {
  if (!success) {
      $("#editEventError").show();
      $("#editEventError").text(err);
      setTimeout(function() {
          $("#editEventError").fadeOut("fast");
      }, 2000);
  } else {
      $("#editEventError").show();
      $("#editEventError").text(err);
      setTimeout(function() {
          $("#editEventError").fadeOut("fast");
          $(".editevent").fadeOut("fast");
      }, 2000);
  }
}

//createEvent
function createEvent(){
  console.log("helloooouu?");
  const year =  $("#event_year").val();
  const month = $("#event_month").val();
  const day = $("#event_day").val();
  const hour = $("#event_hour").val();
  const minute = $("#event_minute").val();
  const title = $("#event_title").val();
  const summary = $("#event_summary").val();
  const data = {
    year:year, month:month, day:day, hour:hour, minute:minute, title:title, summary:summary,
  };
  console.log("hello?");
  
  fetch("createEvent.php", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "content-type": "application/json" },
  })
  .then((response) => response.json())
  .then((data) => createEventCallback(data.message, data.success))
  .catch((err) => console.err(err));
  }

function createEventCallback(message, success) {
if (!success) {
  console.log(message);
} else {
  $("#createEventError").show();
  $("#createEventError").text("Your event was successfully created!");
  getEvent("create");
  setTimeout(function() {
    $("#createEventError").fadeOut("fast");
}, 4000);
}
}

function createEventErrorCallback(err) {
  console.log(err);
  $("#createEventError").show();
  $("#createEventError").text(err);
  setTimeout(function() {
      $("#createEventError").fadeOut("fast");
  }, 4000);
}

//deleteEvent
function deleteEvent(event){ //the event id needs to be displayed when a new event is created. Having that will allow deleteEvent to work as it should.
  const eventid = $("#eventid").text();
  const data = {
    eventid:eventid,
  };
  fetch("deleteEvent.php",{
    method: "POST",
    body: JSON.stringify(data),
    headers: { "content-type": "application/json" },
  })
  .then((response) => response.json())
  .then((data) => deleteEventCallback(data.message, data.success))
  .catch((err) => editEventErrorCallback(err, false));
}

function deleteEventCallback(message, success){
  if(!success){
    console.log(message);
  }else{
    getEvent("delete");
  }
}

//getEvent
function getEvent(type){
  if(type == "logout"){
    events = [];
    getAllEventsCallback([], events.length, type);
  }else {
    fetch("getEvents.php", {
      method: "GET",
      headers: { "content-type": "application/json" },
  })
  .then((response) => response.json())
  .then((data) =>
      getAllEventsCallback(data.allEvents, events.length, type)
  )
  .catch((err) => console.error(err));
  }
}

function getAllEventsCallback (allevents, eventlength, type){
  events = allevents;
  let alleventlength = eventlength;
  if(type == "create"){
    if (alleventlength == eventlength){
      createEventErrorCallback("Some date you inputted is invalid, try again.");
    }else {
      createEventErrorCallback("Created Event Successfully!");
    }
  }else if (type == "edit") {
      editEventErrorCallback("Event edited successfully!", true);
  } else if (type == "delete") {
      if (newLength == currentLength) {
          editEventErrorCallback("deletion failed, please try again");
      } else {
          editEventErrorCallback("Event deleted successfully!", true);
      }
  }
  loadCalendar(allevents);
}

//build the calendar -> dates, months, year // only updates events
function loadCalendar(events){
  // let weeksInMonth = currentMonth.getWeeks(); // remember this returns an array containing all the weeks that span in the specififed month =
  // can use nested for loop to excess each of the days in each week 

  // let rowcount = 1; // set a counter for rows to traverse 

  // for(let w in weeksInMonth){
  //   // get necessary variables to traverse and manipulate DOM tree
  //   let rowID = "r" + rowcount; 
  //   let rowClass = $(rowID).children();
  //   let days = weeksInMonth[w].getDates();
  //   let daycount = 0;
  //   // let numberEntry = document.getElementsByTagName("tr"); // get the row 
  //   console.log(rowID)
  //   let week = document.getElementById(rowID);

  //   for (let d in days){
  //     week.childNodes[daycount].textContent = days[d].getDate(); // got into each td in each tr to print the days 
  //     console.log(d);
  //     if(days[d].getMonth == currentMonth.month){
  //       let currentDay = $(rowClass[daycount]);
  //       currentDay.text(days[d].getDate());

  //       events.forEach(function(event){
  //         if(new Date(event.startTime).toDateString() == days[d].toDateString() ){
  //           let time = new Date(event.startTime);
            
  //           // let each day on calendar be a button to add new event
  //           let eventButton = document.createElement("button");
  //           let linebr = document.createElement("br");
  //           eventButton.append(
  //             document.createTextNode(
  //               event.title + " " + time.toLocaleTimeString()
  //             )
  //           );
  //           eventButton.setAttribute("class", "event");
  //           eventButton.setAttribute("eventid", event.eventid);
  //           eventButton.setAttribute("day", days[d].getDate());
  //           eventButton.setAttribute("hour", eventtime.getHours());
  //           eventButton.setAttribute("minute", eventtime.getMinutes());
  //           eventButton.setAttribute("title", event.title);
  //           eventButton.setAttribute("summary", event.summary);
  //           eventButton.addEventListener("click", edit);
  //           currentDay.append(eventButton);
  //           currentDay.append(linebr);
  //         }
  //       });
  //     }else{
  //       let currentDay = $(rowClass[daycount]);
  //       currentDay.text("");
  //     }
  //     daycount += 1;
  //   }
  //   rowcount += 1;
  // }
  // if(rowcount == 7){
  //   $("#r6").children().text[""];
  // }
}


//loadCalendar();
calendarNumbering(currentMonth);

function calendarNumbering (currentMonth) { // update the numbering of the calendar 
  // currentMonth is a Month object
  
  let rowcount = 1;
  let counter = 1;
  let rowID = "r" + rowcount;
  currentDate.innerText = `${currentMonth.month} ${currentMonth.year}`; // set the text in the calendar to be current month and year

  let week = document.getElementById(rowID);

  let firstDay = new Date(currentMonth.year, currentMonth.month, 1) // first of current month 
  let lastDay = new Date(currentMonth.year, currentMonth.month + 1, 0) // last day of current month 
  let weeks = currentMonth.getWeeks(); // get the weeks in the current month 

  let pastDay = firstDay.getSunday(); // gets the days in the last month 

  // let nextDay = lastDay.deltaDays(); // gets the 


  while(pastDay.getDate() != firstDay.getDate())  {  // add days of previous month & first is not being added here 
    week.innerHTML += `<td class= "pastMonth" id = ${pastDay.getDate()} >${pastDay.getDate()}</td>`;
    pastDay.setDate(pastDay.getDate() + 1);
    if(counter == 7){
      counter = 1;
      rowcount++;
      rowID = "r" + rowcount;
      week = document.getElementById(rowID);
    }
    else {
      counter++;
    }
  }
  console.log("last day");
  console.log(lastDay.getDate());
  while(firstDay.getDate() != lastDay.getDate()) {  // add days of current month
    console.log(firstDay.getDate());
    week.innerHTML += `<td class= "currentMonth" id = ${firstDay.getDate()} >${firstDay.getDate()}</td>`;
    firstDay.setDate(firstDay.getDate() + 1);
    if(counter == 7){
      counter = 1;
      rowcount++;
      rowID = "r" + rowcount;
      week = document.getElementById(rowID);
    }
    else {
      counter++;
    }
  }
  // console.log(counter);
  
  
  while(counter <= 7) { // add the remaining days in the row 
    week.innerHTML += `<td class= "nextMonth" id = ${lastDay.getDate()} >${lastDay.getDate()}</td>`;
    lastDay.setDate(lastDay.getDate() + 1);
    counter ++;
  }

}

//DOM events
document.getElementById("loginbtn").addEventListener("click", login, false);
document.getElementById("logout_btn").addEventListener("click", logout, false);

//Calling Calendar Events
document.getElementById("createevent_btn").addEventListener("click", createEvent, false);
document.getElementById("editevent_btn").addEventListener("click", editEvent, false);
document.getElementById("deleteevent_btn").addEventListener("click", deleteEvent, false);

session_check();
