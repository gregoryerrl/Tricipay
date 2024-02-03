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

  lblStatus.html("Standby");

  session.init().then(function () {
    lblFullname.html(session.get("fullname"));

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
      if (session.get("role") !== "driver") {
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
          'INSERT INTO queuetbl VALUES ( Null, "' +
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
      'DELETE FROM queuetbl WHERE driver = "' + session.get("user_id") + '";'
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
