package com.muteam.backend.models;

public class Grupo {
    private int id;
    private int articulo_id;
    private String nombre;
    private String lider;
    private String descripcion;

    public Grupo(int id, int articulo_id, String nombre, String lider, String descripcion) {
        this.id = id;
        this.articulo_id = articulo_id;
        this.nombre = nombre;
        this.lider = lider;
        this.descripcion = descripcion;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getArticulo_id() {
        return articulo_id;
    }

    public void setArticulo_id(int articulo_id) {
        this.articulo_id = articulo_id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getLider() {
        return lider;
    }

    public void setLider(String lider) {
        this.lider = lider;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
