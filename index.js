const API_URL = "http://127.0.0.1:5000"; // Base URL for your Flask API
let sessionData = {};
let passTotal = 0;
let bill = 0;
let payInterval;
let totalFare = 0;
let driverDispense = 0;

const session = {
  init: async function () {
    try {
      const response = await $.post("helpers/session.php", {action: "get"});
      sessionData = response;
    } catch (error) {
      console.error("Session initialization failed:", error);
    }
  },
  get: function (key) {
    return sessionData[key] || undefined;
  },
  set: async function (key, value) {
    try {
      await $.post("helpers/session.php", {action: "set", key, value});
    } catch (error) {
      console.error("Error setting session data:", error);
    }
  },
  destroy: async function () {
    try {
      await $.post("helpers/session.php", {action: "destroy"});
    } catch (error) {
      console.error("Error destroying session:", error);
    }
  },
};

let dbQuery = {
  execute: function (query) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: "helpers/db_query.php",
        dataType: "json",
        data: {action: "query", query: query},
        success: function (data) {
          query_result = data;
          resolve();
        },
        error: function (xhr, status, error) {
          reject(error);
        },
      });
    });
  },
  result: function (index, field) {
    if (query_result[index][field] == undefined) {
      return "";
    } else {
      return query_result[index][field];
    }
  },
  rows: function () {
    return query_result.length;
  },
  executeNonQuery: function (query) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: "helpers/db_query.php",
        data: {action: "non-query", query: query},
        success: function (data) {
          resolve(data);
        },
        error: function (xhr, status, error) {
          reject(status);
        },
      });
    });
  },
  clear: function () {
    query_result = [];
  },
};

function logPayment() {
  try {
    fetch(`${API_URL}/pay`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        bill = data.total_currency;
        console.log(bill);
        $("#payment").val(bill);
      });
  } catch (error) {
    console.error("Error logging payment:", error);
  }
}

function startListening(start) {
  if (start) {
    fetch(`${API_URL}/start-listening`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Listening status:", data.status);
        payInterval = setInterval(logPayment, 300);
      })
      .catch((error) => console.error("Error starting listening:", error));
  } else {
    clearInterval(payInterval);
    fetch(`${API_URL}/stop-listening`).catch((error) =>
      console.error("Error stopping listening:", error)
    );
  }
}

function addPass(elementId, fare) {
  var element = $("#" + elementId); // Convert ID to jQuery object
  if (passTotal < 5 && parseInt(element.val()) < 5) {
    let sum = parseInt(element.val()) + 1;
    element.val(sum.toString());
    passTotal++;
    console.log(passTotal);
    updateTotal(fare); // Update the total
  }
}

function subPass(elementId, fare) {
  var element = $("#" + elementId); // Convert ID to jQuery object
  if (passTotal > 0 && parseInt(element.val()) > 0) {
    let diff = parseInt(element.val()) - 1;
    element.val(diff.toString());
    passTotal--;
    console.log(passTotal);
    updateTotal(fare); // Update the total
  }
}

