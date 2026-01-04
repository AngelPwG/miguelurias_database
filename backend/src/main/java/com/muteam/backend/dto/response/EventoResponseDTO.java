package com.muteam.backend.dto.response;

import java.time.OffsetDateTime;

import java.util.List;

public record EventoResponseDTO(
                Long id,
                Long articuloId,
                String nombre,
                OffsetDateTime fechaIni,
                OffsetDateTime fechaFin,
                String ubicacion,
                String sinopsis,
                String imagenPortadaUrl,
                List<ParticipanteDTO> participantes) {

        public record ParticipanteDTO(Long id, String nombre, String rol) {
        }
}
