package com.parcial.futbol.Services;

import com.parcial.futbol.Entity.Equipo;
import com.parcial.futbol.Repository.EquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EquipoServicio {

    @Autowired
    private EquipoRepository equipoRepository;

    public List<Equipo> listarTodos() {
        return equipoRepository.findAll();
    }

    public Optional<Equipo> buscarPorId(Long id) {
        return equipoRepository.findById(id);
    }

    public Equipo guardarEquipo(Equipo equipo) {
        return equipoRepository.save(equipo);
    }

    public void eliminarEquipo(Long id) {
        equipoRepository.deleteById(id);
    }
}
