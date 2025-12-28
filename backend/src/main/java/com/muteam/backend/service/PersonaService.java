package com.muteam.backend.service;

import com.muteam.backend.dto.create.PersonaCreateDTO;
import com.muteam.backend.dto.request.ArticuloRequest;
import com.muteam.backend.dto.response.ArticuloDTO;
import com.muteam.backend.dto.response.PersonaResponseDTO;
import com.muteam.backend.model.Persona;
import com.muteam.backend.repository.PersonaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import com.muteam.backend.repository.ArticuloRepository;
import com.muteam.backend.model.Articulo;
import java.util.Optional;
import java.time.LocalDate;
import java.time.ZoneOffset;

@Service
public class PersonaService {

    private final PersonaRepository personaRepository;
    private final ArticuloService articuloService;
    private final ArticuloRepository articuloRepository;
    private final com.muteam.backend.repository.PersonaRelacionRepository personaRelacionRepository;
    private final com.muteam.backend.repository.GrupoRepository grupoRepository;
    private final com.muteam.backend.repository.EventoRepository eventoRepository;
    private final com.muteam.backend.repository.PersonaEventoRepository personaEventoRepository;

    public PersonaService(PersonaRepository personaRepository, ArticuloService articuloService,
            ArticuloRepository articuloRepository,
            com.muteam.backend.repository.PersonaRelacionRepository personaRelacionRepository,
            com.muteam.backend.repository.GrupoRepository grupoRepository,
            com.muteam.backend.repository.EventoRepository eventoRepository,
            com.muteam.backend.repository.PersonaEventoRepository personaEventoRepository) {
        this.personaRepository = personaRepository;
        this.articuloService = articuloService;
        this.articuloRepository = articuloRepository;
        this.personaRelacionRepository = personaRelacionRepository;
        this.grupoRepository = grupoRepository;
        this.eventoRepository = eventoRepository;
        this.personaEventoRepository = personaEventoRepository;
    }

