package com.parcial.futbol.Controller;

import com.parcial.futbol.Entity.Equipo;
import com.parcial.futbol.Services.EquipoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/equipos")
@CrossOrigin(origins = "*")
public class EquipoControlador {

    @Autowired
    private EquipoServicio equipoServicio;

    // Metodo GET: Listar todos los equipos (incluyendo sus partidos)
    @GetMapping
    public List<Equipo> listarEquipos() {
        return equipoServicio.listarTodos();
    }

    // Metodo GET: Obtener un equipo por ID
    @GetMapping("/{id}")
    public Optional<Equipo> obtenerEquipo(@PathVariable Long id) {
        return equipoServicio.buscarPorId(id);
    }

    // Metodo POST: Crear un nuevo equipo
    @PostMapping
    public Equipo crearEquipo(@RequestBody Equipo equipo) {
        return equipoServicio.guardarEquipo(equipo);
    }

    // Metodo DELETE: Eliminar equipo por ID
    @DeleteMapping("/{id}")
    public void eliminarEquipo(@PathVariable Long id) {
        equipoServicio.eliminarEquipo(id);
    }
}
