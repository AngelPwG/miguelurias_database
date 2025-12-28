package com.muteam.backend.dto.response;

import com.muteam.backend.model.Multimedia; // Import needed
import java.time.LocalDateTime;
import java.util.List;

public record ArticuloDTO(
                Long id,
                String titulo,
                Integer vistas,
                LocalDateTime fechaCreacion,
                String autorNombre,
                List<Multimedia> galeria, // Changed from urlsGaleria
                List<SeccionDTO> secciones // Usamos una lista de DTOs, no de Entidades
) {
}