package com.example.smartexaminer.repository;


import com.example.smartexaminer.model.entity.user.BackofficeReviewer;
import com.example.smartexaminer.model.entity.user.BackofficeUploader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface BackOfficeUploaderRepository extends JpaRepository<BackofficeUploader, Integer> {


}