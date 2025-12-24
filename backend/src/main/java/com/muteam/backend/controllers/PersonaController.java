package com.muteam.backend.controllers;

import com.muteam.backend.dto.PersonaResponseDTO;
import com.muteam.backend.services.PersonaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/personas")
@CrossOrigin(origins = "http://localhost:5173")

public class PersonaController {

    private final PersonaService personaService;

    public PersonaController(PersonaService personaService) {
        this.personaService = personaService;
    }

    @GetMapping
    public ResponseEntity<List<PersonaResponseDTO>> obtenerPersonas() {
        return ResponseEntity.ok(personaService.obtenerPersonas());
    }

}
