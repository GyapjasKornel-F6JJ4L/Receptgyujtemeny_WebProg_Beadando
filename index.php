<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Receptgyűjtemény SPA + OOP + JSON</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
<link rel="stylesheet" href="assets/css/style.css">
  </head>
  <body>
    <header class="p-3 mb-4">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
      
      <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="Logo" width="30" height="24" class="d-inline-block align-text-top">
        Receptgyűjtemény
      </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#home">Kezdőlap</a>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 auth-links">
              <!-- Bejelentkezés link mindig látható alapértelmezetten -->
              <li class="nav-item">
                <a class="nav-link" href="#login" id="login-link">Bejelentkezés</a>
              </li>
              <!-- Profil dropdown csak akkor látható, ha be vagyunk jelentkezve -->
              <li class="nav-item dropdown d-none" id="profile-dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Profil
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#add-recipe">Új recept feltöltés</a></li>
                  <li><a class="dropdown-item" href="#my-recipes">Receptjeim</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#" id="logout-link">Kijelentkezés</a></li>
                </ul>
              </li>
            </ul>
          
        </div>
      </div>
    </nav>
    <nav class="search-nav">
      <form class="d-flex" role="search">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>
      </nav>
    </header>

    <main id="app"></main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
    <script src="assets/js/api.js"></script>
    <script src="assets/js/auth.js"></script>
    <script src="assets/js/ui.js"></script>
    <script src="assets/js/router.js"></script>
</body>

</html>