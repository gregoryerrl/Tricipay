$(document).ready(function () {
  let lblFullname = $("[name='fullname']");
  let lblStart = $("[name='route-start']");
  let lblDest = $("[name='route-dest']");
  let lblStatus = $("[name='queue-status']");
  let queued = "standby";

  let btnStartQueue = $("[name='queue']");
  let btnCancelQueue = $("[name='cancel-queue']");
  let btnReloadQueue = $("[name='reload-queue']");
  let btnLogout = $("[name='logout']");
  console.log("dashboard.js loaded");
  let dailyTrip = 0;
  let dailyRevenue = 0;
  let dailyIncome = 0;
  let dailyPassenger = 0;

  $("#driverDashboard").addClass('d-none');
  $(".adminDashboard").addClass('d-none');

  lblStatus.html("Standby");

  session.init().then(function () {
    lblFullname.html(session.get("fullname"));
    console.log(session.get("id"));
    if (session.get("role") == "admin") {
      
  $(".adminDashboard").removeClass("d-none");
    }

    dbQuery
      .execute("Select * From salestbl WHERE DATE(Date) = CURDATE();")
      .then(function () {
        if (dbQuery.rows() > 0) {
          for (var i = 0; i < dbQuery.rows(); i++) {
            dailyPassenger += parseInt(dbQuery.result(i, "passenger"));
            dailyRevenue += parseInt(dbQuery.result(i, "total"));
          }
        }
      })
      .then(function () {
        dailyTrip = Math.ceil(dailyPassenger / 5);
        $("#daily-trip").html(dailyTrip);
        $("#daily-revenue").html(dailyRevenue);
        $("#daily-income").html(dailyRevenue - dailyTrip);
        console.log(dailyTrip);
        console.log(dailyPassenger);
      });

    dbQuery
      .execute(
        "SELECT u.fullname, r.dest, SUM(s.total) AS total_daily_sales, SUM(s.passenger) / 5 AS total_daily_trips FROM usertbl u JOIN salestbl s ON u.id = s.driver_id JOIN routestbl r ON u.route = r.id WHERE DATE(s.Date) = CURDATE() GROUP BY u.fullname, r.dest;"
      )
      .then(function () {
        if (dbQuery.rows() > 0) {
          for (var i = 0; i < dbQuery.rows(); i++) {
            $("#driver-table").append(
              "<tr><td style='text-align:center'>" +
                dbQuery.result(i, "fullname") +
                "</td><td style='text-align:center'>" +
                dbQuery.result(i, "dest")+
                "</td><td style='text-align:center'>" +
                Math.ceil(dbQuery.result(i, "total_daily_trips"))+
                "</td><td style='text-align:center'>" + 
                dbQuery.result(i, "total_daily_sales") +
                "</td></tr>"
            );
          }
        }
      });

    // SELECT salestbl.*, usertbl.fullname FROM salestbl LEFT JOIN usertbl ON usertbl.id = salestbl.driver_id;

    dbQuery.execute("Select * From ridetbl Order By date;").then(function () {
      if (dbQuery.rows() > 0) {
        for (var i = 0; i < dbQuery.rows(); i++) {
          if (dbQuery.result(i, "driver") == session.get("user_id")) {
            queued = "queued";
            if (i == 0) {
              lblStatus.html("First in Line");
            } else {
              lblStatus.html(i + 1);
            }
          }
        }
      }
    });

    if (session.get("role") == "driver") {
      $("#driverDashboard").removeClass("d-none");
    }

    if (session.get("route") !== undefined) {
      dbQuery
        .execute(
          'SELECT * FROM routestbl WHERE id = "' + session.get("route") + '"'
        )
        .then(function () {
          lblStart.html(dbQuery.result(0, "start"));
          lblDest.html(dbQuery.result(0, "dest"));
        });
    }
  });

  btnStartQueue.click(function () {
    if (queued == "standby") {
      if (session.get("role") == "driver") {
        let d = "";
        let n = new Date();
        d =
          n.getFullYear() +
          "-" +
          n.getDay() +
          "-" +
          n.getDate() +
          " " +
          n.getHours() +
          ":" +
          n.getMinutes() +
          ":" +
          n.getSeconds();
        dbQuery.executeNonQuery(
          'INSERT INTO ridetbl VALUES ( Null, "' +
            session.get("route") +
            '", "' +
            d +
            '", "' +
            session.get("user_id") +
            '");'
        );
        alert("Queue Success");
        window.location.reload();
      } else {
        alert("Not a driver");
      }
    } else {
      alert("Already Queued");
    }
  });

  btnReloadQueue.click(function () {
    window.location.reload();
  });

  btnCancelQueue.click(function () {
    dbQuery.executeNonQuery(
      'DELETE FROM `ridetbl` WHERE `driver` = "' + session.get("user_id") + '";'
    );

    alert("Cancel Queue Success");
    window.location.reload();
  });

  btnLogout.click(function () {
    session.destroy().then(function () {
      window.location.href = "../../index.php";
    });
  });
});
