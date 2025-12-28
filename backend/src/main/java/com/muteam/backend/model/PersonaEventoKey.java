package com.muteam.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PersonaEventoKey implements Serializable {

    @Column(name = "persona_id")
    private Long personaId;

    @Column(name = "evento_id")
    private Long eventoId;

    public PersonaEventoKey() {
    }

    public PersonaEventoKey(Long personaId, Long eventoId) {
        this.personaId = personaId;
        this.eventoId = eventoId;
    }

    public Long getPersonaId() {
        return personaId;
    }

    public void setPersonaId(Long personaId) {
        this.personaId = personaId;
    }

    public Long getEventoId() {
        return eventoId;
    }

    public void setEventoId(Long eventoId) {
        this.eventoId = eventoId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        PersonaEventoKey that = (PersonaEventoKey) o;
        return Objects.equals(personaId, that.personaId) && Objects.equals(eventoId, that.eventoId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(personaId, eventoId);
    }
}
