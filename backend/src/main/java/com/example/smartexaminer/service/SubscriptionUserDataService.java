package com.example.smartexaminer.service;


import com.example.smartexaminer.model.dto.ResponseData;
import com.example.smartexaminer.model.entity.SubscriptionPlans;
import com.example.smartexaminer.model.entity.SubscriptionUserData;
import com.example.smartexaminer.model.entity.stripe.ErrorMessage;
import com.example.smartexaminer.repository.SubscriptionUserDataRepository;
import com.example.smartexaminer.utils.Common;
import com.example.smartexaminer.utils.Constants;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
@Service
@Slf4j
public class SubscriptionUserDataService {

    @Autowired
    private SubscriptionUserDataRepository subscriptionUserDataRepository;

    @Autowired
    private SubscriptionPlansService subscriptionPlanService;

    public SubscriptionUserData createUsersSubscription(Integer subscriptionId, String stripeSubscriptionId, Date subscriptionStartDate, Date subscriptionEndDate, Boolean active){
        try {
            SubscriptionUserData usersSubscription = SubscriptionUserData.builder()
                    .setUserId(Common.getCurrentId())
                    .setSubscriptionPlanId(subscriptionId)
                    .setPaymentgatewayref(stripeSubscriptionId)
                    .setSubscriptionStartDate(subscriptionStartDate)
                    .setSubscriptionEndDate(subscriptionEndDate)
                    .setCreatedDate(new Date())
                    .setActive(active)
                    .build();

            return this.subscriptionUserDataRepository.save(usersSubscription);
        } catch (Exception e) {
            throw new RuntimeException(ErrorMessage.CREATE_USERS_SUBSCRIPTION);
        }
    }

    public SubscriptionUserData activateByPaymentgatewayref(SubscriptionUserData usersSubscription, String paymentgatewayref, Date startDate){
        Date nextMonth = new Date();
        nextMonth.setMonth(startDate.getMonth()+1);
        usersSubscription.setPaymentgatewayref(paymentgatewayref);
        usersSubscription.setSubscriptionEndDate(nextMonth);
        usersSubscription.setActive(Constants.USERS_SUBSCRIPTION_ACTIVE_CODE);
        usersSubscription.setSubscriptionStartDate(startDate);
        subscriptionUserDataRepository.save(usersSubscription);
        return usersSubscription;
    }

    public SubscriptionUserData getUsersSubscriptionByUserId(){
        try{
            return this.subscriptionUserDataRepository.findByUserId(
                    Common.getCurrentId()
            );
        } catch (Exception e) {
            throw new RuntimeException(ErrorMessage.NOT_FOUND_USERS_SUBSCRIPTION);
        }
    }

    public SubscriptionUserData getActiveUsersSubscriptionByUserId(){
        try{
            return subscriptionUserDataRepository.findByUserIdAndActive(
                    Common.getCurrentId(),
                    Constants.USERS_SUBSCRIPTION_ACTIVE_CODE
            );
        } catch (Exception e) {
            throw new RuntimeException(ErrorMessage.NOT_FOUND_USERS_SUBSCRIPTION);
        }
    }

    public SubscriptionUserData getActiveUsersSubscriptionByUserId(Integer userId){
        try{
            return subscriptionUserDataRepository.findByUserIdAndActive(
                    userId,
                    Constants.USERS_SUBSCRIPTION_ACTIVE_CODE
            );
        } catch (Exception e) {
            throw new RuntimeException(ErrorMessage.NOT_FOUND_USERS_SUBSCRIPTION);
        }
    }

    public ResponseData getActiveUsersSubscription(){
        try{
            SubscriptionUserData usersSubscription = getActiveUsersSubscriptionByUserId();
            if(usersSubscription == null){
                return ResponseData.builder().setCode(1).setData(null).setMessage(ErrorMessage.NOT_FOUND_USERS_SUBSCRIPTION).build();
            }else{
                SubscriptionPlans subscription = subscriptionPlanService.getSubscriptionById(usersSubscription.getSubscriptionPlanId());
                HashMap<String, Object> result = new HashMap<>();
                result.put("subscription", subscription);
                result.put("usersSubscription", usersSubscription);
                return ResponseData.builder().setCode(0).setData(result).build();
            }
        } catch (Exception e) {
            throw new RuntimeException(ErrorMessage.NOT_FOUND_USERS_SUBSCRIPTION);
        }
    }

