#!/bin/bash

# Script para crear APK correctamente
# Uso: ./build-apk.sh [preview|production]

set -e

PROFILE=${1:-preview}

echo "================================"
echo "🚀 Iniciando build de APK"
echo "Perfil: $PROFILE"
echo "================================"

# Paso 1: Verificar que EAS CLI está instalado
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI no está instalado"
    echo "Instálalo con: npm install -g eas-cli"
    exit 1
fi

# Paso 2: Verificar que estamos en la carpeta correcta
if [ ! -f "app.json" ]; then
    echo "❌ No estás en la carpeta del proyecto (falta app.json)"
    exit 1
fi

# Paso 3: Verificar que package.json existe
if [ ! -f "package.json" ]; then
    echo "❌ No encuentro package.json"
    exit 1
fi

echo "  Configuración verificada"

# Paso 4: Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Paso 5: Limpiar caché
echo "🧹 Limpiando caché..."
rm -rf .expo
rm -rf node_modules/.cache

# Paso 6: Ejecutar build
echo "🔨 Creando APK con perfil: $PROFILE"
eas build --platform android --profile "$PROFILE"

echo ""
echo "================================"
echo "  Build completado!"
echo "================================"
echo ""
echo "Próximos pasos:"
echo "1. Abre el enlace proporcionado por EAS"
echo "2. Descarga el APK"
echo "3. Instala en tu dispositivo Android:"
echo "   adb install app-release.apk"
echo ""
