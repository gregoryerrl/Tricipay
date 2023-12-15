<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>

    <link href="../plugins/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="bg-warning d-flex flex-row" style="font-weight:lighter;">
    <div style="position:absolute; top:0; width:100vw; background: #453f00; height:25%; z-index:-1"></div>
    <div class="bg-dark d-flex flex-column" style="height:100%; width:15%; overflow:auto; position:fixed; color:white">
        <div class="rounded-circle bg-light mx-auto my-3" style="width: 75%; aspect-ratio: 1/1">
            <img src="../assets/images/tricipay_icon.png" style="width: 100%;">
        </div>
        <h3 class="ps-3 py-2 border-top mt-3">Income</h3>
        <h3 class="ps-3 py-2 border-top">Trip History</h3>
        <h3 class="ps-3 py-2 border-top border-bottom">Profile Settings</h3>
        <div class="position-relative w-100" style="height:80%;">

            <button name="logout" class="btn btn-danger position-absolute start-50 translate-middle" style="bottom: 5%;">Log Out</button>
        </div>
    </div>
    <div class="container p-3" style="margin-left: 15%;">
        <div class="d-flex m-4" style="color:white;">
            <h1 class="me-2">Hello!</h1>
            <h1 name="fullname" style="font-weight:bold; text-decoration:underline"></h1>
        </div>
        <div class="d-flex flex-row">
            <div class="card card-body d-flex flex-column p-3 mx-2" style="width:33.33%">
                <h3 class="text-center w-100">Current Route:</h3>
                <div class="w-100 justify-content-center align-items-center d-flex flex-row mt-3 mb-4">
                    <h4 class="me-2" name="route-start"></h4>—<h4 class="ms-2" name="route-dest"></h4>
                </div>
                <div class="d-flex flex-row align-items-center justify-content-center">
                    <button class="btn btn-warning me-3">Standby</button>
                    <button class="btn btn-info">Queue</button>
                    <button class="btn btn-secondary ms-3">Edit Route</button>
                </div>
            </div>
            <div class="card card-body d-flex flex-column p-3 mx-2" style="width:33.33%">
                <h3 class="text-center w-100">Status:</h3>
            </div>
            <div class="card card-body d-flex flex-column p-3 mx-2" style="width:33.33%">
                <h3 class="text-center w-100">Income Today:</h3>
            </div>
        </div>
    </div>
    </div>
    <script src="../plugins/jquery/jquery.min.js"></script>
    <script src="../helpers/helpers.js"></script>
    <script src="../plugins/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <script src="dashboard.js"></script>
</body>

</html>