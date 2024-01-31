package com.example.smartexaminer.repository;

import com.example.smartexaminer.model.entity.TableSequence;
import com.example.smartexaminer.model.entity.TableSequence;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TableSequenceRepository extends JpaRepository<TableSequence, Integer> {
    public TableSequence findOneByTableType(String tableType);
}