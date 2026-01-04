package com.muteam.backend.controller;

import com.muteam.backend.dto.response.EventoResponseDTO;
import com.muteam.backend.service.EventoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.data.domain.Page;

import com.muteam.backend.model.Usuario;
import com.muteam.backend.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "http://localhost:5173")
public class EventoController {

    private final EventoService eventoService;
    private final UsuarioRepository usuarioRepository;

    public EventoController(EventoService eventoService, UsuarioRepository usuarioRepository) {
        this.eventoService = eventoService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public ResponseEntity<Page<EventoResponseDTO>> obtenerEventos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(value = "X-User-Level", defaultValue = "1") Integer userLevel) {
        return ResponseEntity.ok(eventoService.obtenerEventos(page, size, userLevel));
    }

    @GetMapping("/simple")
    public ResponseEntity<java.util.List<com.muteam.backend.dto.response.EventoSimpleDTO>> obtenerEventosSimple(
            @RequestHeader(value = "X-User-Level", defaultValue = "1") Integer userLevel) {
        return ResponseEntity.ok(eventoService.obtenerEventosSimple(userLevel));
    }

    @GetMapping("/cards")
    public ResponseEntity<Page<com.muteam.backend.dto.response.EventoCardDTO>> obtenerEventosCards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(value = "X-User-Level", defaultValue = "1") Integer userLevel) {
        return ResponseEntity.ok(eventoService.obtenerEventosCards(page, size, userLevel));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoResponseDTO> obtenerEvento(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Level", defaultValue = "1") Integer userLevel) {
        return ResponseEntity.ok(eventoService.obtenerEventoPorId(id, userLevel));
    }

    @PostMapping
    public ResponseEntity<EventoResponseDTO> crearEvento(
            @RequestBody com.muteam.backend.dto.request.EventoRequest request,
            Authentication authentication) {
        Long usuarioId = obtenerUsuarioId(authentication);
        return ResponseEntity.ok(eventoService.crearEvento(request, usuarioId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventoResponseDTO> actualizarEvento(
            @PathVariable Long id,
            @RequestBody com.muteam.backend.dto.request.EventoRequest request,
            Authentication authentication) {
        Long usuarioId = obtenerUsuarioId(authentication);
        return ResponseEntity.ok(eventoService.actualizarEvento(id, request, usuarioId));
    }

    private Long obtenerUsuarioId(Authentication authentication) {
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));
        return usuario.getId();
    }
}