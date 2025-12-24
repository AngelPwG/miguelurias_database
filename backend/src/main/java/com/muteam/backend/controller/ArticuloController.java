package com.muteam.backend.controller;

import com.muteam.backend.dto.request.ArticuloRequest;
import com.muteam.backend.dto.response.ArticuloDTO;
import com.muteam.backend.service.ArticuloService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articulos")
// @CrossOrigin(origins = "*")
public class ArticuloController {

    private final ArticuloService articuloService;

    public ArticuloController(ArticuloService articuloService) {
        this.articuloService = articuloService;
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
    public ResponseEntity<ArticuloDTO> crear(
            @Valid @RequestBody ArticuloRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId // Temporal
    ) {
        try {
            ArticuloDTO nuevoArticulo = articuloService.guardarHistoriaCompleta(request, userId);
            return ResponseEntity.status(201).body(nuevoArticulo);
        } catch (Exception e) {
            // Log detallado para debugging
            System.err.println("ERROR AL CREAR ARTÍCULO: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}