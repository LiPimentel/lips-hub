#!/usr/bin/env bash
# Prepara la carpeta que se publica en el sitio (dist/).
#
# Solo entra lo que el sitio necesita para funcionar. El resto del repo
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

echo "dist/ listo con $(find dist -type f | wc -l) archivos:"
find dist -type f | sort
