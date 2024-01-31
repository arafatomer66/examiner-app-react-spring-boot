package com.example.smartexaminer.repository;


import com.example.smartexaminer.model.entity.SubscriptionPlans;
import io.swagger.models.auth.In;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionPlansRepository extends JpaRepository<SubscriptionPlans, Integer> {
    Optional<SubscriptionPlans> findByPriceId(String subplanid);

    SubscriptionPlans findByPriceIdAndActive(String subplanid, Integer active);
    List<SubscriptionPlans> findAllByActiveOrderByCurrentprice(Integer active);
}
