package com.uasflix_backend.controller;

import com.uasflix_backend.model.Comment;
import com.uasflix_backend.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    // Obtener todos los comentarios de una película específica
    @GetMapping("/movie/{movieId}")
    public List<Comment> getCommentsByMovie(@PathVariable Long movieId) {
        return commentRepository.findByMovieIdOrderByCreatedAtDesc(movieId);
    }

    // Guardar un nuevo comentario
    @PostMapping
    public ResponseEntity<Comment> addComment(@RequestBody Comment comment) {
        Comment savedComment = commentRepository.save(comment);
        return ResponseEntity.ok(savedComment);
    }
}