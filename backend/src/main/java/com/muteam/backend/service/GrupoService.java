package com.muteam.backend.service;

import com.muteam.backend.dto.response.GrupoResponseDTO;
import com.muteam.backend.model.Grupo;
import com.muteam.backend.repository.GrupoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GrupoService {

    private final GrupoRepository grupoRepository;

    public GrupoService(GrupoRepository grupoRepository) {
        this.grupoRepository = grupoRepository;
    }

    public List<GrupoResponseDTO> obtenerGrupos() {
        return grupoRepository.findAll().stream()
                .map(grupo -> new GrupoResponseDTO(
                        grupo.getId(),
                        grupo.getArticuloId(),
                        grupo.getNombre(),
                        grupo.getLiderNombre(),
                        grupo.getDescripcion()))
                .collect(Collectors.toList());
    }
}
