package com.muteam.backend.service;

import com.muteam.backend.dto.response.EventoResponseDTO;
import com.muteam.backend.repository.EventoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;

    public EventoService(EventoRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
    }

    public List<EventoResponseDTO> obtenerEventos() {
        return eventoRepository.findAll().stream()
                .map(evento -> new EventoResponseDTO(
                        evento.getId(),
                        evento.getArticuloId(),
                        evento.getNombre(),
                        evento.getFechaIni(),
                        evento.getFechaFin(),
                        evento.getUbicacion(),
                        evento.getSinopsis()))
                .collect(Collectors.toList());
    }
}
