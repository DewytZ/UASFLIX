package com.uasflix_backend.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uasflix_backend.model.Rating;
import com.uasflix_backend.repository.RatingRepository;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*")
public class RatingController {

    @Autowired
    private RatingRepository ratingRepository;

    // Obtener el promedio de estrellas de una película
    @GetMapping("/movie/{movieId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long movieId) {
        Double average = ratingRepository.getAverageRatingByMovieId(movieId);
        // Si nadie ha calificado aún, devolvemos 0.0 en lugar de null
        return ResponseEntity.ok(average != null ? average : 0.0);
    }

    // Guardar o actualizar la calificación de un alumno
    @PostMapping
    public ResponseEntity<?> saveRating(@RequestBody Rating rating) {
        // Buscamos si el alumno ya había calificado esta película antes
        Optional<Rating> existingRating = ratingRepository.findByMovieIdAndUserEmail(rating.getMovieId(), rating.getUserEmail());

        if (existingRating.isPresent()) {
            // Si ya existe, actualizamos las estrellas antiguas por las nuevas
            Rating currentRating = existingRating.get();
            currentRating.setStars(rating.getStars());
            ratingRepository.save(currentRating);
            return ResponseEntity.ok(Map.of("message", "Calificación actualizada con éxito"));
        } else {
            // Si es la primera vez, guardamos la calificación nueva
            ratingRepository.save(rating);
            return ResponseEntity.ok(Map.of("message", "Calificación guardada con éxito"));
        }
    }
}