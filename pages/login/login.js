$(document).ready(function () {
  let txtUsername = $("[name='username']");
  let txtPassword = $("[name='password']");
  let lblErrorMessage = $("[name='error-message']");
  let btnLogin = $("[name='login']");

  session.init().then(function () {
    console.log("login session");
    if (session.get("user_id") !== undefined) {
    }
  });

  txtUsername.keypress(function (e) {
    if (e.which == 13) {
      txtPassword.focus().select();
    }
  });
  txtPassword.keypress(function (e) {
    if (e.which == 13) {
      btnLogin.click();
    }
  });

  btnLogin.click(function (e) {
    console.log("submitting");
    let formIncomplete = txtUsername.val() == "" || txtPassword.val() == "";

    lblErrorMessage.removeClass("active");

    if (formIncomplete) {
      lblErrorMessage.html("Please fill all the required fields");
      lblErrorMessage.addClass("active");
      txtUsername.focus().select();
    } else {
      console.log(txtPassword.val());
      dbQuery
        .execute(
          'SELECT * FROM usertbl WHERE username = "' + txtUsername.val() + '"'
        )
        .then(function (e) {
          console.log(dbQuery.result(0, "route"));
          if (dbQuery.rows() > 0) {
            if (dbQuery.result(0, "password") !== txtPassword.val()) {
              lblErrorMessage.html("Invalid Password");
              lblErrorMessage.addClass("active");
              txtPassword.focus().select();
            } else {
              Promise.all([
                session.set("id", dbQuery.result(0, "id")),
                session.set("role", dbQuery.result(0, "role")),
                session.set("fullname", dbQuery.result(0, "fullname")),
                session.set("route", dbQuery.result(0, "route") ?? NULL),
              ]).then(function () {
                window.location.href = "../dashboard/dashboard.php";
              });
            }
          } else {
            lblErrorMessage.html("Invalid Credentials");
            lblErrorMessage.addClass("active");
            txtUsername.focus().select();
          }
        });
    }
  });

  function redirect(url) {
    window.location.href = url;
  }

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
          console.log("QR Code result:", qrCodeResult); // Log the QR code content
          // You can also stop scanning once a QR code is found
          // clearInterval(scanInterval);
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
});
