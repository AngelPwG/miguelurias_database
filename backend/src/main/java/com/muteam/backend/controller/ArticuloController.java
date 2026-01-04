package com.muteam.backend.controller;

import com.muteam.backend.dto.request.ArticuloRequest;
import com.muteam.backend.dto.response.ArticuloDTO;
import com.muteam.backend.model.Usuario;
import com.muteam.backend.repository.UsuarioRepository;
import com.muteam.backend.service.ArticuloService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articulos")
@CrossOrigin(originPatterns = "*")
public class ArticuloController {

    private final ArticuloService articuloService;
    private final UsuarioRepository usuarioRepository;

    public ArticuloController(ArticuloService articuloService, UsuarioRepository usuarioRepository) {
        this.articuloService = articuloService;
        this.usuarioRepository = usuarioRepository;
    }

    // ---------------------------------------------------------------
    // 1. VER UNA HISTORIA COMPLETA (Con lógica de filtrado)
    // ---------------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<ArticuloDTO> verArticulo(
            @PathVariable Long id,
            // TRUCO TEMPORAL: Leemos el nivel desde un Header falso
            // Cuando Backend 1 termine, esto se cambiará por el Token real.
            @RequestHeader(value = "X-User-Level", defaultValue = "1") Integer userLevel) {

        System.out.println("Solicitando artículo " + id + " con nivel de usuario: " + userLevel);

        try {
            ArticuloDTO dto = articuloService.obtenerArticuloSeguro(id, userLevel);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ---------------------------------------------------------------
    // 2. FEED DE NOTICIAS (Solo resúmenes)
    // ---------------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<ArticuloDTO>> verFeed() {
        // Aquí no filtramos por secciones porque el DTO del feed
        // normalmente NO incluye la lista de secciones (para no hacer pesada la carga).
        // Pero para el MVP, usaremos el mismo DTO.

        List<ArticuloDTO> feed = articuloService.obtenerTodosParaFeed();
        return ResponseEntity.ok(feed);
    }

    // ---------------------------------------------------------------
    // 3. FORMULARIO CREAR ARTICULO
    // ---------------------------------------------------------------
    @PostMapping
    public ResponseEntity<?> crear(
            @Valid @RequestBody ArticuloRequest request,
            Authentication authentication) {
        try {
            Long userId = obtenerUsuarioId(authentication);
            ArticuloDTO nuevoArticulo = articuloService.guardarHistoriaCompleta(request, userId);
            return ResponseEntity.status(201).body(nuevoArticulo);
        } catch (Exception e) {
            // Log detallado para debugging
            System.err.println("ERROR AL CREAR ARTÍCULO: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    // ---------------------------------------------------------------
    // 4. ELIMINAR ARTICULO
    // ---------------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            Long usuarioId = obtenerUsuarioId(authentication);

            // Verificar si tiene rol de admin
            boolean esAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_admin"));

            articuloService.eliminarArticulo(id, usuarioId, esAdmin);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            System.err.println("ERROR AL ELIMINAR ARTÍCULO: " + e.getMessage());
            if (e.getMessage().contains("No tienes permiso")) {
                return ResponseEntity.status(403).body(java.util.Map.of("message", e.getMessage()));
            }
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