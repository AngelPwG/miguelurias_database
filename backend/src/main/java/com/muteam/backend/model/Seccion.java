package com.muteam.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.OffsetDateTime;

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

    public static class Persona {
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

    public static class Evento {
        private int id;
        private int artucullo_id;
        private String titulo;
        private String tipo;
        private long vistas;
        private OffsetDateTime fecha_creacion;
        private OffsetDateTime fecha_actualizacion;

        public Evento(int id, int artucullo_id, String titulo, String tipo, long vistas, OffsetDateTime fecha_creacion, OffsetDateTime fecha_actualizacion) {
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
}