    public ResponseData getUsersSubscription() {
        try{
            List<SubscriptionUserData> usersSubscriptions = subscriptionUserDataRepository.findAllByUserId(Common.getCurrentId());
            if(usersSubscriptions.isEmpty()){
                return ResponseData.builder().setCode(1).setData(null).setMessage(ErrorMessage.NOT_FOUND_USERS_SUBSCRIPTION).build();
            }else{
                return ResponseData.builder().setCode(0).setData(usersSubscriptions).build();
            }
        } catch (Exception e) {
            throw new RuntimeException(ErrorMessage.NOT_FOUND_USERS_SUBSCRIPTION);
        }
    }

//    public Integer countUsersSubscriptionByUserId(Integer userId){
//        return subscriptionUserDataRepository.countByUserId(userId);
//    }

    public SubscriptionUserData findLatestActiveUsersSubscriptionByUserId(Integer userId){
        return subscriptionUserDataRepository.findFirstByUserIdAndActiveOrderByUserIdDesc(
                userId,
                Constants.USERS_SUBSCRIPTION_ACTIVE_CODE
        );
    }

    public SubscriptionUserData getActiveUsersSubscriptionByUserIdAndSubscriptionId(Integer subscriptionId){
        try{
            return this.subscriptionUserDataRepository.findByUserIdAndSubscriptionPlanIdAndActive(
                    Common.getCurrentId(),
                    subscriptionId,
                    Constants.USERS_SUBSCRIPTION_ACTIVE_CODE
            );
        } catch (Exception e) {
            throw new RuntimeException(ErrorMessage.NOT_FOUND_USERS_SUBSCRIPTION);
        }
    }

    public SubscriptionUserData getActiveUsersSubscriptionByUserIdPaymentgatewayref(Integer userId, String paymentgatewayref){
        try{
            return this.subscriptionUserDataRepository.findByUserIdAndPaymentgatewayrefAndActive(
                    userId,
                    paymentgatewayref,
                    Constants.USERS_SUBSCRIPTION_ACTIVE_CODE
            );
        } catch (Exception e) {
            throw new RuntimeException(ErrorMessage.NOT_FOUND_USERS_SUBSCRIPTION);
        }
    }

    public SubscriptionUserData disableSubscriptionByUserIdAndPaymentgatewayref(Integer userId, String paymentgatewayref){
        try{
            SubscriptionUserData usersSubscription =
                    this.getActiveUsersSubscriptionByUserIdPaymentgatewayref(
                            userId,
                            paymentgatewayref
                    );
            if(usersSubscription == null) {
                throw new RuntimeException(ErrorMessage.NOT_FOUND_USERS_SUBSCRIPTION);
            }
            else{
                usersSubscription.setActive(Constants.USERS_SUBSCRIPTION_INACTIVE_CODE);
                usersSubscription.setSubscriptionEndDate(new Date());
                subscriptionUserDataRepository.save(usersSubscription);
                return usersSubscription;
            }
        } catch (Exception e) {
            throw new RuntimeException(ErrorMessage.NOT_FOUND_USERS_SUBSCRIPTION);
        }
    }

    public void disableSubscriptionByPaymentgatewayref(String paymentgatewayref){
        try{
            SubscriptionUserData usersSubscription =
                    subscriptionUserDataRepository.findByPaymentgatewayref(paymentgatewayref);
            if(usersSubscription == null || usersSubscription.getActive().equals(Constants.USERS_SUBSCRIPTION_INACTIVE_CODE)) {
                log.info("(disableSubscriptionByPaymentgatewayref) : Subscription already canceled from App");
            }
            else{
                log.info("(disableSubscriptionByPaymentgatewayref) subscriptionId : "+ usersSubscription.getSubscriptionPlanId() +" : Subscription canceled from Stripe event");
                usersSubscription.setActive(Constants.USERS_SUBSCRIPTION_INACTIVE_CODE);
                subscriptionUserDataRepository.save(usersSubscription);
            }
        } catch (Exception e) {
            throw new RuntimeException(ErrorMessage.NOT_FOUND_USERS_SUBSCRIPTION);
        }
    }

  

}
