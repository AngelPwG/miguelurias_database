package com.muteam.backend.repository;

import com.muteam.backend.model.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrupoRepository extends JpaRepository<Grupo, Long> {
    List<Grupo> findByArticuloId(Long articuloId);
}
