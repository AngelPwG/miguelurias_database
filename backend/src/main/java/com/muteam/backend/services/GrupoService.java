package com.muteam.backend.services;

import com.muteam.backend.dto.GrupoResponseDTO;
import com.muteam.backend.models.Grupo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GrupoService {

    public List<GrupoResponseDTO> obtenerGrupos(){
        Grupo grupoPrueba = new Grupo(
                1,
                1,
                "MUteam",
                "Piwi",
                "Equipo que encargó del desarrollo de MiguelUriasDataBase"
        );

        GrupoResponseDTO dto = new GrupoResponseDTO(
                grupoPrueba.getId(),
                grupoPrueba.getArticulo_id(),
                grupoPrueba.getNombre(),
                grupoPrueba.getLider(),
                grupoPrueba.getDescripcion()
        );

        return List.of(dto);
    }
}
