package com.parcial.futbol.Controller;

import com.parcial.futbol.Entity.Partido;
import com.parcial.futbol.Services.PartidoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/partidos")
@CrossOrigin(origins = "*")
public class PartidoControlador {

    @Autowired
    private PartidoServicio partidoServicio;

    // Metodo GET: Listar todos los partidos
    @GetMapping
    public List<Partido> listarPartidos() {
        return partidoServicio.listarTodos();
    }

    // Metodo GET: Obtener un partido por ID
    @GetMapping("/{id}")
    public Optional<Partido> obtenerPartido(@PathVariable Long id) {
        return partidoServicio.buscarPorId(id);
    }

    // Metodo GET: Obtener partidos filtrados por equipo
    @GetMapping("/equipo/{equipoId}")
    public List<Partido> obtenerPartidosPorEquipo(@PathVariable Long equipoId) {
        return partidoServicio.buscarPorEquipo(equipoId);
    }

    // Metodo POST: Registrar un nuevo partido
    @PostMapping
    public Partido registrarPartido(@RequestBody Partido partido) {
        return partidoServicio.registrarPartido(partido);
    }

    // Metodo DELETE: Eliminar un partido por ID
    @DeleteMapping("/{id}")
    public void eliminarPartido(@PathVariable Long id) {
        partidoServicio.eliminarPartido(id);
    }
}
