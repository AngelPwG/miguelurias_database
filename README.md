# Miguel-Urias Database

> **Una Wiki interactiva y segura para gestionar el "Lore" de nuestro grupo.**

![Project Status](https://img.shields.io/badge/Status-In%20Development-orange)
![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Supabase](https://img.shields.io/badge/DB-PostgreSQL%20%2F%20Supabase-3ecf8e)

## 📋 Sobre el Proyecto

Este proyecto es una aplicación web Full-Stack diseñada para recopilar, organizar y visualizar la información de un grupo. Funciona como un CMS (Sistema de Gestión de Contenidos) especializado que permite registrar **Personajes**, **Eventos** y **Grupos**, estableciendo relaciones complejas entre ellos (quién asistió a qué evento, quién pertenece a qué grupo).

El diferenciador clave es su **Sistema de Niveles de Seguridad (1-5)**, que permite ocultar o mostrar secciones específicas de un artículo dependiendo del nivel de confianza del usuario logueado.

## 🚀 Tecnologías (The Stack)

El proyecto utiliza una arquitectura moderna de microservicios monolíticos:

* **Backend:** Java 21 + Spring Boot 3 (Security, JPA/Hibernate, Web).
* **Frontend:** React.js.
* **Base de Datos:** PostgreSQL (alojado en Supabase).
* **Multimedia:** Cloudinary (Almacenamiento de imágenes y videos).
* **Seguridad:** Spring Security + JWT (JSON Web Tokens).

## ✨ Funcionalidades Principales (MVP)

* **🔐 Autenticación Robusta:** Login seguro con roles y niveles de acceso (Nivel 1: Público -> Nivel 5: Admin).
* **📖 Artículos Modulares:** La información se divide en "Secciones". Un usuario de nivel bajo no puede ver secciones de nivel alto (Censura dinámica en Backend).
* **🕸️ Relaciones Cruzadas:** Vinculación automática entre Personajes, Grupos y Eventos.
* **📸 Galería Multimedia:** Soporte para subir fotos a eventos o personajes usando Cloudinary.
* **🔍 Directorio Visual:** Feed de tarjetas para explorar a los integrantes y la línea de tiempo.

## 🗄️ Modelo de Datos

El sistema se basa en un esquema relacional optimizado con **Relaciones Polimórficas** para la multimedia y una estructura centralizada en la tabla `Artículos` para facilitar la escalabilidad.

## 🛠️ Instalación y Configuración

### Prerrequisitos
* Java 21 JDK
* Node.js & npm
* Cuenta en Supabase y Cloudinary

### Pasos para correr el Backend
1.  Clonar el repositorio.
2.  Configurar las variables de entorno en `src/main/resources/application.properties` (o `.env`):
    ```properties
    SPRING_DATASOURCE_URL=...
    CLOUDINARY_URL=...
    JWT_SECRET=...
    ```
3.  Ejecutar: `./mvnw spring-boot:run`

### Pasos para correr el Frontend
1.  Ir a la carpeta `frontend`: `cd frontend`
2.  Instalar dependencias: `npm install`
3.  Iniciar servidor: `npm start`

---
Desarrollado con ❤️ y mucha monster por MUTeam.
