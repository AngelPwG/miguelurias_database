package com.muteam.backend.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "eventos")
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "articulo_id")
    private Long articuloId;

    @Column
    private String nombre;

    @Column(name = "fecha_ini")
    private OffsetDateTime fechaIni;

    @Column(name = "fecha_fin")
    private OffsetDateTime fechaFin;

    @Column
    private String ubicacion;

    @Column(columnDefinition = "TEXT")
    private String sinopsis;

    // Relación OneToMany desde Evento hacia Grupos (Si aplica) o PersonasEventos
    // Por ahora lo dejamos simple.

    public Evento() {
    }

    public Evento(Long id, Long articuloId, String nombre, OffsetDateTime fechaIni, OffsetDateTime fechaFin,
            String ubicacion, String sinopsis) {
        this.id = id;
        this.articuloId = articuloId;
        this.nombre = nombre;
        this.fechaIni = fechaIni;
        this.fechaFin = fechaFin;
        this.ubicacion = ubicacion;
        this.sinopsis = sinopsis;
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

    public OffsetDateTime getFechaIni() {
        return fechaIni;
    }

    public void setFechaIni(OffsetDateTime fechaIni) {
        this.fechaIni = fechaIni;
    }

    public OffsetDateTime getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(OffsetDateTime fechaFin) {
        this.fechaFin = fechaFin;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getSinopsis() {
        return sinopsis;
    }

    public void setSinopsis(String sinopsis) {
        this.sinopsis = sinopsis;
    }
}
