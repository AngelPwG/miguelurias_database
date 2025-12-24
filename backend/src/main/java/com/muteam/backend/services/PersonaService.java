package com.muteam.backend.services;

import com.muteam.backend.dto.PersonaResponseDTO;
import com.muteam.backend.models.Persona;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service

public class PersonaService {
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
                personaPrueba.getArticlo_id(),
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

}
