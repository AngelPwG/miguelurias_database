package com.muteam.backend.dto.response;

public record PersonaCardDTO(
        Long id,
        String nombre,
        String apodos,
        String imagenPortadaUrl,
        Long autorId) {
}
