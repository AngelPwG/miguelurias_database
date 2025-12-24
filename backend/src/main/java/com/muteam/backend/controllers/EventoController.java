package com.muteam.backend.controllers;

import com.muteam.backend.services.EventoService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/eventos")
@CrossOrigin(origins = "http://localhost:5173")
public class EventoController {
    // private final EventoService eventoService;
}
