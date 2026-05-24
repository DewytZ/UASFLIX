package com.uasflix_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uasflix_backend.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Este método buscará automáticamente todos los comentarios de una película específica ordenados del más nuevo al más viejo
    List<Comment> findByMovieIdOrderByCreatedAtDesc(Long movieId);
}