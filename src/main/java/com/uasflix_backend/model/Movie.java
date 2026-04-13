package com.uasflix_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Indica que esta clase es una tabla de base de datos
@Table(name = "movies") // Nombre de la tabla en Postgres
@Data // Genera Getters, Setters, toString, etc. (Gracias a Lombok)
@NoArgsConstructor // Genera constructor vacío
@AllArgsConstructor // Genera constructor con todos los campos
public class Movie {

    @Id // Llave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Autoincremental
    private Long id;

    private String title;
    private String genre;
    private String faculty; // Para el filtro de carreras (Informatica, Medicina, etc.)
    private String imagePath; // Ruta de la imagen (ej: "img/matrix.jpg")
    
    // Usamos Column(columnDefinition = "TEXT") si la sinopsis es muy larga
    private String description;
    private String videoUrl; // Para guardar el link de YouTube
}