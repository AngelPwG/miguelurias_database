package com.muteam.backend.dto.request;

import java.time.OffsetDateTime;
import java.util.List;

public record EventoRequest(
                String nombre,
                OffsetDateTime fechaIni,
                OffsetDateTime fechaFin,
                String ubicacion,
                String sinopsis,
                List<ParticipanteRequest> participantes, // Changed from List<Long> ids
                ArticuloRequest articuloRequest // The associated article content
) {
        public record ParticipanteRequest(Long personaId, String rol) {
        }
}
