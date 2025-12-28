package com.muteam.backend.repository;

import com.muteam.backend.model.Seccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeccionRepository extends JpaRepository<Seccion, Long> {

    // TRADUCCIÓN: "Busca por ID de artículo y ordénalo por la columna 'orden'
    // ascendente"
    // SQL Generado: SELECT * FROM secciones WHERE articulo_id = ? ORDER BY orden
    // ASC
    List<Seccion> findByArticuloIdOrderByOrdenAsc(Long articuloId);

    // Borra todas las secciones de un artículo (útil para updates: borrar y
    // recrear)
    @org.springframework.data.jpa.repository.Modifying
    @jakarta.transaction.Transactional
    void deleteAllByArticuloId(Long articuloId);
}