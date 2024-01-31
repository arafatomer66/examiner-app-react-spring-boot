package com.example.smartexaminer.repository;


import com.example.smartexaminer.model.entity.test.AttemptHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface AttemptHistoryRepository extends JpaRepository<AttemptHistory, Integer> {
    List<AttemptHistory> findByUserId(Integer userId);

}