package com.muteam.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "secciones")
public class Seccion{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "articulo_id", nullable = false) // FK en tu tabla SQL
    @JsonIgnore // Al convertir a JSON, no vuelvas a pintar el padre completo
    private Articulo articulo;

    @Column(name="titulo")
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String cuerpo; // El contenido

    private Integer nivel; // Nivel requerido para ver esto (1, 3, 5)
    private Integer orden; // Orden de la seccion, cual va antes que cual

    private String tipo; // 'texto', 'imagen', 'video'

    // Para manejar sub-secciones
    @Column(name = "seccion_padre_id")
    private Long seccionPadreId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "multimedia_id")
    private Multimedia multimedia;

    public Seccion() {}

    public void setId(Long id) {
        this.id = id;
    }

    public void setArticulo(Articulo articulo) {
        this.articulo = articulo;
    }

    public void setCuerpo(String cuerpo) {
        this.cuerpo = cuerpo;
    }

    public void setNivel(Integer nivel) {
        this.nivel = nivel;
    }

    public void setOrden(Integer orden) {
        this.orden = orden;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public void setSeccionPadreId(Long seccionPadreId) {
        this.seccionPadreId = seccionPadreId;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setMultimedia(Multimedia multimedia) {
        this.multimedia = multimedia;
    }
}