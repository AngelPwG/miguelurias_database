package com.muteam.backend.repository;

import com.muteam.backend.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PersonaRepository extends JpaRepository<Persona, Long> {

        @Query("SELECT p FROM Persona p, Articulo a WHERE p.articuloId = a.id AND a.nivelAcceso <= :nivel")
        Page<Persona> findAllByNivelAcceso(@Param("nivel") Integer nivel, Pageable pageable);

        @Query("SELECT new com.muteam.backend.dto.response.PersonaSimpleDTO(p.id, p.nombre) FROM Persona p, Articulo a WHERE p.articuloId = a.id AND a.nivelAcceso <= :nivel")
        java.util.List<com.muteam.backend.dto.response.PersonaSimpleDTO> findAllSimpleByNivelAcceso(
                        @Param("nivel") Integer nivel);

        @Query("SELECT new com.muteam.backend.dto.response.PersonaCardDTO(p.id, p.nombre, p.apodos, (SELECT m.url FROM Multimedia m WHERE m.id = (SELECT MIN(img.id) FROM Articulo art JOIN art.galeria img WHERE art.id = a.id)), a.autorId) FROM Persona p, Articulo a WHERE p.articuloId = a.id AND a.nivelAcceso <= :nivel")
        Page<com.muteam.backend.dto.response.PersonaCardDTO> findAllCardsByNivelAcceso(@Param("nivel") Integer nivel,
                        Pageable pageable);

}
