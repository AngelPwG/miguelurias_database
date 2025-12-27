package com.muteam.backend.service;

import com.muteam.backend.dto.response.EventoResponseDTO;
import com.muteam.backend.model.Seccion;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class EventoService {
    public List<EventoResponseDTO> obtenerEventos(){

        Seccion.Evento eventoPrueba = new Seccion.Evento(
                1,
                1,
                "Falseada",
                "nose",
                10,
                OffsetDateTime.now(),
                OffsetDateTime.now()
        );

        EventoResponseDTO dto = new EventoResponseDTO(
                eventoPrueba.getId(),
                eventoPrueba.getArtucullo_id(),
                eventoPrueba.getTitulo(),
                eventoPrueba.getTipo(),
                eventoPrueba.getVistas(),
                eventoPrueba.getFecha_creacion(),
                eventoPrueba.getFecha_actualizacion()
        );

        return List.of(dto);
    }

}
