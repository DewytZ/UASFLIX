package com.uasflix_backend.repository;

import com.uasflix_backend.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    // Busca si un usuario ya calificó una película específica
    Optional<Rating> findByMovieIdAndUserEmail(Long movieId, String userEmail);

    // Consulta personalizada para calcular el promedio de estrellas de una película
    @Query("SELECT AVG(r.stars) FROM Rating r WHERE r.movieId = :movieId")
    Double getAverageRatingByMovieId(Long movieId);
}
