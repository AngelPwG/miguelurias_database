package com.muteam.backend.models;

import jakarta.persistence.Id;

import java.time.OffsetDateTime;

public class Persona {
    @Id
    private int id;
    private int articlo_id;
    private String nombre;
    private String apodos;
    private OffsetDateTime cumple;
    private String telefono;
    private String direccion;
    private String estado;
    private String lore;
    private int evento_destacado_id;

    public Persona(int id, int articlo_id, String nombre, String apodos, OffsetDateTime cumple, String telefono, String direccion, String estado, String lore, int evento_destacado_id) {
        this.id = id;
        this.articlo_id = articlo_id;
        this.nombre = nombre;
        this.apodos = apodos;
        this.cumple = cumple;
        this.telefono = telefono;
        this.direccion = direccion;
        this.estado = estado;
        this.lore = lore;
        this.evento_destacado_id = evento_destacado_id;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getArticlo_id() {
        return articlo_id;
    }

    public void setArticlo_id(int articlo_id) {
        this.articlo_id = articlo_id;
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

    public String getLore() {
        return lore;
    }

    public void setLore(String lore) {
        this.lore = lore;
    }

    public int getEvento_destacado_id() {
        return evento_destacado_id;
    }

    public void setEvento_destacado_id(int evento_destacado_id) {
        this.evento_destacado_id = evento_destacado_id;
    }
}