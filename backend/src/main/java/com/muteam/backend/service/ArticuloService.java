package com.muteam.backend.service;

import com.muteam.backend.dto.request.SeccionRequest;
import com.muteam.backend.dto.response.ArticuloDTO;
import com.muteam.backend.dto.request.ArticuloRequest;
import com.muteam.backend.dto.response.SeccionDTO;
import com.muteam.backend.model.Articulo;
import com.muteam.backend.model.Multimedia;
import com.muteam.backend.model.Seccion;
import com.muteam.backend.model.Usuario;
import com.muteam.backend.repository.ArticuloRepository;
import com.muteam.backend.repository.MultimediaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.muteam.backend.repository.UsuarioRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import com.muteam.backend.repository.SeccionRepository;

@Service
public class ArticuloService {
    private final ArticuloRepository articuloRepository;
    private final SeccionRepository seccionRepository;
    private final MultimediaRepository multimediaRepository;
    private final UsuarioRepository usuarioRepository;

    public ArticuloService(ArticuloRepository articuloRepository, SeccionRepository seccionRepository,
            MultimediaRepository multimediaRepository, UsuarioRepository usuarioRepository) {
        this.articuloRepository = articuloRepository;
        this.seccionRepository = seccionRepository;
        this.multimediaRepository = multimediaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public ArticuloDTO obtenerArticuloSeguro(Long articuloId, Integer nivelUsuario) {

        // 1. Obtener Entidad (DB)
        Articulo articulo = articuloRepository.findById(articuloId)
                .orElseThrow(() -> new RuntimeException("Artículo con ID " + articuloId + " no existe"));

        // 4. SANITIZAR GALERÍA (Quitar Proxies de Hibernate para que Jackson no falle)
        List<Multimedia> galeria = articulo.getGaleria().stream()
                .map(m -> {
                    Multimedia copy = new Multimedia();
                    copy.setId(m.getId());
                    copy.setUrl(m.getUrl());
                    copy.setTipo(m.getTipo());
                    copy.setDescripcion(m.getDescripcion());
                    return copy;
                })
                .collect(Collectors.toList());

        // 2. Obtener Secciones (DB)
        List<Seccion> seccionesEntity = seccionRepository.findByArticuloIdOrderByOrdenAsc(articuloId);

        // 3. Filtrar y Convertir a DTO (La Lógica)
        List<SeccionDTO> seccionesDTO = seccionesEntity.stream()
                // A. FILTRO DE SEGURIDAD
                .filter(s -> {
                    int nivelRequerido = (s.getNivel() == null) ? 0 : s.getNivel();
                    return nivelUsuario >= nivelRequerido;
                })
                // B. MAPEO (Entity -> DTO)
                .map(s -> new SeccionDTO(
                        s.getId(),
                        s.getTitulo(),
                        s.getTipo(),
                        s.getOrden(),
                        s.getCuerpo(),
                        s.getMultimedia()))
                .collect(Collectors.toList());

        // 4. Buscar al Autor
        Usuario autor = usuarioRepository.findById(articulo.getAutorId())
                .orElseThrow(() -> new RuntimeException("Autor con ID " + articulo.getAutorId() + " no existe"));

        // 5. Armar el DTO Padre final
        return new ArticuloDTO(
                articulo.getId(),
                articulo.getTitulo(),
                articulo.getVistas(),
                articulo.getFechaCreacion(),
                autor.getUsername(),
                galeria,
                seccionesDTO);
    }

    public Seccion agregarSeccion(Long articuloId, SeccionRequest nuevaSeccionRequest) {

        // 1. Buscamos al Padre
        Articulo articulo = articuloRepository.findById(articuloId)
                .orElseThrow(() -> new RuntimeException("Artículo no encontrado"));

        // 2. Preparamos al Hijo
        Seccion nuevaSeccion = new Seccion();
        nuevaSeccion.setTitulo(nuevaSeccionRequest.titulo());
        switch (nuevaSeccionRequest.tipo().toLowerCase()) {
            case "texto":
                // REGLA: Si es texto, guardamos el contenido en 'cuerpo'
                // y nos aseguramos de que NO haya multimedia vinculado.
                if (nuevaSeccionRequest.contenido() == null || nuevaSeccionRequest.contenido().isBlank()) {
                    throw new RuntimeException("Una sección de texto no puede estar vacía");
                }
                nuevaSeccion.setCuerpo(nuevaSeccionRequest.contenido());
                nuevaSeccion.setMultimedia(null);
                break;

            case "imagen":
            case "video":
                // REGLA: Si es media, el 'cuerpo' (texto) debe ser nulo
                // y es OBLIGATORIO tener un ID de multimedia.
                if (nuevaSeccionRequest.multimediaId() == null) {
                    throw new RuntimeException("Una sección multimedia debe tener un ID de archivo");
                }
                Multimedia media = multimediaRepository.findById(nuevaSeccionRequest.multimediaId())
                        .orElseThrow(() -> new RuntimeException(
                                "Multimedia no encontrado con ID: " + nuevaSeccionRequest.multimediaId()));
                nuevaSeccion.setMultimedia(media);
                nuevaSeccion.setCuerpo(null); // Limpiamos el texto para cumplir tu regla
                break;

            default:
                throw new RuntimeException("Tipo de sección no válido: " + nuevaSeccionRequest.tipo());
        }
        nuevaSeccion.setOrden(nuevaSeccionRequest.orden());
        nuevaSeccion.setTipo(nuevaSeccionRequest.tipo());
        nuevaSeccion.setNivel(nuevaSeccionRequest.nivel());
        nuevaSeccion.setArticulo(articulo); // <--- VINCULACIÓN CRÍTICA

        // 3. Guardamos al Hijo (Usando el repo del hijo, pero dentro del servicio del
        // padre)
        seccionRepository.save(nuevaSeccion);
        return nuevaSeccion;
    }

    @Transactional // <--- ESTO ES EL ESCUDO DE SEGURIDAD
    public ArticuloDTO guardarHistoriaCompleta(ArticuloRequest request, Long usuarioId) {

        // PASO 1: Guardar la Cabecera (El Padre)
        Articulo articulo = new Articulo();
        articulo.setTitulo(request.titulo());
        articulo.setAutorId(usuarioId);
        articulo.setFechaCreacion(LocalDateTime.now());
        articulo.setTipo(request.tipo());
        // Al hacer .save(), la base de datos genera el ID y lo pone en el objeto
        // 'articulo'
        articulo = articuloRepository.save(articulo);

        if (request.galeriaMultimediaIds() != null && !request.galeriaMultimediaIds().isEmpty()) {
            // Buscamos las fotos reales en la DB usando sus IDs
            List<Multimedia> fotosGaleria = multimediaRepository.findAllById(request.galeriaMultimediaIds());

            // Asignamos la lista. Al tener @ManyToMany, JPA llenará la tabla intermedia
            // solo.
            articulo.setGaleria(fotosGaleria);

            // Actualizamos el artículo para guardar las relaciones
            articuloRepository.save(articulo);
        }

        // --- PASO 3: PROCESAR LAS SECCIONES (LEGOS) ---
        if (request.secciones() != null) {
            for (SeccionRequest seccionReq : request.secciones()) {

                Seccion seccion = new Seccion();
                seccion.setArticulo(articulo); // Vinculación con el Padre
                seccion.setOrden(seccionReq.orden());
                seccion.setNivel(seccionReq.nivel());
                seccion.setTipo(seccionReq.tipo());
                seccion.setTitulo(seccionReq.titulo());

                // --- Lógica del Switch (Texto vs Multimedia) ---
                if ("texto".equalsIgnoreCase(seccionReq.tipo())) {
                    // Validación simple
                    if (seccionReq.contenido() == null || seccionReq.contenido().isBlank()) {
                        throw new RuntimeException("El texto no puede estar vacío");
                    }
                    seccion.setCuerpo(seccionReq.contenido());
                    seccion.setMultimedia(null); // Aseguramos limpieza
                } else {
                    // Es imagen o video
                    if (seccionReq.multimediaId() == null) {
                        throw new RuntimeException("Falta el ID del archivo multimedia");
                    }
                    Multimedia media = multimediaRepository.findById(seccionReq.multimediaId())
                            .orElseThrow(() -> new RuntimeException(
                                    "Multimedia no encontrado con ID: " + seccionReq.multimediaId()));
                    seccion.setMultimedia(media);
                    seccion.setCuerpo(null); // Aseguramos limpieza
                }

                // Guardamos el Hijo
                seccionRepository.save(seccion);
            }
        }

        // --- PASO 4: RETORNAR ---
        // Retornamos un DTO simple o solo el ID
        return convertirADTO(articulo);

    } // <--- AQUÍ TERMINA LA TRANSACCIÓN (Si llega aquí, hace COMMIT. Si falla antes,
      // ROLLBACK)

    @Transactional
    public ArticuloDTO actualizarHistoriaCompleta(Long articuloId, ArticuloRequest request, Long usuarioId) {
        // 1. Buscar y Validar existencia
        Articulo articulo = articuloRepository.findById(articuloId)
                .orElseThrow(() -> new RuntimeException("Artículo no encontrado"));

        // (Opcional: Verificar si el usuario tiene permiso, aunque eso suele ir en
        // Controller/Security)

        // 2. Actualizar Datos Básicos
        articulo.setTitulo(request.titulo());
        // articulo.setTipo(request.tipo()); // Generalmente el tipo no cambia, pero
        // podrías permitirlo
        articulo.setFechaActualizacion(LocalDateTime.now()); // Si tienes este campo (o reutilizas fechaCreacion si no)
        // Nota: en tu modelo no vi fechaActualizacion explicito en Articulo.java
        // original,
        // pero es buena práctica. Si no existe, ignóralo o agrégalo.
        // Voy a asumnir que NO existe y solo actualizo titulo.

        // 3. Actualizar Galería
        if (request.galeriaMultimediaIds() != null) {
            List<Multimedia> nuevasFotos = multimediaRepository.findAllById(request.galeriaMultimediaIds());
            articulo.setGaleria(nuevasFotos); // Reemplaza la lista anterior completamente
        }

        articuloRepository.save(articulo);

        // 4. Actualizar Secciones (Estrategia: Borrar y Recrear)
        // Primero borramos las viejas
        seccionRepository.deleteAllByArticuloId(articuloId);
        seccionRepository.flush(); // <--- FORZAR EL BORRADO INMEDIATO

        // Insertamos las nuevas (si hay)
        if (request.secciones() != null) {
            for (SeccionRequest seccionReq : request.secciones()) {
                Seccion seccion = new Seccion();
                seccion.setArticulo(articulo);
                seccion.setOrden(seccionReq.orden());
                seccion.setNivel(seccionReq.nivel());
                seccion.setTipo(seccionReq.tipo());
                seccion.setTitulo(seccionReq.titulo());

                if ("texto".equalsIgnoreCase(seccionReq.tipo())) {
                    if (seccionReq.contenido() == null || seccionReq.contenido().isBlank()) {
                        throw new RuntimeException("El texto no puede estar vacío");
                    }
                    seccion.setCuerpo(seccionReq.contenido());
                } else {
                    if (seccionReq.multimediaId() == null) {
                        throw new RuntimeException("Falta el ID del archivo multimedia");
                    }
                    Multimedia media = multimediaRepository.findById(seccionReq.multimediaId())
                            .orElseThrow(() -> new RuntimeException(
                                    "Multimedia no encontrado con ID: " + seccionReq.multimediaId()));
                    seccion.setMultimedia(media);
                }
                seccionRepository.save(seccion);
            }
        }

        return convertirADTO(articulo);
    }

    private ArticuloDTO convertirADTO(Articulo articulo) {
        List<Multimedia> galeria = articulo.getGaleria().stream()
                .map(m -> {
                    Multimedia copy = new Multimedia();
                    copy.setId(m.getId());
                    copy.setUrl(m.getUrl());
                    copy.setTipo(m.getTipo());
                    copy.setDescripcion(m.getDescripcion());
                    return copy;
                })
                .collect(Collectors.toList());

        // 2. CONVERTIR SECCIONES (Lista de Entidades -> Lista de DTOs)
        // Aquí transformamos cada pieza de LEGO interna en un DTO seguro
        List<SeccionDTO> seccionesDTO = articulo.getSecciones().stream()
                // Opcional: Aseguramos que salgan ordenadas por el campo 'orden'
                .sorted(Comparator.comparingInt(Seccion::getOrden))
                .map(seccion -> new SeccionDTO(
                        seccion.getId(),
                        seccion.getTitulo(),
                        seccion.getTipo(),
                        seccion.getOrden(),
                        seccion.getCuerpo(), // Contenido de texto
                        seccion.getMultimedia()// url de la foto (si hay)
                ))
                .toList();

        return new ArticuloDTO(
                articulo.getId(),
                articulo.getTitulo(),
                articulo.getVistas(),
                articulo.getFechaCreacion(),
                "Autor desconocido",
                galeria,
                seccionesDTO);
    }

    public List<ArticuloDTO> obtenerTodosParaFeed() {
        // Usamos el metodo del repo que ordena por fecha
        List<Articulo> articulos = articuloRepository.findAllByOrderByFechaCreacionDesc();

        // Convertimos a DTO
        return articulos.stream()
                .map(a -> new ArticuloDTO(
                        a.getId(),
                        a.getTitulo(),
                        a.getVistas(),
                        a.getFechaCreacion(),
                        "Autor ID " + a.getAutorId(), // Temporal
                        List.of(),
                        List.of() // Mandamos lista vacía. El Home no necesita leer el contenido.
                ))
                .collect(Collectors.toList());
    }
}