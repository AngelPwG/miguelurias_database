package com.muteam.backend.controller;

import com.muteam.backend.dto.request.ArticuloPersonaDTO;
import com.muteam.backend.dto.response.PersonaResponseDTO;
import com.muteam.backend.service.PersonaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personas")
@CrossOrigin(origins = "localhost")
public class PersonaController {
    private final PersonaService personaService;

    public PersonaController(PersonaService personaService) {
        this.personaService = personaService;
    }

    @GetMapping
    public ResponseEntity<List<PersonaResponseDTO>> obtenerPersona(){
        return ResponseEntity.ok((personaService.obtenerPersonas()));
    }

    @PostMapping
    public ResponseEntity<Void> crearPersona(
            @RequestBody ArticuloPersonaDTO request
    ) {

        Long usuarioId = 1L; // luego saldrá de seguridad

        personaService.crearArticuloCompleto(
                request.getPersonaCreateDTO(),
                request.getArticuloRequest(),
                usuarioId
        );

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