function updateTotal(fare) {
  const discountRate = 6; // 20% discount rate

  const normalPassengers = parseInt($("#normal").val());
  const studentPassengers = parseInt($("#student").val());
  const passTotal = normalPassengers + studentPassengers;

  const totalFare =
    (normalPassengers * fare) + ((studentPassengers * fare) - (discountRate * studentPassengers));

  $("#input-qtytotal").val(passTotal); // Update total passengers
  $("#input-paytotal").val(totalFare.toFixed(2)); // Update total fare
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

  txtPayment.val(bill);
  txtTotal = $("[name='input-payTotal']");
  $("#normal").val("0");
  $("#student").val("0");

  $("#payment").val("0");
  lblPayment.html("Insert payment into the money slots");

  let route_id;
  let driver_id;
  let driver_income;

  session.init().then(function () {


  txtFare.val("0");

  $("#input-paytotal").val("0");

  cmbRoutes.val('default')
    
  $("#payment").val("0");
    if (session.get("user_id")) {
      window.location.href = "pages/dashboard/dashboard.php";
    }
    console.log("here");
    dbQuery.execute("Select * From routestbl; ").then(function () {
      if (dbQuery.rows() > 0) {
        console.log(query_result);
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
  txtFare.val("0");
  $("#addnormal").click(function () {
    addPass("normal", parseFloat(txtFare.val()));
  });

  $("#subnormal").click(function () {
    subPass("normal", parseFloat(txtFare.val()));
  });

  $("#addstudent").click(function () {
    addPass("student", parseFloat(txtFare.val()));
  });

  $("#substudent").click(function () {
    subPass("student", parseFloat(txtFare.val()));
  });

  cmbRoutes.off("change").on("change", function () {
    // Assuming txtSubjectCode is a valid reference to an input element
    var v = parseInt(cmbRoutes.val()) + 1;
    console.log("here");
    console.log(v);
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
        console.log(query_result);
        if (dbQuery.rows() > 0) {
          console.log(dbQuery.result(0, "fullname"));
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
        txtDriver.val(arrQueue[0].fullname);
        driver_id = arrQueue[0].driver;
        driver_income = parseInt(txtFare.val()) - 1;
      });
  });

  btnProceed.click(function () {
    console.log(
      parseInt(txtPayment.val()) >= parseInt($("#input-paytotal").val())
    );
    let selectedQueue = arrQueue.find(
      (queue) => parseInt(queue.passenger) + passTotal <= 5
    );

    if (selectedQueue) {
      // Handle the case where a suitable queue is found
      console.log("selected" + selectedQueue.fullname);
      $("#modalLabel").html(selectedQueue.fullname);
      txtDriver.val(selectedQueue.fullname);
      driver_id = selectedQueue.driver;
      driver_income = parseInt(txtFare.val()) - 1;
      // Additional logic to handle the ticket purchase
      if (parseInt(txtPayment.val()) >= parseInt($("#input-paytotal").val())) {
        let change = parseInt(txtPayment.val()) - parseInt($("#input-paytotal").val());
        if (change > 0) {
          const data = {
            dispense: change.toString(),
          };
          fetch(`${API_URL}/dispense`, {
            // Adjust URL for Flask server
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
          });
        }
        let ref = Date.now();
        dbQuery
          .executeNonQuery(
            'INSERT INTO salestbl VALUES ( Null, "' +
            $("#input-paytotal").val() +
              '", "' +
              route_id +
              '", "' +
              driver_id +
              '", "' +
              driver_income +
              '", "' +
              selectedQueue.id +
              '", "' +
            $("#input-qtytotal").val() +
              '", "' +
              ref +
              '", Default);'
          )
          .then(function () {
            console.log(passTotal);
            dbQuery
              .executeNonQuery(
                "UPDATE ridetbl SET passenger = passenger + " +
                parseInt( $("#input-qtytotal").val()) +
                  ' WHERE id = "' +
                  selectedQueue.id +
                  '"'
              )
              .then(function () {
                const data = {
                  reference: ref.toString(),
                  stationName: "MSC Tanza Station",
                  driverName: selectedQueue.fullname,
                  destination: allRoutes[cmbRoutes.val()].dest,
                  passenger: passTotal.toString(),
                  totalFare: $("#input-paytotal").val(),
                  timeAndDate: new Date().toLocaleString(),
                };
                  console.log(data);
                fetch("http://127.0.0.1:5000/print", {
                  // Adjust URL for Flask server
                  method: "POST",
                  headers: {"Content-Type": "application/json"},
                  body: JSON.stringify(data),
                })
                  .then((response) => response.json())
                  .then((result) => {console.log(result.success);
                    $("#input-qtytotal").val(passTotal);
                    dbQuery.execute('SELECT * from ridetbl WHERE driver = "' + driver_id +'"').then(function () {
                      if (parseInt(dbQuery.result(0, "passenger")) >= 5){

                        fetch("http://127.0.0.1:5000/stop-listening");
                        $("#payment").val("0");
                        alert("Purchase Success. Get ticket");
                        $('#confirmModal').modal('show');
                        $('#exampleModal').modal('hide');
                        dbQuery.execute('Select * from salestbl WHERE ride_id = "' + selectedQueue.id +'"').then(function () {
                          
                          for (var i = 0; i < dbQuery.rows(); i++) {
                            driverDispense += parseInt(dbQuery.result(i, "total"));
                          }
                        })
                      } else {
                        fetch("http://127.0.0.1:5000/stop-listening");
                         $("#payment").val("0");
                         alert("Purchase Success. Get ticket");
                        window.location.reload();
                      }
                    }
                    )
                    
                  
              });
              });
          });
      }  else {
        lblPayment.html("Not enough payment*");
      }
    } else {
      alert("No Suitable Ride found on queue.");
    }
  });

  let qrCodeResult = "";

  $("#cameraModal").on("show.bs.modal", function (event) {
    const video = document.getElementById("cameraStream");
    const canvasElement = document.createElement("canvas");
    const canvas = canvasElement.getContext("2d");

    function scanQRCode() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(
          video,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        const imageData = canvas.getImageData(
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          qrCodeResult = code.data;
          console.log("QR Code result:", qrCodeResult);
          let status = "Standby";
          dbQuery.execute('SELECT * FROM ridetbl WHERE driver = "' + qrCodeResult + '"').then(function () {
            if (dbQuery.rows() > 0){
              status = "Queued";
            }
            console.log(dbQuery.rows())
            console.log(status)
          }).then(function () {
            dbQuery
            .execute('SELECT * FROM usertbl WHERE id = "' + qrCodeResult + '"')
            .then(function () {
              if (status == "Standby") {
                if (dbQuery.result(0, "role") == "driver") {
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
                      dbQuery.result(0, "route") +
                      '", "' +
                      d +
                      '", "' +
                      qrCodeResult +
                      '", 0, "");'
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
          })
          
        }
      }
    }

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({video: {facingMode: "environment"}})
        .then(function (stream) {
          video.srcObject = stream;
          const scanInterval = setInterval(scanQRCode, 1000); // Scan every 100 milliseconds
        })
        .catch(function (error) {
          console.error("Error accessing the camera: ", error);
        });
    } else {
      alert("Your browser does not support media devices.");
    }
  });

  $("#cameraModal").on("hidden.bs.modal", function (event) {
    const video = document.getElementById("cameraStream");
    if (video.srcObject) {
      video.srcObject.getTracks().forEach((track) => track.stop());
    }
    video.srcObject = null;
  });

  $("#dispenseBtn").click(function () {
    console.log("dispense")
    let driverTotal = driverDispense - 1;
    const data = {
      dispense: driverTotal.toString(),
    };
    fetch(`${API_URL}/dispense`, {
      // Adjust URL for Flask server
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data),
    })
    dbQuery.executeNonQuery('DELETE FROM ridetbl WHERE driver = "' + driver_id +'"').then(function () {
      alert("Get Driver Income");
      window.location.reload();
    });
    });

});


