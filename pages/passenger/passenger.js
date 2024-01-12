var passTotal = 0;

function addPass(elementId) {
  var element = $("#" + elementId); // Convert ID to jQuery object
  if (passTotal < 6) {
    let sum = parseInt(element.val()) + 1;
    element.val(sum.toString());
    updateTotal(); // Update the total
  }
}

function subPass(elementId) {
  var element = $("#" + elementId); // Convert ID to jQuery object
  if (passTotal > 0) {
    let diff = parseInt(element.val()) - 1;
    element.val(diff.toString());
    updateTotal(); // Update the total
  }
}

function updateTotal() {
  // Update passTotal based on current values of normal, student, and pwd
  passTotal =
    parseInt($("#normal").val()) +
    parseInt($("#student").val()) +
    parseInt($("#pwd").val());
  $("#input-qtytotal").val(passTotal); // Assuming this is your total input field
}

$(document).ready(function () {
  let allRoutes = {};
  let arrQueue = {};

  let cmbRoutes = $("[name='select-routes']");
  let tbldriverQueue = $("[name='driver-queue']");

  let mdlBuy = $("[name='modal-buy'");
  let mdlProceed = $("[name='modal-proceed'");
  let btnProceed = $("[name='btn-proceed']");

  let txtDest = $("[name='input-dest']");
  let txtDriver = $("[name='input-driver']");
  let txtFare = $("[name='input-fare']");
  let txtPayment = $("[name='input-payment']");
  let lblPayment = $("[name='label-payment']");

  $("#normal").val("0");
  $("#student").val("0");
  $("#pwd").val("0");
  lblPayment.html("Insert payment into the money slots");

  let route_id;
  let driver_id;
  let driver_income;

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
    dbQuery
      .execute(
        'SELECT ridetbl.*, usertbl.fullname FROM ridetbl LEFT JOIN usertbl on usertbl.id = ridetbl.driver WHERE ridetbl.route = "' +
          v +
          '" ORDER BY ridetbl.date'
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
    let selectedQueue = arrQueue.find(
      (queue) => parseInt(queue.passenger) + passTotal <= 6
    );

    if (selectedQueue) {
      // Handle the case where a suitable queue is found
      txtDriver.val(selectedQueue.fullname);
      driver_id = selectedQueue.driver;
      driver_income = parseInt(txtFare.val()) - 1;
      // Additional logic to handle the ticket purchase
      if (txtPayment.val() >= txtFare.val()) {
        dbQuery
          .executeNonQuery(
            'INSERT INTO salestbl VALUES ( Null, "' +
              txtPayment.val() +
              '", "' +
              route_id +
              '", "' +
              driver_id +
              '", "' +
              driver_income +
              '", "' +
              selectedQueue.id +
              '", "' +
              passTotal +
              '", "' +
              Date.now() +
              '", Default);'
          )
          .then(function () {
            dbQuery
              .executeNonQuery(
                "UPDATE ridetbl SET passenger = passenger + " +
                  passTotal +
                  ' WHERE id = "' +
                  selectedQueue.id +
                  '"'
              )
              .then(function () {
                passTotal = 0;
                window.location.reload();
              });
          });
      } else {
        lblPayment.html("Not enough payment*");
      }
    } else {
      alert("No Suitable Ride found on queue.");
    }
  });
});
