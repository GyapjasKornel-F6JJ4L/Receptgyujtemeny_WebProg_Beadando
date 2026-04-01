<!DOCTYPE html>
<html lang="hu">

<head>
    <meta charset="UTF-8">
    <title>Receptgyűjtemény SPA + OOP + JSON</title>
    <style>
        body {
            font-family: sans-serif;
            background: #f4f4f4;
            padding: 20px;
        }

        .status {
            color: green;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <h1>Receptgyűjtemény Teszt</h1>

    <?php
    //Itt PHP kódot is futtathatsz az oldal generálásakor
    echo "<p class='status'>Szerver állapota: Online (" . date("Y-m-d H:i") . ")</p>";
    ?>

    <p>Nézd meg a böngésző konzolját (F12) az adatokért!</p>

    <script src="assets/js/api.js"></script>
</body>

</html>