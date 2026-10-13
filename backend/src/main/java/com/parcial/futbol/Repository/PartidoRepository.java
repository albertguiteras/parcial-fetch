package com.parcial.futbol.Repository;

import com.parcial.futbol.Entity.Partido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartidoRepository extends JpaRepository<Partido, Long> {
    List<Partido> findByEquipoId(Long equipoId);
}
