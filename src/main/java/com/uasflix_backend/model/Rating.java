package com.uasflix_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "movie_ratings", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"movie_id", "user_email"})
})
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "stars", nullable = false)
    private int stars;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public int getStars() { return stars; }
    public void setStars(int stars) { this.stars = stars; }
}