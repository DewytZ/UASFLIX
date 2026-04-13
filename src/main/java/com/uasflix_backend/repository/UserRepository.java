package com.uasflix_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uasflix_backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    // Esto servirá para validar que no se repitan correos
    boolean existsByEmail(String email);
    User findByEmail(String email);
}
