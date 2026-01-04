package com.muteam.backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record ArticuloRequest(
                @NotBlank(message = "El título es obligatorio") String titulo,

                @NotBlank(message = "El tipo es obligatorio") String tipo, // "evento", "blog", etc.

                // Lista de IDs de fotos para la cabecera (Tabla multimedia_articulos)
                List<Long> galeriaMultimediaIds,

                Integer nivelAcceso,

                // Lista de las piezas de LEGO (validación en cascada)
                @Valid List<SeccionRequest> secciones) {
}
