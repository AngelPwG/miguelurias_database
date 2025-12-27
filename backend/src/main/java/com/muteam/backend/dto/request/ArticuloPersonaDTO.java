package com.muteam.backend.dto.request;

import com.muteam.backend.dto.create.PersonaCreateDTO;

public class ArticuloPersonaDTO {
    public PersonaCreateDTO personaCreateDTO;
    public ArticuloRequest articuloRequest;

    public PersonaCreateDTO getPersonaCreateDTO() {
        return personaCreateDTO;
    }

    public void setPersonaCreateDTO(PersonaCreateDTO personaCreateDTO) {
        this.personaCreateDTO = personaCreateDTO;
    }

    public ArticuloRequest getArticuloRequest() {
        return articuloRequest;
    }

    public void setArticuloRequest(ArticuloRequest articuloRequest) {
        this.articuloRequest = articuloRequest;
    }
}
