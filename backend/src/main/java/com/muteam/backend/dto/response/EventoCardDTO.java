package com.muteam.backend.dto.response;

import java.time.OffsetDateTime;

public record EventoCardDTO(
        Long id,
        String nombre,
        OffsetDateTime fechaIni,
        String ubicacion,
        String imagenPortadaUrl) {
}