    // Obtener todas las personas
    public List<PersonaResponseDTO> obtenerPersonas() {
        List<Persona> personas = personaRepository.findAll();
        return personas.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Obtener persona por ID
    public PersonaResponseDTO obtenerPersonaPorId(Long id) {
        Persona persona = personaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Persona con ID " + id + " no encontrada"));
        return convertirADTO(persona);
    }

    @Transactional
    public PersonaResponseDTO crearArticuloCompleto(
            PersonaCreateDTO personaDTO,
            ArticuloRequest articuloRequest,
            Long usuarioId) {

        // 1. Crear el artículo primero
        ArticuloDTO articuloDTO = articuloService.guardarHistoriaCompleta(articuloRequest, usuarioId);

        // 2. Crear la persona y vincularla con el artículo recién creado
        Persona persona = new Persona();
        persona.setNombre(personaDTO.getNombre());
        persona.setApodos(personaDTO.getApodos());
        if (personaDTO.getCumple() != null && !personaDTO.getCumple().isBlank()) {
            persona.setCumple(LocalDate.parse(personaDTO.getCumple()).atStartOfDay(ZoneOffset.UTC).toOffsetDateTime());
        }
        persona.setTelefono(personaDTO.getTelefono());
        persona.setDireccion(personaDTO.getDireccion());
        persona.setEstado(personaDTO.getEstado());
        persona.setLoreGeneral(personaDTO.getLoreGeneral());
        persona.setEventoDestacadoId(personaDTO.getEventoDestacadoId());

        // IMPORTANTE: Usar el ID del artículo recién creado
        persona.setArticuloId(articuloDTO.id());

        // 3. Guardar la persona
        persona = personaRepository.save(persona);

        // --- GRUPOS ---
        if (personaDTO.getGruposIds() != null && !personaDTO.getGruposIds().isEmpty()) {
            List<com.muteam.backend.model.Grupo> grupos = grupoRepository.findAllById(personaDTO.getGruposIds());
            persona.setGrupos(grupos);
            persona = personaRepository.save(persona);
        }

        // --- EVENTOS (con rol) ---
        if (personaDTO.getEventos() != null && !personaDTO.getEventos().isEmpty()) {
            for (var eventoDTO : personaDTO.getEventos()) {
                if (eventoDTO.eventoId() == null)
                    continue;

                com.muteam.backend.model.Evento evento = eventoRepository.findById(eventoDTO.eventoId())
                        .orElseThrow(() -> new RuntimeException("Evento no encontrado: " + eventoDTO.eventoId()));

                com.muteam.backend.model.PersonaEvento personaEvento = new com.muteam.backend.model.PersonaEvento(
                        persona, evento, eventoDTO.rol());
                personaEventoRepository.save(personaEvento);
            }
        }

        // 4. Guardar Relaciones (si existen)
        if (personaDTO.getRelaciones() != null) {
            for (var relDTO : personaDTO.getRelaciones()) {
                if (relDTO.personaDestinoId() != null) {
                    Persona destino = personaRepository.findById(relDTO.personaDestinoId())
                            .orElseThrow(() -> new RuntimeException(
                                    "Persona destino no encontrada: " + relDTO.personaDestinoId()));

                    // Ordenar IDs para garantizar unicidad bilateral (menor -> mayor)
                    Persona p1 = (persona.getId() < destino.getId()) ? persona : destino;
                    Persona p2 = (persona.getId() < destino.getId()) ? destino : persona;

                    // Evitar auto-relación
                    if (p1.getId().equals(p2.getId()))
                        continue;

                    com.muteam.backend.model.PersonaRelacion relacion = new com.muteam.backend.model.PersonaRelacion(p1,
                            p2);
                    personaRelacionRepository.save(relacion);
                }
            }
        }

        // 5. Retornar el DTO de la persona creada
        return convertirADTO(persona);
    }

    // Helper method para convertir Persona a PersonaResponseDTO
    private PersonaResponseDTO convertirADTO(Persona persona) {
        String imagenUrl = null;
        if (persona.getArticuloId() != null) {
            Optional<Articulo> articuloOpt = articuloRepository.findById(persona.getArticuloId());
            if (articuloOpt.isPresent()) {
                Articulo articulo = articuloOpt.get();
                if (articulo.getGaleria() != null && !articulo.getGaleria().isEmpty()) {
                    imagenUrl = articulo.getGaleria().get(0).getUrl();
                }
            }
        }

        List<com.muteam.backend.dto.response.GrupoResponseDTO> gruposDTO = (persona.getGrupos() == null) ? List.of()
                : persona.getGrupos().stream()
                        .map(g -> new com.muteam.backend.dto.response.GrupoResponseDTO(
                                g.getId(),
                                g.getArticuloId(),
                                g.getNombre(),
                                g.getLiderNombre(),
                                g.getDescripcion()))
                        .collect(Collectors.toList());

        List<com.muteam.backend.dto.response.EventoResponseDTO> eventosDTO = (persona.getEventos() == null) ? List.of()
                : persona.getEventos().stream()
                        .map(pe -> {
                            var e = pe.getEvento();
                            return new com.muteam.backend.dto.response.EventoResponseDTO(
                                    e.getId(),
                                    e.getArticuloId(),
                                    e.getNombre(),
                                    e.getFechaIni(),
                                    e.getFechaFin(),
                                    e.getUbicacion(),
                                    e.getSinopsis());
                        })
                        .collect(Collectors.toList());

        // Usar el repositorio para obtener relaciones bilaterales (origen o destino)
        List<com.muteam.backend.model.PersonaRelacion> todasRelaciones = personaRelacionRepository
                .findByAnyPersonaId(persona.getId());

        List<com.muteam.backend.dto.response.PersonaRelacionDTO> relacionesDTO = todasRelaciones.stream()
                .map(r -> {
                    // Determinar cuál es la "otra" persona en la relación
                    com.muteam.backend.model.Persona otraPersona = r.getPersonaOrigen().getId().equals(persona.getId())
                            ? r.getPersonaDestino()
                            : r.getPersonaOrigen();

                    return new com.muteam.backend.dto.response.PersonaRelacionDTO(
                            otraPersona.getId(),
                            otraPersona.getNombre());
                })
                .collect(Collectors.toList());

        return new PersonaResponseDTO(
                persona.getId(),
                persona.getArticuloId(),
                persona.getNombre(),
                persona.getApodos(),
                persona.getCumple(),
                persona.getTelefono(),
                persona.getDireccion(),
                persona.getEstado(),
                persona.getLoreGeneral(),
                persona.getEventoDestacadoId(),
                imagenUrl,
                gruposDTO,
                eventosDTO,
                relacionesDTO);
    }

    @Transactional
    public PersonaResponseDTO actualizarArticuloCompleto(
            Long personaId,
            PersonaCreateDTO personaDTO,
            ArticuloRequest articuloRequest,
            Long usuarioId) {

        // 1. Buscar Persona
        Persona persona = personaRepository.findById(personaId)
                .orElseThrow(() -> new RuntimeException("Persona no encontrada con ID: " + personaId));

        // 2. Actualizar datos de Persona
        persona.setNombre(personaDTO.getNombre());
        persona.setApodos(personaDTO.getApodos());
        // Lógica de fecha (reutilizada)
        if (personaDTO.getCumple() != null && !personaDTO.getCumple().isBlank()) {
            persona.setCumple(LocalDate.parse(personaDTO.getCumple()).atStartOfDay(ZoneOffset.UTC).toOffsetDateTime());
        }
        persona.setTelefono(personaDTO.getTelefono());
        persona.setDireccion(personaDTO.getDireccion());
        persona.setEstado(personaDTO.getEstado());
        persona.setLoreGeneral(personaDTO.getLoreGeneral());
        persona.setEventoDestacadoId(personaDTO.getEventoDestacadoId());

        // --- GRUPOS (Actualizar) ---
        if (personaDTO.getGruposIds() != null) {
            List<com.muteam.backend.model.Grupo> grupos = grupoRepository.findAllById(personaDTO.getGruposIds());
            persona.setGrupos(grupos);
        }

        // Guardamos cambios en la tabla Persona (incluye Grupos @ManyToMany)
        persona = personaRepository.save(persona);

        // --- EVENTOS (Actualizar) ---
        if (personaDTO.getEventos() != null) {
            personaEventoRepository.deleteByPersonaId(persona.getId());
            for (var eventoDTO : personaDTO.getEventos()) {
                if (eventoDTO.eventoId() == null)
                    continue;

                com.muteam.backend.model.Evento evento = eventoRepository.findById(eventoDTO.eventoId())
                        .orElseThrow(() -> new RuntimeException("Evento no encontrado: " + eventoDTO.eventoId()));

                com.muteam.backend.model.PersonaEvento personaEvento = new com.muteam.backend.model.PersonaEvento(
                        persona, evento, eventoDTO.rol());
                personaEventoRepository.save(personaEvento);
            }
        }

        // 3. Actualizar Artículo vinculado (si existe)
        if (persona.getArticuloId() != null) {
            articuloService.actualizarHistoriaCompleta(persona.getArticuloId(), articuloRequest, usuarioId);
        }

        // 4. Actualizar Relaciones
        // Borrar todas las relaciones donde esta persona esté involucrada (Origen o
        // Destino)
        personaRelacionRepository.deleteAllByPersonaOrigenIdOrPersonaDestinoId(persona.getId(), persona.getId());
        personaRelacionRepository.flush(); // Force delete execution

        // Insertar las nuevas
        if (personaDTO.getRelaciones() != null) {
            java.util.Set<Long> processedIds = new java.util.HashSet<>();
            for (var relDTO : personaDTO.getRelaciones()) {
                if (relDTO.personaDestinoId() != null) {
                    // Prevent duplicates in the payload
                    if (processedIds.contains(relDTO.personaDestinoId())) {
                        continue;
                    }
                    processedIds.add(relDTO.personaDestinoId());

                    Persona destino = personaRepository.findById(relDTO.personaDestinoId())
                            .orElseThrow(() -> new RuntimeException(
                                    "Persona destino no encontrada: " + relDTO.personaDestinoId()));

                    // Ordenar IDs (menor -> mayor)
                    Persona p1 = (persona.getId() < destino.getId()) ? persona : destino;
                    Persona p2 = (persona.getId() < destino.getId()) ? destino : persona;

                    if (p1.getId().equals(p2.getId()))
                        continue;

                    com.muteam.backend.model.PersonaRelacion relacion = new com.muteam.backend.model.PersonaRelacion(p1,
                            p2);
                    personaRelacionRepository.save(relacion);
                }
            }
        }

        // 5. Retornar DTO actualizado
        return convertirADTO(persona);
    }
}
