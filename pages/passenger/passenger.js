$(document).ready(function () {
  let allRoutes = {};
  let cmbRoutes = $("[name='select-routes']");
  let tbldriverQueue = $("[name='driver-queue']");

  let mdlBuy = $("[name='modal-buy'");
  let mdlProceed = $("[name='modal-proceed'");
  let btnProceed = $("[name='btn-proceed']");

  let txtPassenger = $("[name='passenger-name']");
  let txtDest = $("[name='input-dest']");
  let txtDriver = $("[name='input-driver']");
  let txtFare = $("[name='input-fare']");
  let txtPayment = $("[name='input-payment']");
  let lblPayment = $("[name='label-payment']");

  txtPayment.val("0");
  lblPayment.html("Insert payment into the money slots");

  let route_id;
  let driver_id;
  let driver_income;

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
    txtFare.val(allRoutes[cmbRoutes.val()].fare);
    route_id = allRoutes[cmbRoutes.val()].id;
    tbldriverQueue.children("tbody").children("tr").remove();

    let arrQueue = {};
    dbQuery
      .execute(
        'SELECT queuetbl.*, usertbl.fullname FROM queuetbl LEFT JOIN usertbl on usertbl.id = queuetbl.driver WHERE queuetbl.route = "' +
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
        txtDriver.val(arrQueue[cmbRoutes.val()].fullname);
        driver_id = arrQueue[cmbRoutes.val()].driver;
        driver_income = parseInt(txtFare.val()) - 1;
      });
  });

  btnProceed.click(function () {
    console.log("PROCEED");
    console.log(txtPayment.val());
    console.log(txtFare.val());
    console.log(txtPayment.val() >= txtFare.val());
    if (txtPayment.val() >= txtFare.val()) {
      dbQuery.executeNonQuery(
        'INSERT INTO salestbl VALUES ( Null, "' +
          txtPayment.val() +
          '", "' +
          driver_id +
          '", "' +
          route_id +
          '", "' +
          driver_income +
          '", Null,  "' +
          Date.now() +
          '", Default);'
      );
    } else {
      lblPayment.html("Not enough payment*");
    }
  });
});
