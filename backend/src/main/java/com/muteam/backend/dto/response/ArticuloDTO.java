package com.muteam.backend.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record ArticuloDTO(
        Long id,
        String titulo,
        Integer vistas,
        LocalDateTime fechaCreacion,
        String autorNombre,
        List<String> urlsGaleria,
        List<SeccionDTO> secciones // Usamos una lista de DTOs, no de Entidades
) {}