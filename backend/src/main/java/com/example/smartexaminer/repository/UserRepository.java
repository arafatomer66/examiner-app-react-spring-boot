package com.example.smartexaminer.repository;

import com.example.smartexaminer.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
    public interface UserRepository extends JpaRepository<User, Long> {

        Optional<User> findUserByActivationKey(String activationKey);
        Optional<User> findUserByUsernameAndPassword(String username , String password);
        Optional<User> findUserByUsername(String username);
        boolean findUserByPasswordResetToken(String passwordResetToken);
        boolean existsByUsername(String username);

    }

