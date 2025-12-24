package com.muteam.backend.repository;

import com.muteam.backend.model.Articulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticuloRepository extends JpaRepository<Articulo, Long> {
    // ---------------------------------------------------------
    // 1. FILTRADO BÁSICO (Por Autor)
    // ---------------------------------------------------------
    // SQL Generado: SELECT * FROM articulos WHERE autor_id = ?
    List<Articulo> findByAutorId(Long autorId);

    // ---------------------------------------------------------
    // 2. PARA EL FEED (Cronológico)
    // ---------------------------------------------------------
    // Trae todos los artículos, pero los más nuevos primero.
    // SQL Generado: SELECT * FROM articulos ORDER BY fecha_creacion DESC
    List<Articulo> findAllByOrderByFechaCreacionDesc();

    // ---------------------------------------------------------
    // 3. BÚSQUEDA (Barra de búsqueda del Navbar)
    // ---------------------------------------------------------
    // Busca artículos cuyo título contenga el texto (ignorando mayúsculas/minúsculas)
    // SQL Generado: SELECT * FROM articulos WHERE LOWER(titulo) LIKE LOWER(%?%)
    List<Articulo> findByTituloContainingIgnoreCase(String texto);

    // ---------------------------------------------------------
    // 4. COMBINADO (Perfil de amigo ordenado)
    // ---------------------------------------------------------
    // "Dame los artículos de Juan, ordenados por fecha"
    // SQL Generado: SELECT * FROM articulos WHERE autor_id = ? ORDER BY fecha_creacion DESC
    List<Articulo> findByAutorIdOrderByFechaCreacionDesc(Long autorId);
}