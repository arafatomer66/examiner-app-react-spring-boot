package com.example.smartexaminer.repository;


import com.example.smartexaminer.model.entity.SubscriptionUserData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotNull;
import java.util.List;

@Repository
public interface SubscriptionUserDataRepository extends JpaRepository<SubscriptionUserData, Integer> {

    @NotNull
    SubscriptionUserData findByUserId(Integer userId);

    @NotNull
    SubscriptionUserData findByUserIdAndActive(Integer userId, Boolean active);

    @NotNull
    List<SubscriptionUserData> findAllByUserIdAndSubscriptionPlanId(Integer userId, Integer subscriptionId);

    @NotNull
    SubscriptionUserData findByUserIdAndSubscriptionPlanIdAndActive(Integer userId, Integer subscriptionId, Boolean active);

    @NotNull
    SubscriptionUserData findByUserIdAndPaymentgatewayrefAndActive(Integer userId, String paymentgatewayref, Boolean active);

    List<SubscriptionUserData> findAllByUserIdAndSubscriptionEndDateBetween(Integer userId, String startDate, String endDate);

    List<SubscriptionUserData> findAllByUserId(Integer userId);

    Integer countByUserId(Integer userId);

    SubscriptionUserData findByPaymentgatewayref(String paymentgatewayref);

    SubscriptionUserData findFirstByUserIdAndActiveOrderByUserIdDesc(Integer userId, boolean active);
    SubscriptionUserData findTopByUserIdOrderByCreatedDateDesc(Integer userId);
}
