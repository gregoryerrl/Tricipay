<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>

    <link href="../plugins/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body style=" background: rgb(0,0,0);">
    <div class="container mt-2">
        <div class="d-flex align-items-center mb-3">
            <img class="me-3" src="../assets/images/tricipay_icon.png" style="width: 5%;">
            <a href="../index.php" class="btn btn-warning" style="text-decoration:none; color:inherit">
                Home
            </a>

        </div>
        <h1 style="color: orange">Brgy. Malusak Station</h1>

        <div class="mt-3 overflow-scroll rounded">
                <table name="table-routes" class="table table-striped">
                    <thead class="bg-warning">
                        <tr class="bg-warning">
                            <th style="text-align: center;">Select Destination</th>
                            <th style="text-align: center;"></th>
                        </tr>
                    </thead>
                    <tbody class="table-secondary">
                    </tbody>
                </table>
            </div>

    </div>
    </div>

    <script src="../plugins/jquery/jquery.min.js"></script>
    <script src="../helpers/helpers.js"></script>
    <script src="../plugins/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <script src="passenger.js"></script>
</body>

</html>