package com.muteam.backend.controller;

import com.muteam.backend.dto.request.ArticuloPersonaDTO;
import com.muteam.backend.dto.response.PersonaResponseDTO;
import com.muteam.backend.model.Usuario;
import com.muteam.backend.repository.UsuarioRepository;
import com.muteam.backend.service.PersonaService;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/personas")
public class PersonaController {
    private final PersonaService personaService;
    private final UsuarioRepository usuarioRepository;

    public PersonaController(PersonaService personaService, UsuarioRepository usuarioRepository) {
        this.personaService = personaService;
        this.usuarioRepository = usuarioRepository;
    }

    // Obtener todas las personas (Paginado)
    @GetMapping
    public ResponseEntity<Page<PersonaResponseDTO>> obtenerPersonas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(value = "X-User-Level", defaultValue = "1") Integer userLevel) {

        Page<PersonaResponseDTO> personas = personaService.obtenerPersonas(page, size, userLevel);
        return ResponseEntity.ok(personas);
    }

    @GetMapping("/simple")
    public ResponseEntity<java.util.List<com.muteam.backend.dto.response.PersonaSimpleDTO>> obtenerPersonasSimple(
            @RequestHeader(value = "X-User-Level", defaultValue = "1") Integer userLevel) {
        return ResponseEntity.ok(personaService.obtenerPersonasSimple(userLevel));
    }

    @GetMapping("/cards")
    public ResponseEntity<Page<com.muteam.backend.dto.response.PersonaCardDTO>> obtenerPersonasCards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(value = "X-User-Level", defaultValue = "1") Integer userLevel) {
        return ResponseEntity.ok(personaService.obtenerPersonasCards(page, size, userLevel));
    }

    // Obtener una persona por ID
    @GetMapping("/{id}")
    public ResponseEntity<PersonaResponseDTO> obtenerPersonaPorId(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Level", defaultValue = "1") Integer userLevel) {
        try {
            PersonaResponseDTO persona = personaService.obtenerPersonaPorId(id, userLevel);
            return ResponseEntity.ok(persona);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Crear persona con artículo completo
    @PostMapping
    public ResponseEntity<?> crearPersona(
            @Valid @RequestBody ArticuloPersonaDTO request,
            Authentication authentication) {
        try {
            Long usuarioId = obtenerUsuarioId(authentication);

            PersonaResponseDTO nuevaPersona = personaService.crearArticuloCompleto(
                    request.getPersonaCreateDTO(),
                    request.getArticuloRequest(),
                    usuarioId);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaPersona);
        } catch (Exception e) {
            System.err.println("ERROR AL CREAR PERSONA: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    // Actualizar persona
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<?> actualizarPersona(
            @PathVariable Long id,
            @Valid @RequestBody ArticuloPersonaDTO request,
            Authentication authentication) {
        try {
            Long usuarioId = obtenerUsuarioId(authentication);

            PersonaResponseDTO updated = personaService.actualizarArticuloCompleto(
                    id,
                    request.getPersonaCreateDTO(),
                    request.getArticuloRequest(),
                    usuarioId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("ERROR AL ACTUALIZAR PERSONA: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    // Helper method para obtener el ID del usuario autenticado
    private Long obtenerUsuarioId(Authentication authentication) {
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));
        return usuario.getId();
    }
}
