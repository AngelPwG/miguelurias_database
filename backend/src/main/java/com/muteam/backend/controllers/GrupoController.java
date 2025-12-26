package com.muteam.backend.controllers;

import com.muteam.backend.dto.GrupoResponseDTO;
import com.muteam.backend.services.GrupoService;
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
    public ResponseEntity<List<GrupoResponseDTO>> obtenerGrupos(){
        return ResponseEntity.ok(grupoService.obtenerGrupos());
    }
}
