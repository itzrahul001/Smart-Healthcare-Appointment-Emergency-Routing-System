package com.smarthealthcare.repository;

import com.smarthealthcare.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    java.util.List<com.smarthealthcare.entity.User> findByRoleAndStatus(com.smarthealthcare.entity.Role role,
            com.smarthealthcare.entity.UserStatus status);
}
