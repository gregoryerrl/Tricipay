$(document).ready(function () {
  let lblFullname = $("[name='fullname']");
  let lblStart = $("[name='route-start']");
  let lblDest = $("[name='route-dest']");
  let btnLogout = $("[name='logout']");

  session.init().then(function () {
    lblFullname.html(session.get("fullname"));

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

  btnLogout.click(function () {
    session.destroy().then(function () {
      window.location.href = "../index.php";
    });
  });
});
