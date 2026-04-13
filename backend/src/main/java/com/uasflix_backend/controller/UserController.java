package com.uasflix_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uasflix_backend.model.User;
import com.uasflix_backend.repository.UserRepository;

@RestController
@RequestMapping("/api/users") 
@CrossOrigin(origins = "*")   
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register") 
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        
        if (!user.getEmail().endsWith("@info.uas.edu.mx")) {
            return ResponseEntity.badRequest().body("Dominio no permitido.");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("El correo ya está registrado.");
        }

        userRepository.save(user);
        return ResponseEntity.ok("Usuario registrado con éxito.");
    }

    // EL ERROR ESTABA AQUÍ: El método debe estar ANTES de la última llave de la clase
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginData) {
        User user = userRepository.findByEmail(loginData.getEmail());

        if (user != null && user.getPassword().equals(loginData.getPassword())) {
            // Si el usuario existe y la contraseña coincide
            return ResponseEntity.ok(user);
        } else {
            // Si algo está mal, mandamos un error 401 (No autorizado)
            return ResponseEntity.status(401).body("Correo o contraseña incorrectos.");
        }
    }
} // <--- Esta es la llave que cierra la CLASE y ahora está al final.