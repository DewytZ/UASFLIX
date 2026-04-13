package com.uasflix_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uasflix_backend.model.Movie;
import com.uasflix_backend.repository.MovieRepository;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "*") // Importante para que tu HTML pueda pedir datos
public class MovieController {

    @Autowired
    private MovieRepository movieRepository;

    // Obtener todas las películas: http://localhost:8081/api/movies
    @GetMapping
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    // Obtener por facultad: http://localhost:8081/api/movies/faculty/informatica
    @GetMapping("/faculty/{faculty}")
    public List<Movie> getMoviesByFaculty(@PathVariable String faculty) {
        return movieRepository.findByFaculty(faculty);
    }

    @GetMapping("/{id}")
    public Movie getMovieById(@PathVariable Long id) {
    return movieRepository.findById(id).orElse(null);
}
}