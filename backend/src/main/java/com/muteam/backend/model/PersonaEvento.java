package com.muteam.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "personas_eventos")
public class PersonaEvento {

    @EmbeddedId
    private PersonaEventoKey id;

    @ManyToOne
    @MapsId("personaId")
    @JoinColumn(name = "persona_id")
    private Persona persona;

    @ManyToOne
    @MapsId("eventoId")
    @JoinColumn(name = "evento_id")
    private Evento evento;

    @Column(name = "rol_en_evento")
    private String rolEnEvento;

    public PersonaEvento() {
    }

    public PersonaEvento(Persona persona, Evento evento, String rolEnEvento) {
        this.persona = persona;
        this.evento = evento;
        this.rolEnEvento = rolEnEvento;
        this.id = new PersonaEventoKey(persona.getId(), evento.getId());
    }

    public PersonaEventoKey getId() {
        return id;
    }

    public void setId(PersonaEventoKey id) {
        this.id = id;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public Evento getEvento() {
        return evento;
    }

    public void setEvento(Evento evento) {
        this.evento = evento;
    }

    public String getRolEnEvento() {
        return rolEnEvento;
    }

    public void setRolEnEvento(String rolEnEvento) {
        this.rolEnEvento = rolEnEvento;
    }
}
