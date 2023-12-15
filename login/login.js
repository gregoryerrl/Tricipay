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
                session.set("user_id", dbQuery.result(0, "id")),
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
});
