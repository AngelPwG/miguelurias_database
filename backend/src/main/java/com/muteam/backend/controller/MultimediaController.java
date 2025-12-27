package com.muteam.backend.controller;

import com.muteam.backend.model.Multimedia;
import com.muteam.backend.repository.MultimediaRepository;
import com.muteam.backend.service.CloudinaryService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/multimedia")
public class MultimediaController {

    private final CloudinaryService cloudinaryService;
    private final MultimediaRepository multimediaRepository;

    public MultimediaController(CloudinaryService cloudinaryService,
                                MultimediaRepository multimediaRepository) {
        this.cloudinaryService = cloudinaryService;
        this.multimediaRepository = multimediaRepository;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> subirArchivo(
            @RequestParam("archivo") MultipartFile archivo,
            @RequestParam("tipo") String tipo,
            @RequestParam(value = "descripcion", required = false) String descripcion
    ) {

        // 1️⃣ Subir a Cloudinary
        String url = cloudinaryService.subirArchivo(archivo);

        // 2️⃣ Guardar en DB
        Multimedia multimedia = new Multimedia();
        multimedia.setUrl(url);
        multimedia.setTipo(tipo);
        multimedia.setDescripcion(descripcion);

        multimediaRepository.save(multimedia);

        // 3️⃣ Retornar ID
        return ResponseEntity.ok(multimedia.getId());
    }
}
