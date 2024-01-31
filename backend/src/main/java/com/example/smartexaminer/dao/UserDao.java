package com.example.smartexaminer.dao;

import com.example.smartexaminer.model.entity.User;
import com.example.smartexaminer.repository.UserRepository;
import com.example.smartexaminer.utils.Common;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public class UserDao {

    @Autowired
    private final UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;

    public UserDao(UserRepository userRepository, JdbcTemplate jdbcTemplate) {
        this.userRepository = userRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    //Save User and return its id
    public User save(User user) {
        try {
            return userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Cannot save user|User not saved. An exception was thrown");
        }
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByUsername(email);
    }

    public User findByEmailAndPassword(String email, String password){
        Optional<User> u = userRepository.findUserByUsernameAndPassword(email, Common.md5(password));
        if(u.isPresent())
            return u.get();
        throw new RuntimeException("Invalid email or password");
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findUserByUsername(email);
    }

    public void activateAccount(String email) {
        String query = "UPDATE tbluser SET usr_status = '02' WHERE usr_email = ?";
        jdbcTemplate.update(query,email);
    }

    public User findByUserId (long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.get();
    }
}
