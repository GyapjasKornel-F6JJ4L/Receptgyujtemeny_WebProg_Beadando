<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ReceptMester</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body style="background: #eef2f6; min-height: 100vh;">

    <nav class="navbar navbar-expand-lg bg-white shadow-sm sticky-top px-3 py-2 mb-4">
        <div class="container" style="max-width: 1000px;">
            <a class="navbar-brand fw-bold" href="#home" style="color: #1e293b; font-size: 1.4rem;">
                🍳 ReceptMester
            </a>
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mainNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link fw-bold" href="#home" style="color: #64748b;">Kezdőlap</a>
                    </li>
                </ul>
                <ul class="navbar-nav ms-auto align-items-center">
                    <li class="nav-item">
                        <a class="btn-gradient text-decoration-none px-4" href="#login" id="login-link">Bejelentkezés</a>
                    </li>
                    <li class="nav-item dropdown d-none" id="profile-dropdown">
                        <a class="nav-link dropdown-toggle fw-bold" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" style="color: #1e293b;">
                            👤 Profil
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2" style="border-radius: 12px;">
                            <li><a class="dropdown-item py-2 fw-bold" href="#add-recipe" style="color: #1d4ed8;">+ Új recept</a></li>
                            <li><a class="dropdown-item py-2" href="#my-recipes">📖 Saját receptjeim</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><button class="dropdown-item py-2 fw-bold text-white text-center rounded mx-auto" style="background: linear-gradient(135deg, #ef4444 0%, #f97316 100%); width: 90%;" id="logout-btn-global">Kijelentkezés</button></li>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <main id="app" class="container" style="max-width: 1000px; padding-bottom: 50px;"></main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/api.js"></script>
    <script src="assets/js/auth.js"></script>
    <script src="assets/js/ui.js"></script>
    <script src="assets/js/router.js"></script>
    <script>
        // Kijelentkezés összekötése
        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('logout-btn-global')?.addEventListener('click', () => {
                if(typeof Auth !== 'undefined') Auth.logout();
            });
        });
    </script>
</body>
</html>