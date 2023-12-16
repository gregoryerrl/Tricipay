<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>

    <link href="../plugins/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body style=" background-image: url('../assets//images/right_left.png');">
    <div class="container mt-2">
        <a href="../index.php" class="position-absolute btn btn-secondary" style="text-decoration:none; cursor:pointer;top:5%; left:5%">
            < </a>
                <div class="d-flex align-items-center justify-content-center mb-2 w-100">
                    <img class="me-4" src="../assets/images/tricipay_icon.png" style="width: 10%;">

                </div>
                <div class="d-flex justify-content-around w-100 mt-5">
                    <h1 style="color: orange">Brgy. Malusak Station</h1>
                    <div class="input-group input-group-sm mb-3 w-50">
                        <select class="form-select rounded bg-warning p-3" style="font-size:large" name="select-routes"></select>
                    </div>
                </div>

                <div class="card card-body w-100 h-50 d-flex flex-row" style="background-color: rgba(255, 255, 255, 0.1); ">
                    <div class="overflow-scroll bg-warning" style="width: 33.33%; height:100%;">
                        <table name="driver-queue" class="table table-dark table-striped">
                            <thead class="">
                                <tr class="">
                                    <th style="text-align: center;">Driver Queue</th>
                                </tr>
                            </thead>
                            <tbody class="table-warning">
                            </tbody>
                        </table>
                    </div>
                    <div class="d-flex flex-column" style="width:66.67%">
                        <div class="w-100 bg-secondary d-flex align-items-center justify-content-center" style="height:23em; color:white;">MAP</div>
                        <button class="btn btn-warning w-50 mt-3 mx-auto" name="buy-ticket" data-bs-toggle="modal" data-bs-target="#exampleModal">Buy Ticket</button>
                    </div>
                </div>

    </div>
    </div>

    <<div class="modal h-auto" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Buy Ticket</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container d-flex flex-column py-2">
                        <select name="passenger-type" class="form-select mb-3" aria-label="Select Passenger Type">
                            <option selected>Select Passenger Type</option>
                            <option value="1">Regular</option>
                            <option value="2">Student / Senior</option>
                            <option value="3">PWD</option>
                        </select>
                        <div class="input-group mb-3">
                            <input name="passenger-name" type="text" class="form-control" placeholder="Passenger Name (Optional)" aria-label="Username">
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text" id="basic-addon1">Destination</span>
                            <input name="input-dest" type="text" class="form-control" placeholder="" aria-describedby="basic-addon1" readonly>
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text" id="basic-addon2">Driver</span>
                            <input name="input-driver" type="text" class="form-control" placeholder="" aria-describedby="basic-addon2" readonly>
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text" id="basic-addon3">Fare</span>
                            <input name="input-fare" type="text" class="form-control" placeholder="" aria-describedby="basic-addon3" readonly>
                        </div>
                        <div class="w-100 d-flex flex-column justify-content-center">
                            <h5>Insert Bills:</h5>
                            <div class="input-group">
                                <span class="input-group-text" id="basic-addon4">PHP</span>
                                <input name="input-payment" type="text" class="form-control" placeholder="" aria-describedby="basic-addon4">
                            </div>
                            *Insert payment into the money slots*
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-warning">PROCEED</button>
                </div>
            </div>
        </div>
        </div>

        <script src="../plugins/jquery/jquery.min.js"></script>
        <script src="../helpers/helpers.js"></script>
        <script src="../plugins/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
        <script src="passenger.js"></script>
</body>

</html>