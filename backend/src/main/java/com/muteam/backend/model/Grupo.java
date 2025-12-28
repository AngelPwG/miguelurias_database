package com.muteam.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "grupos")
public class Grupo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "articulo_id")
    private Long articuloId;

    @Column
    private String nombre;

    @Column(name = "lider_nombre")
    private String liderNombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @ManyToMany
    @JoinTable(name = "grupos_eventos", joinColumns = @JoinColumn(name = "grupo_id"), inverseJoinColumns = @JoinColumn(name = "evento_id"))
    private java.util.List<Evento> eventos;

    // Relación ManyToMany con Personas (mappedBy en Persona)
    @ManyToMany(mappedBy = "grupos")
    private java.util.List<Persona> personas;

    public Grupo() {
    }

    public Grupo(Long id, Long articuloId, String nombre, String liderNombre, String descripcion) {
        this.id = id;
        this.articuloId = articuloId;
        this.nombre = nombre;
        this.liderNombre = liderNombre;
        this.descripcion = descripcion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getArticuloId() {
        return articuloId;
    }

    public void setArticuloId(Long articuloId) {
        this.articuloId = articuloId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getLiderNombre() {
        return liderNombre;
    }

    public void setLiderNombre(String liderNombre) {
        this.liderNombre = liderNombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public java.util.List<Evento> getEventos() {
        return eventos;
    }

    public void setEventos(java.util.List<Evento> eventos) {
        this.eventos = eventos;
    }

    public java.util.List<Persona> getPersonas() {
        return personas;
    }

    public void setPersonas(java.util.List<Persona> personas) {
        this.personas = personas;
    }
}
