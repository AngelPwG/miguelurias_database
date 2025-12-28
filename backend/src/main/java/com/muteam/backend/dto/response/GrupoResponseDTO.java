package com.muteam.backend.dto.response;

public record GrupoResponseDTO(
        Long id,
        Long articuloId,
        String nombre,
        String liderNombre,
        String descripcion) {
}
