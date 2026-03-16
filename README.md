# Patrick Landing

`patrick.cuatrobet.com` is the raw/source landing repo for the Patrick campaign. It keeps the Patrick hero/logo shell and a lightweight English signup form that follows the original landing structure: email, password, confirm password.

## What is standardized

- `index.html` keeps the Patrick shell and the original English signup copy.
- `src/js/modules/` contains the lightweight validation, clear-button, password-toggle, and generic submit-hook behavior.
- `src/styles/` keeps the Patrick form layout and background treatment.
- The shared export logic now lives in the workspace root `template/` folder so this repo stays focused on the landing itself.

## Local development

```bash
npm install
npm run dev
```

Default build:

```bash
npm run build
```

## Adapter contract

Patrick is the exception, not the new default.

Future CuatroBet landings should still follow the shared Bono-style integration path with:

- `/common/js/auth-helper-v2.js`
- `/common/js/landing-welcome-adapter.js`
- `marketing_lib_script.inc`
- MTFEF-compatible tracking/registration callbacks

Patrick itself is intentionally decoupled from that path.

- Keep `#register-form` and `#register-form-error` intact.
- Keep `name="email"`, `name="password"`, and `name="confirm_password"` intact.
- Keep a visible `.brand__logo` image so future adapters can reuse the landing logo if needed.

Submission goes through `window.patrickLandingAdapter.submit(data, { form })` when that adapter is present. If it is not connected yet, the form shows a local placeholder error instead of trying to call Cuatro-specific logic.

## Template usage

The shared export/adaptation logic lives at the workspace root in `../../template/`.

- `../../template/scripts/build-repo.mjs` is the shared exporter.
- `../../template/public/favicon.ico` is the workspace default favicon.

Patrick is the implementation repo. The root `template/` folder remains the shared workflow base for future landings, even though Patrick itself is using an exception path.

## Export to the main repo

One command builds the landing, prepares the main repo branch, copies the compiled files, wraps them with the integrated PHP shell, and stages the Patrick landing files:

```bash
npm run build:repo
```

The exporter resolves the target repo in this order:

1. `--repo-dir <path>`
2. `CUATRO_MAIN_REPO_DIR`
3. `../../repo` if it is already a git repo
4. `../../repo/inicio.cuatrobet.com`

Examples:

```bash
npm run build:repo -- --repo-dir /abs/path/to/inicio.cuatrobet.com
CUATRO_MAIN_REPO_DIR=/abs/path/to/inicio.cuatrobet.com npm run build:repo
```

## Branch and folder naming

The exporter derives everything from the landing folder name:

- subdomain: `patrick.cuatrobet.com`
- branch: `patrick`
- target folder inside the main repo: `patrick/`

## Export behavior

`npm run build:repo` will:

1. Abort if the target main repo working tree is dirty.
2. Switch the target repo to `main`.
3. Run `git pull --ff-only`.
4. Create or switch the `patrick` branch.
5. Replace `patrick/` in the target repo with the built landing.
6. Rewrite `patrick/index.html` into the integrated PHP shell with:
   - `framework/core.inc`
   - `head_scripts.inc`
   - DataDome
   - `window.landing_subdomain`
   - `window.landing_type = "registration_on_landing"`
7. Validate that the generated shell still contains the base integration markers Patrick depends on.
8. Stage only the Patrick landing folder in the target repo.

The exporter does not commit or push.

For future default landings, keep using the main documented Bono/MTFEF/API integration workflow in the workspace docs. Patrick's exported shell is intentionally lighter because this landing is an exception.
