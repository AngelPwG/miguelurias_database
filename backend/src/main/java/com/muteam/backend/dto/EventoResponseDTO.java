package com.muteam.backend.dto;

import java.time.OffsetDateTime;

public class EventoResponseDTO {
    private int id;
    private int artucullo_id;
    private String titulo;
    private String tipo;
    private long vistas;
    private OffsetDateTime fecha_creacion;
    private OffsetDateTime fecha_actualizacion;

    public EventoResponseDTO(int id, int artucullo_id, String titulo, String tipo, long vistas, OffsetDateTime fecha_creacion, OffsetDateTime fecha_actualizacion) {
        this.id = id;
        this.artucullo_id = artucullo_id;
        this.titulo = titulo;
        this.tipo = tipo;
        this.vistas = vistas;
        this.fecha_creacion = fecha_creacion;
        this.fecha_actualizacion = fecha_actualizacion;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getArtucullo_id() {
        return artucullo_id;
    }

    public void setArtucullo_id(int artucullo_id) {
        this.artucullo_id = artucullo_id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public long getVistas() {
        return vistas;
    }

    public void setVistas(long vistas) {
        this.vistas = vistas;
    }

    public OffsetDateTime getFecha_creacion() {
        return fecha_creacion;
    }

    public void setFecha_creacion(OffsetDateTime fecha_creacion) {
        this.fecha_creacion = fecha_creacion;
    }

    public OffsetDateTime getFecha_actualizacion() {
        return fecha_actualizacion;
    }

    public void setFecha_actualizacion(OffsetDateTime fecha_actualizacion) {
        this.fecha_actualizacion = fecha_actualizacion;
    }
}
