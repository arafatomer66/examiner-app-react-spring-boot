package com.example.smartexaminer.repository;


import com.example.smartexaminer.model.entity.user.BackofficeReviewer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface BackOfficeReviewerRepository extends JpaRepository<BackofficeReviewer, Integer> {


}