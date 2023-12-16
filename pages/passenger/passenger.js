$(document).ready(function () {
  let allRoutes = {};
  let cmbRoutes = $("[name='select-routes']");
  let tbldriverQueue = $("[name='driver-queue']");

  let txtPassenger = $("[name='passenger-name']");
  let txtDest = $("[name='input-dest']");
  let txtDriver = $("[name='input-driver']");
  let txtFare = $("[name='input-fare']");

  let money = 25;

  cmbRoutes.html(
    '<option value="default" disabled selected>Choose Destination</option>'
  );

  session.init().then(function () {
    console.log("here");
    dbQuery.execute("Select * From routestbl; ").then(function () {
      if (dbQuery.rows() > 0) {
        allRoutes = query_result;

        for (var i = 0; i < dbQuery.rows(); i++) {
          cmbRoutes.append(
            '<option value="' +
              i +
              '">' +
              dbQuery.result(i, "dest") +
              "</option>"
          );
        }
      }
      console.log(allRoutes);
    });
  });

  cmbRoutes.off("change").on("change", function () {
    // Assuming txtSubjectCode is a valid reference to an input element
    var v = parseInt(cmbRoutes.val()) + 1;
    txtDest.val(allRoutes[cmbRoutes.val()].dest);
    txtFare.val("PHP " + allRoutes[cmbRoutes.val()].fare);
    tbldriverQueue.children("tbody").children("tr").remove();

    let arrQueue = {};
    dbQuery
      .execute(
        'SELECT queuetbl.driver, usertbl.fullname FROM queuetbl LEFT JOIN usertbl on usertbl.id = queuetbl.driver WHERE queuetbl.route = "' +
          v +
          '" ORDER BY queuetbl.date'
      )
      .then(function () {
        arrQueue = query_result;
        if (dbQuery.rows() > 0) {
          console.log(dbQuery.result(cmbRoutes.val(), "fullname"));
          console.log(txtDriver.val());
          for (var i = 0; i < dbQuery.rows(); i++) {
            tbldriverQueue
              .children("tbody")
              .append(
                "<tr>" +
                  '<td align="center" valign="middle">' +
                  dbQuery.result(i, "fullname") +
                  "</td>" +
                  "</tr>"
              );
          }
        }
        console.log(arrQueue[cmbRoutes.val()].fullname);
        txtDriver.val(arrQueue[cmbRoutes.val()].fullname);
      });
  });

  btnbuyTicket.click(function () {
    buyTicket();
  });
});
