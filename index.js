$(document).ready(function () {
  session.init().then(function () {
    if (session.get("user_id")) {
      window.location.href = "pages/dashboard/dashboard.php";
    }
  });
});
