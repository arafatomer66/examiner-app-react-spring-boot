package com.example.smartexaminer.repository;


import com.example.smartexaminer.model.entity.UserToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TokenRepository extends JpaRepository<UserToken, Integer> {
}