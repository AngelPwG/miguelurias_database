package com.muteam.backend.service;

import com.muteam.backend.dto.response.EventoResponseDTO;
import com.muteam.backend.repository.EventoRepository;
import com.muteam.backend.model.Evento;
import com.muteam.backend.model.Persona;
import com.muteam.backend.model.PersonaEvento;
import com.muteam.backend.repository.PersonaEventoRepository;
import com.muteam.backend.repository.PersonaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;
    private final ArticuloService articuloService;
    private final PersonaRepository personaRepository;
    private final PersonaEventoRepository personaEventoRepository;
    private final com.muteam.backend.repository.ArticuloRepository articuloRepository; // Inject ArticuloRepository

    public EventoService(EventoRepository eventoRepository, ArticuloService articuloService,
            PersonaRepository personaRepository, PersonaEventoRepository personaEventoRepository,
            com.muteam.backend.repository.ArticuloRepository articuloRepository) {
        this.eventoRepository = eventoRepository;
        this.articuloService = articuloService;
        this.personaRepository = personaRepository;
        this.personaEventoRepository = personaEventoRepository;
        this.articuloRepository = articuloRepository;
    }

    public Page<EventoResponseDTO> obtenerEventos(int page, int size, Integer userLevel) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Evento> eventosPage;

        if (userLevel == null) {
            userLevel = 0;
        }

        eventosPage = eventoRepository.findAllByNivelAcceso(userLevel, pageable);

        return eventosPage.map(this::convertirADTO);
    }

    public List<com.muteam.backend.dto.response.EventoSimpleDTO> obtenerEventosSimple(Integer userLevel) {
        if (userLevel == null)
            userLevel = 0;
        return eventoRepository.findAllSimpleByNivelAcceso(userLevel);
    }

    public Page<com.muteam.backend.dto.response.EventoCardDTO> obtenerEventosCards(int page, int size,
            Integer userLevel) {
        if (userLevel == null)
            userLevel = 0;
        Pageable pageable = PageRequest.of(page, size);
        return eventoRepository.findAllCardsByNivelAcceso(userLevel, pageable);
    }

    public EventoResponseDTO obtenerEventoPorId(Long id, Integer userLevel) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado: " + id));

        // Security check
        if (evento.getArticuloId() != null) {
            java.util.Optional<com.muteam.backend.model.Articulo> art = articuloRepository
                    .findById(evento.getArticuloId());
            if (art.isPresent()) {
                int nivelArticulo = art.get().getNivelAcceso() != null ? art.get().getNivelAcceso() : 0;
                int nivelUsuario = userLevel != null ? userLevel : 0;

                if (nivelArticulo > nivelUsuario) {
                    throw new RuntimeException("Evento no encontrado: " + id);
                }
            }
        }

        return convertirADTO(evento);
    }

    @jakarta.transaction.Transactional
    public EventoResponseDTO actualizarEvento(Long id, com.muteam.backend.dto.request.EventoRequest request,
            Long usuarioId) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado: " + id));

        // 1. Actualizar Artículo
        articuloService.actualizarHistoriaCompleta(evento.getArticuloId(), request.articuloRequest(), usuarioId);

        // 2. Actualizar Evento
        evento.setNombre(request.nombre());
        evento.setFechaIni(request.fechaIni());
        evento.setFechaFin(request.fechaFin());
        evento.setUbicacion(request.ubicacion());
        evento.setSinopsis(request.sinopsis());
        Evento eventoActualizado = eventoRepository.save(evento);

        // 3. Actualizar Participantes (Borrar y Recrear - Estrategia simple)
        if (request.participantes() != null) {
            personaEventoRepository.deleteByEventoId(id);
            for (com.muteam.backend.dto.request.EventoRequest.ParticipanteRequest partReq : request.participantes()) {
                Persona persona = personaRepository.findById(partReq.personaId())
                        .orElseThrow(() -> new RuntimeException("Persona no encontrada: " + partReq.personaId()));

                String rol = partReq.rol() != null && !partReq.rol().isBlank() ? partReq.rol() : "Participante";
                PersonaEvento relacion = new PersonaEvento(persona, eventoActualizado, rol);
                personaEventoRepository.save(relacion);
            }
        }

        return convertirADTO(eventoActualizado);
    }

    private EventoResponseDTO convertirADTO(Evento evento) {
        List<EventoResponseDTO.ParticipanteDTO> participantes = personaEventoRepository.findByEventoId(evento.getId())
                .stream()
                .map(pe -> new EventoResponseDTO.ParticipanteDTO(
                        pe.getPersona().getId(),
                        pe.getPersona().getNombre(),
                        pe.getRolEnEvento()))
                .collect(Collectors.toList());

        String imagenUrl = null;
        if (evento.getArticuloId() != null) {
            java.util.Optional<com.muteam.backend.model.Articulo> articuloOpt = articuloRepository
                    .findById(evento.getArticuloId());
            if (articuloOpt.isPresent()) {
                com.muteam.backend.model.Articulo articulo = articuloOpt.get();
                if (articulo.getGaleria() != null && !articulo.getGaleria().isEmpty()) {
                    imagenUrl = articulo.getGaleria().get(0).getUrl();
                }
            }
        }

        return new EventoResponseDTO(
                evento.getId(),
                evento.getArticuloId(),
                evento.getNombre(),
                evento.getFechaIni(),
                evento.getFechaFin(),
                evento.getUbicacion(),
                evento.getSinopsis(),
                imagenUrl,
                participantes);
    }

    @jakarta.transaction.Transactional
    public EventoResponseDTO crearEvento(com.muteam.backend.dto.request.EventoRequest request, Long usuarioId) {
        // 1. Crear Articulo
        var articuloDTO = articuloService.guardarHistoriaCompleta(request.articuloRequest(), usuarioId);

        // 2. Crear Evento
        Evento evento = new Evento();
        evento.setArticuloId(articuloDTO.id());
        evento.setNombre(request.nombre());
        evento.setFechaIni(request.fechaIni());
        evento.setFechaFin(request.fechaFin());
        evento.setUbicacion(request.ubicacion());
        evento.setSinopsis(request.sinopsis());

        Evento eventoGuardado = eventoRepository.save(evento);

        // 3. Guardar Participantes (Personas)
        if (request.participantes() != null) {
            for (com.muteam.backend.dto.request.EventoRequest.ParticipanteRequest partReq : request.participantes()) {
                Persona persona = personaRepository.findById(partReq.personaId())
                        .orElseThrow(() -> new RuntimeException("Persona no encontrada: " + partReq.personaId()));

                String rol = partReq.rol() != null && !partReq.rol().isBlank() ? partReq.rol() : "Participante";
                PersonaEvento relacion = new PersonaEvento(persona, eventoGuardado, rol);
                personaEventoRepository.save(relacion);
            }
        }

        return convertirADTO(eventoGuardado);
    }
}
