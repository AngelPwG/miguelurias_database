package com.muteam.backend.dto.create;

public class PersonaCreateDTO {
    private String nombre;
    private String apodos;
    private String cumple;
    private String telefono;
    private String direccion;
    private String estado;
    private String loreGeneral;
    private Long eventoDestacadoId;
    private java.util.List<PersonaRelacionCreateDTO> relaciones;
    private java.util.List<Long> gruposIds;
    private java.util.List<PersonaEventoCreateDTO> eventos;

    // Constructor vacío
    public PersonaCreateDTO() {
    }

    // Constructor completo
    public PersonaCreateDTO(String nombre, String apodos, String cumple,
            String telefono, String direccion, String estado,
            String loreGeneral, Long eventoDestacadoId,
            java.util.List<PersonaRelacionCreateDTO> relaciones,
            java.util.List<Long> gruposIds,
            java.util.List<PersonaEventoCreateDTO> eventos) {
        this.nombre = nombre;
        this.apodos = apodos;
        this.cumple = cumple;
        this.telefono = telefono;
        this.direccion = direccion;
        this.estado = estado;
        this.loreGeneral = loreGeneral;
        this.eventoDestacadoId = eventoDestacadoId;
        this.relaciones = relaciones;
        this.gruposIds = gruposIds;
        this.eventos = eventos;
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

    public String getCumple() {
        return cumple;
    }

    public void setCumple(String cumple) {
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

    public java.util.List<PersonaRelacionCreateDTO> getRelaciones() {
        return relaciones;
    }

    public void setRelaciones(java.util.List<PersonaRelacionCreateDTO> relaciones) {
        this.relaciones = relaciones;
    }

    public java.util.List<Long> getGruposIds() {
        return gruposIds;
    }

    public void setGruposIds(java.util.List<Long> gruposIds) {
        this.gruposIds = gruposIds;
    }

    public java.util.List<PersonaEventoCreateDTO> getEventos() {
        return eventos;
    }

    public void setEventos(java.util.List<PersonaEventoCreateDTO> eventos) {
        this.eventos = eventos;
    }
}
