package com.muteam.backend.dto.response;

import com.muteam.backend.model.Multimedia;

public record SeccionDTO(
                Long id,
                String titulo,
                String tipo,
                Integer orden,
                String contenido, // El texto del párrafo
                Multimedia multimedia,
                Integer nivel) {
}
