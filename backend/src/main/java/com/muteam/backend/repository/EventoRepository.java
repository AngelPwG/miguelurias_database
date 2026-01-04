package com.muteam.backend.repository;

import com.muteam.backend.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
    List<Evento> findByArticuloId(Long articuloId);

    @Query("SELECT e FROM Evento e, Articulo a WHERE e.articuloId = a.id AND a.nivelAcceso <= :nivel")
    Page<Evento> findAllByNivelAcceso(@Param("nivel") Integer nivel, Pageable pageable);

    @Query("SELECT new com.muteam.backend.dto.response.EventoSimpleDTO(e.id, e.nombre) FROM Evento e, Articulo a WHERE e.articuloId = a.id AND a.nivelAcceso <= :nivel")
    List<com.muteam.backend.dto.response.EventoSimpleDTO> findAllSimpleByNivelAcceso(@Param("nivel") Integer nivel);

    @Query("SELECT new com.muteam.backend.dto.response.EventoCardDTO(e.id, e.nombre, e.fechaIni, e.ubicacion, (SELECT m.url FROM Multimedia m WHERE m.id = (SELECT MIN(img.id) FROM Articulo art JOIN art.galeria img WHERE art.id = a.id))) FROM Evento e, Articulo a WHERE e.articuloId = a.id AND a.nivelAcceso <= :nivel")
    Page<com.muteam.backend.dto.response.EventoCardDTO> findAllCardsByNivelAcceso(@Param("nivel") Integer nivel,
            Pageable pageable);
}
