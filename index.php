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
            color: #333;
        }

        .status {
            color: green;
            font-weight: bold;
        }

        /* Alap formázások az űrlapokhoz és kártyákhoz */
        .container {
            background: white;
            padding: 25px;
            border-radius: 8px;
            max-width: 400px;
            margin: 20px auto;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        input {
            display: block;
            width: 100%;
            margin-bottom: 15px;
            padding: 10px;
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        button {
            padding: 10px 15px;
            cursor: pointer;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            width: 100%;
            font-size: 16px;
        }

        button:hover {
            background: #218838;
        }

        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fff;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        nav button {
            width: auto;
            background: #dc3545;
        }
        
        nav button:hover {
            background: #c82333;
        }
    </style>
</head>

<body>
    <h1>Receptgyűjtemény</h1>

    <?php
    echo "<p class='status'>Szerver állapota: Online (" . date("Y-m-d H:i") . ")</p>";
    ?>

    <main id="app"></main>

    <script src="assets/js/api.js"></script>
    <script src="assets/js/auth.js"></script>
    <script src="assets/js/ui.js"></script>
    <script src="assets/js/router.js"></script>
</body>

</html>