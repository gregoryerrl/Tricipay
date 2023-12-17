<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link href="../../plugins/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="../../plugins/icons/font/bootstrap-icons.min.css" rel="stylesheet">
</head>

<body>
    <div class="container mt-5">
        <div class="d-flex px-auto">

            <img onclick="redirect('../../index.php')" class="my-3 mx-auto" src="../../assets/images/tricipay_icon.png" style="width: 10%;cursor: pointer">
        </div>
        <div class="card border-warning bg-light">
            <div class="card-header bg-dark text-white text-center">Login</div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" class="form-control" id="username" name="username" placeholder="Enter username">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" name="password" placeholder="Enter password">
                </div>
                <div class="error-message" name="error-message"></div>
                <button name="login" class="btn btn-warning me-2 mt-1">Login</button>
                <button class="btn btn-secondary me-2 mt-1"> Use QR<i class="ms-2 bi bi-qr-code-scan"></i></button>
                <a href="../../pages/signup/signup.php" class="btn btn-dark mt-1 float-end">Sign Up</a>
            </div>
        </div>
    </div>

    <script src="../../plugins/jquery/jquery.min.js"></script>
    <script src="../../helpers/helpers.js"></script>
    <script src="../../plugins/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <script src="login.js"></script>

</body>

</html>