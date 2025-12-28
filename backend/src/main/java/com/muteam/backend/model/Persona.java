package com.muteam.backend.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "personas")
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "articulo_id")
    private Long articuloId;

    @Column(nullable = false)
    private String nombre;

    @Column
    private String apodos;

    @Column
    private OffsetDateTime cumple;

    @Column
    private String telefono;

    @Column
    private String direccion;

    @Column
    private String estado;

    @Column(name = "lore_general", columnDefinition = "TEXT")
    private String loreGeneral;

    @Column(name = "evento_destacado_id")
    private Long eventoDestacadoId;

    @OneToMany(mappedBy = "persona")
    private java.util.List<PersonaEvento> eventos;

    @ManyToMany
    @JoinTable(name = "personas_grupos", joinColumns = @JoinColumn(name = "persona_id"), inverseJoinColumns = @JoinColumn(name = "grupo_id"))
    private java.util.List<Grupo> grupos;

    @OneToMany(mappedBy = "personaOrigen")
    private java.util.List<PersonaRelacion> relaciones;

    // Constructor vacío requerido por JPA
    public Persona() {
    }

    // Constructor completo
    public Persona(Long id, String nombre, String apodos, OffsetDateTime cumple,
            String telefono, String direccion, String estado, String loreGeneral,
            Long eventoDestacadoId) {
        this.id = id;
        this.nombre = nombre;
        this.apodos = apodos;
        this.cumple = cumple;
        this.telefono = telefono;
        this.direccion = direccion;
        this.estado = estado;
        this.loreGeneral = loreGeneral;
        this.eventoDestacadoId = eventoDestacadoId;
    }

    // Getters y Setters
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

    public String getApodos() {
        return apodos;
    }

    public void setApodos(String apodos) {
        this.apodos = apodos;
    }

    public OffsetDateTime getCumple() {
        return cumple;
    }

    public void setCumple(OffsetDateTime cumple) {
        this.cumple = cumple;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getLoreGeneral() {
        return loreGeneral;
    }

    public void setLoreGeneral(String loreGeneral) {
        this.loreGeneral = loreGeneral;
    }

    public Long getEventoDestacadoId() {
        return eventoDestacadoId;
    }

    public void setEventoDestacadoId(Long eventoDestacadoId) {
        this.eventoDestacadoId = eventoDestacadoId;
    }

    public java.util.List<PersonaEvento> getEventos() {
        return eventos;
    }

    public void setEventos(java.util.List<PersonaEvento> eventos) {
        this.eventos = eventos;
    }

    public java.util.List<Grupo> getGrupos() {
        return grupos;
    }

    public void setGrupos(java.util.List<Grupo> grupos) {
        this.grupos = grupos;
    }

    public java.util.List<PersonaRelacion> getRelaciones() {
        return relaciones;
    }

    public void setRelaciones(java.util.List<PersonaRelacion> relaciones) {
        this.relaciones = relaciones;
    }
}
