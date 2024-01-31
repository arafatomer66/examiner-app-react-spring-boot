package com.example.smartexaminer.repository;


import com.example.smartexaminer.model.entity.User;
import com.example.smartexaminer.model.entity.user.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ParentRepository extends JpaRepository<Parent, Integer> {


}