package com.example.smartexaminer.repository;


import com.example.smartexaminer.model.entity.user.Admin;
import com.example.smartexaminer.model.entity.user.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {


}