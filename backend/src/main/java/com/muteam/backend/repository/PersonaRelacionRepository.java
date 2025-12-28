package com.muteam.backend.repository;

import com.muteam.backend.model.PersonaRelacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonaRelacionRepository extends JpaRepository<PersonaRelacion, Long> {

    @org.springframework.data.jpa.repository.Query("SELECT r FROM PersonaRelacion r WHERE r.personaOrigen.id = :personaId OR r.personaDestino.id = :personaId")
    List<PersonaRelacion> findByAnyPersonaId(
            @org.springframework.data.repository.query.Param("personaId") Long personaId);

    void deleteAllByPersonaOrigenIdOrPersonaDestinoId(Long origenId, Long destinoId);
}
