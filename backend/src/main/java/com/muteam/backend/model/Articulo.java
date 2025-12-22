package com.muteam.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "articulos")
public class Articulo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    private String tipo;

    @Column(columnDefinition = "int default 0")
    private Integer vistas = 0;

    // Mapeo exacto de fechas
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion = LocalDateTime.now();

    @Column(name = "autor_id")
    private Long autorId; // Mantenemos solo el ID para simplificar por ahora

    // --- RELACIÓN CON SECCIONES (Tus piezas de LEGO) ---
    // FetchType.LAZY: No trae las secciones a menos que las pidas o las uses en la transacción
    @OneToMany(mappedBy = "articulo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Seccion> secciones = new ArrayList<>();

    // --- Relación con MULTIMEDIA (Galería/Portada) ---
    @ManyToMany
    @JoinTable(
            name = "multimedia_articulos", // Nombre exacto de tu tabla intermedia SQL
            joinColumns = @JoinColumn(name = "articulo_id"), // FK hacia mí
            inverseJoinColumns = @JoinColumn(name = "multimedia_id") // FK hacia la otra tabla
    )
    private List<Multimedia> galeria = new ArrayList<>();

    // Constructor vacío obligatorio
    public Articulo() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getVistas() {
        return vistas;
    }

    public void setVistas(Integer vistas) {
        this.vistas = vistas;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

    public Long getAutorId() {
        return autorId;
    }

    public void setAutorId(Long autorId) {
        this.autorId = autorId;
    }

    public List<Seccion> getSecciones() {
        return secciones;
    }

    public void setSecciones(List<Seccion> secciones) {
        this.secciones = secciones;
    }

    public List<Multimedia> getGaleria() {
        return galeria;
    }

    public void setGaleria(List<Multimedia> galeria) {
        this.galeria = galeria;
    }
}