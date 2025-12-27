package com.muteam.backend.service;

import com.muteam.backend.dto.create.PersonaCreateDTO;
import com.muteam.backend.dto.request.ArticuloRequest;
import com.muteam.backend.dto.response.ArticuloDTO;
import com.muteam.backend.dto.response.PersonaResponseDTO;
import com.muteam.backend.model.Persona;
import com.muteam.backend.repository.PersonaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service

public class PersonaService {

    private final PersonaRepository personaRepository;
    private final ArticuloService articuloService;

    public PersonaService(PersonaRepository personaRepository, ArticuloService articuloService) {
        this.personaRepository = personaRepository;
        this.articuloService = articuloService;
    }

    //Provicional hardcodeado
    public List<PersonaResponseDTO> obtenerPersonas(){

        Persona personaPrueba = new Persona(
                1,
                1,
                "El Profe",
                "El Profe",
                OffsetDateTime.now(),
                "555-123-4567",
                "Av. Siempre Viva 742",
                "Activo",
                "Personaje importante en la historia",
                1
        );

        PersonaResponseDTO dto = new PersonaResponseDTO(
                personaPrueba.getId(),
                personaPrueba.getArticulo_id(),
                personaPrueba.getNombre(),
                personaPrueba.getApodos(),
                personaPrueba.getCumple(),
                personaPrueba.getTelefono(),
                personaPrueba.getDireccion(),
                personaPrueba.getEstado(),
                personaPrueba.getLore(),
                personaPrueba.getEvento_destacado_id()
        );

        return List.of(dto);
    }

    @Transactional
    public void crearArticuloCompleto(
            PersonaCreateDTO personaDTO,
            ArticuloRequest articuloRequest,
            Long usuarioId
    ) {

        ArticuloDTO articuloDTO =
                articuloService.guardarHistoriaCompleta(articuloRequest, usuarioId);

        Persona persona = new Persona();
        persona.setNombre(personaDTO.getNombre());
        persona.setEdad(personaDTO.getEdad());

        persona.setArticuloId(articuloDTO.getId());

        personaRepository.save(persona);
    }
}
