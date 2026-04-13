package com.uasflix_backend.repository;

import com.uasflix_backend.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    
    // Método para filtrar películas por carrera (ej: informatica, medicina)
    List<Movie> findByFaculty(String faculty);
}