package com.muteam.backend.dto.response;

import java.time.OffsetDateTime;
import java.util.List;

public record PersonaResponseDTO(
                Long id,
                Long articuloId,
                String nombre,
                String apodos,
                OffsetDateTime cumple,
                String telefono,
                String direccion,
                String estado,
                String loreGeneral,
                Long eventoDestacadoId,
                String imagenPortadaUrl,
                List<GrupoResponseDTO> grupos,
                List<EventoResponseDTO> eventos,
                List<PersonaRelacionDTO> relaciones) {
}
