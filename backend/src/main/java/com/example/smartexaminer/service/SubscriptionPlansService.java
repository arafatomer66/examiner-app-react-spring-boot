package com.example.smartexaminer.service;

import com.example.smartexaminer.model.dto.ResponseData;
import com.example.smartexaminer.model.entity.Explanation;
import com.example.smartexaminer.model.entity.SubscriptionPlans;
import com.example.smartexaminer.repository.SubscriptionPlansRepository;
import com.example.smartexaminer.utils.Constants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SubscriptionPlansService {

    @Autowired
    private SubscriptionPlansRepository subscriptionPlanRepository;

    public SubscriptionPlans getSubscriptionById(Integer subId) {
        Optional<SubscriptionPlans> subOpt = subscriptionPlanRepository.findById(subId);
        return subOpt.orElse(null);
    }

    public List<SubscriptionPlans> getSubscriptionPlans(){
        List<SubscriptionPlans> subscriptions = this.subscriptionPlanRepository.findAll();
        System.out.println("subscriptions = " + subscriptions);
        return subscriptions;
    }

    public List<SubscriptionPlans> getActiveSubscriptionPlans(){
        List<SubscriptionPlans> subscriptions = subscriptionPlanRepository.findAllByActiveOrderByCurrentprice(Constants.SUBSCRIPTION_PLAN_ACTIVE_CODE);
        System.out.println("subscriptions = " + subscriptions);
        return subscriptions;
    }

    public SubscriptionPlans getSubscriptionByPlanId(String subplanid) {
        Optional<SubscriptionPlans> subscription = subscriptionPlanRepository.findByPriceId(subplanid);
        return subscription.orElse(null);
    }

    public SubscriptionPlans fetchSubscriptionByPlanId(String subplanid) {
        Optional<SubscriptionPlans> subscription = subscriptionPlanRepository.findByPriceId(subplanid);
        return subscription.orElse(null);
    }

    public SubscriptionPlans getActiveSubscriptionByPlanId(String subplanid) {
        return subscriptionPlanRepository.findByPriceIdAndActive(subplanid, Constants.SUBSCRIPTION_PLAN_ACTIVE_CODE);
    }

    public Boolean deleteExamByPLanIdAndExamId(Integer id, Integer examId) {
        try {
            SubscriptionPlans plan = this.getSubscriptionById(id);
            plan.setExamList(
                    plan.getExamList().stream()
                            .filter((Integer value)-> !value.equals(examId)).collect(Collectors.toList())
            );
            subscriptionPlanRepository.save(plan);
            return true;
        }
        catch (Exception error){
            return false;
        }
    }

    public SubscriptionPlans addExamByPLanIdAndExamId(Integer id, Integer examId) {
        try {
            SubscriptionPlans plan = this.getSubscriptionById(id);
            if (plan.getExamList().contains(examId)){
                throw new RuntimeException("Existing exam|Exam exists by id="+examId);
            }
            else{
                plan.getExamList().add(examId);
            }
            subscriptionPlanRepository.save(plan);
            return plan;
        }
        catch (Exception error){
            return null;
        }
    }
}
