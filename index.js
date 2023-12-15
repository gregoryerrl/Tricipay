$(document).ready(function () {
  session.init().then(function () {
    if (session.get("user_id")) {
      window.location.href = "dashboard/dashboard.php";
    }
  });
});
