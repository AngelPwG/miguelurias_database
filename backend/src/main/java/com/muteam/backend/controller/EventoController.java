package com.muteam.backend.controller;

import com.muteam.backend.dto.response.EventoResponseDTO;
import com.muteam.backend.service.EventoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "http://localhost:5173")
public class EventoController {

    private final EventoService eventoService;

    public EventoController(EventoService eventoService) {
        this.eventoService = eventoService;
    }

    @GetMapping
    public ResponseEntity<List<EventoResponseDTO>> obtenerEvento(){
        return ResponseEntity.ok(eventoService.obtenerEventos());
    }
}