package com.muteam.backend.controller;

import com.muteam.backend.dto.response.GrupoResponseDTO;
import com.muteam.backend.service.GrupoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/grupos")
@CrossOrigin(origins = "http://localhost:5173")
public class GrupoController {

    private final GrupoService grupoService;

    public GrupoController(GrupoService grupoService) {
        this.grupoService = grupoService;
    }

    @GetMapping
    public ResponseEntity<List<GrupoResponseDTO>> obtenerGrupo(){
        return ResponseEntity.ok(grupoService.obtenerGrupos());
    }

}
