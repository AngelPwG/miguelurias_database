package com.muteam.backend.dto.response;

import java.time.OffsetDateTime;

public record EventoResponseDTO(
        Long id,
        Long articuloId,
        String nombre,
        OffsetDateTime fechaIni,
        OffsetDateTime fechaFin,
        String ubicacion,
        String sinopsis) {
}
