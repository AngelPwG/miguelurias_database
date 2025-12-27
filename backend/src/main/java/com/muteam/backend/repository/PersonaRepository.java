package com.muteam.backend.repository;

import com.muteam.backend.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonaRepository
        extends JpaRepository<Persona, Long> { }
