package com.parcial.futbol.Services;

import com.parcial.futbol.Entity.Equipo;
import com.parcial.futbol.Entity.Partido;
import com.parcial.futbol.Repository.EquipoRepository;
import com.parcial.futbol.Repository.PartidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PartidoServicio {

    @Autowired
    private PartidoRepository partidoRepository;

    @Autowired
    private EquipoRepository equipoRepository;

    public List<Partido> listarTodos() {
        return partidoRepository.findAll();
    }

    public Optional<Partido> buscarPorId(Long id) {
        return partidoRepository.findById(id);
    }

    public List<Partido> buscarPorEquipo(Long equipoId) {
        return partidoRepository.findByEquipoId(equipoId);
    }

    public Partido registrarPartido(Partido partido) {
        if (partido.getEquipo() != null && partido.getEquipo().getId() != null) {
            Optional<Equipo> equipoOptional = equipoRepository.findById(partido.getEquipo().getId());
            equipoOptional.ifPresent(partido::setEquipo);
        }
        return partidoRepository.save(partido);
    }

    public void eliminarPartido(Long id) {
        partidoRepository.deleteById(id);
    }
}
