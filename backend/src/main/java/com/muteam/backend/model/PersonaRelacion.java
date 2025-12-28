package com.muteam.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "personas_relaciones")
public class PersonaRelacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "persona_origen_id", nullable = false)
    private Persona personaOrigen;

    @ManyToOne
    @JoinColumn(name = "persona_destino_id", nullable = false)
    private Persona personaDestino;

    public PersonaRelacion() {
    }

    public PersonaRelacion(Persona personaOrigen, Persona personaDestino) {
        this.personaOrigen = personaOrigen;
        this.personaDestino = personaDestino;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Persona getPersonaOrigen() {
        return personaOrigen;
    }

    public void setPersonaOrigen(Persona personaOrigen) {
        this.personaOrigen = personaOrigen;
    }

    public Persona getPersonaDestino() {
        return personaDestino;
    }

    public void setPersonaDestino(Persona personaDestino) {
        this.personaDestino = personaDestino;
    }
}
