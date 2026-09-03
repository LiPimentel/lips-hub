#!/usr/bin/env bash
# Prepara la carpeta que se publica en el sitio (dist/).
#
# Solo entra lo que el sitio necesita para funcionar (y version.json, que
# genera este mismo script). El resto del repo
# (docs/, release-notes/, .claude/, .github/) es memoria de trabajo y no debe
# quedar accesible desde el navegador — hoy en Netlify sí lo está, porque se
# publica la raíz del repo tal cual.
#
# Si algún día se agregan imágenes o CSS propios, ponerlos en assets/ y se
# publican solos. Cualquier archivo nuevo en la raíz que el sitio necesite hay
# que agregarlo aquí, o no llegará al sitio.
set -euo pipefail

cd "$(dirname "$0")"
rm -rf dist
mkdir -p dist

cp ./*.html dist/
cp ./*.js dist/
cp _headers dist/

if [ -d assets ]; then
  cp -r assets dist/
fi

# Identificador de esta compilacion. update-notice.js lo lee al cargar la
# pagina y lo vuelve a pedir cada tanto: si cambio, es que se publico una
# version nueva mientras la persona tenia la pestana abierta, y le muestra el
# banner de "recarga". Se prefiere el commit (dos compilaciones del mismo
# codigo dan el mismo valor y no disparan un aviso falso); la fecha es solo
# el respaldo por si no hay git ni variables del entorno de compilacion.
BUILD_ID="${WORKERS_CI_COMMIT_SHA:-${CF_PAGES_COMMIT_SHA:-${COMMIT_REF:-}}}"
if [ -z "$BUILD_ID" ]; then
  BUILD_ID="$(git rev-parse HEAD 2>/dev/null || true)"
fi
if [ -z "$BUILD_ID" ]; then
  BUILD_ID="$(date -u +%Y%m%d%H%M%S)"
fi
printf '{"version":"%s"}\n' "${BUILD_ID:0:12}" > dist/version.json

echo "dist/ listo con $(find dist -type f | wc -l) archivos:"
find dist -type f | sort
