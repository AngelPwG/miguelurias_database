package com.muteam.backend.repository;

import com.muteam.backend.model.PersonaEvento;
import com.muteam.backend.model.PersonaEventoKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonaEventoRepository extends JpaRepository<PersonaEvento, PersonaEventoKey> {
    List<PersonaEvento> findByPersonaId(Long personaId);

    List<PersonaEvento> findByEventoId(Long eventoId);

    void deleteByPersonaId(Long personaId);
}
