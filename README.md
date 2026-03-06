# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Requisitos Previos

Asegúrate de tener instalado [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/install/).

## Instrucciones para levantar el proyecto en local

El proyecto está estructurado para ejecutarse fácilmente mediante contenedores, levantando de forma simultánea el **Frontend**, el **Backend** y la **Base de Datos (PostgreSQL)**.

Sigue estos pasos para arrancar el entorno de desarrollo:

1. **Configurar las Variables de Entorno**
   - Sitúate en la **raíz del proyecto** (`Task-Manager/`).
   - Asegúrate de contar con el archivo `.env` en la raíz. Este archivo es vital porque provee la configuración al `docker-compose.yml` (credenciales de BD, tokens, puertos, etc.).
   - Revisa también si necesitas configurar o verificar el archivo `.env` específico dentro de `smart-task-frontend/` y `smart-task-backend/`.

2. **Levantar los Contenedores**
   Abre una terminal en la **raíz del proyecto** y ejecuta el siguiente comando para construir y levantar todos los servicios:
   ```bash
   docker-compose up --build
   ```
   *(Nota: si ya construiste las imágenes previamente y solo quieres volver a levantarlas, puedes usar simplemente `docker-compose up` o `docker-compose up -d` para correrlos en segundo plano).*

3. **Acceder a la Aplicación**
   Una vez que los contenedores estén corriendo, podrás acceder a los servicios:
   - **Frontend (Vue/Vite):** Abre tu navegador en [http://localhost:5173/](http://localhost:5173/).
   - **Backend (Node.js/Express):** Se estará ejecutando en el puerto definido en tu `.env` (generalmente el 3000 o 3001).
   - **Base de Datos (PostgreSQL):** El puerto por defecto (`5432`) se mapea al host, permitiéndote conectar herramientas como DBeaver, TablePlus o pgAdmin.

4. **Detener los Contenedores**
   Para detener la ejecución, simplemente presiona `Ctrl + C` en la terminal donde corres el compose, o ejecuta en otra terminal:
   ```bash
   docker-compose down
   ```
