package com.muteam.backend.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SeccionRequest(
                String titulo,

                @NotBlank(message = "El tipo de sección es obligatorio") String tipo, // "texto", "imagen", "video"

                String contenido, // Texto del párrafo (si aplica)
                Long multimediaId, // ID de la foto/video (si aplica)

                @NotNull(message = "El orden es obligatorio") Integer orden,

                @NotNull(message = "El nivel es obligatorio") @Min(value = 0, message = "El nivel mínimo es 0") @Max(value = 5, message = "El nivel máximo es 5") Integer nivel // Privacidad
                                                                                                                                                                                // (0-5)
) {
}
