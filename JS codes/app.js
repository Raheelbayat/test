<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pocket Classroom</title>

    <link rel="icon" href="favicon-32x32.png" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="style.css" />
  </head>

  <body>
    <div class="rectangle">
      <p></p>
    </div>

    <!-- HEADER -->
    <div class="container-fluid bg-pink py-3 d-flex flex-wrap align-items-center justify-content-between">
      <div class="d-flex align-items-center gap-3">
        <img src="favicon-32x32.png" width="60" height="60" alt="Logo" class="rounded-circle bg-light p-2" />
        <h1 class="text-white fw-bold mb-0">Pocket Classroom</h1>
      </div>

      <nav class="navbar navbar-expand-lg navbar-dark">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarMenu">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link" href="/">Library</a></li>
            <li class="nav-item"><a class="nav-link" href="/author">Author</a></li>
            <li class="nav-item"><a class="nav-link" href="/learn">Learn</a></li>
          </ul>

          <section id="libraryView" class="view mt-3"></section>
          <section id="authorView" class="view mt-3" style="display:none;"></section>
          <section id="learnView" class="view mt-3" style="display:none;"></section>
        </div>
      </nav>
    </div>

    <!-- MAIN CONTENT -->
    <main class="container mt-4">
      <div id="entry"></div>
    </main>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
  <script type="module" src="JS_codes/index.js"></script>
  </body>
</html>
