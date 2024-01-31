package com.example.smartexaminer.controller;

import com.example.smartexaminer.model.dto.ResponseData;
import com.example.smartexaminer.model.entity.SubscriptionPlans;
import com.example.smartexaminer.model.entity.SubscriptionUserData;
import com.example.smartexaminer.service.SubscriptionPlansService;
import com.example.smartexaminer.service.SubscriptionUserDataService;
import com.example.smartexaminer.utils.Common;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping(value = "/api/v1/user-subscriptions")
@EnableMethodSecurity
@CrossOrigin(origins = "*")
public class SubscriptionUserDataController {

    @Autowired
    private SubscriptionPlansService subscriptionService;
    @Autowired
    private SubscriptionUserDataService usersSubscriptionService;

    @PreAuthorize("hasAuthority('STUDENT') or hasAuthority('TEACHER') or hasAuthority('PARENT') or hasAuthority('ADMIN')")
    @GetMapping("/latest")
    public ResponseEntity<ResponseData> getLatestSubscriptions() {
        Integer id = Common.getCurrentId();
        SubscriptionUserData usersSubscription = usersSubscriptionService.findLatestActiveUsersSubscriptionByUserId(id);
        SubscriptionPlans subscriptionActivePlan = null;
        if (usersSubscription != null) {
            subscriptionActivePlan = subscriptionService.getSubscriptionById(usersSubscription.getSubscriptionPlanId());
        }
        HashMap<String, Object> response = new HashMap<>();
        response.put("subscription", usersSubscription);
        response.put("plan", subscriptionActivePlan);
        ResponseData responseData = ResponseData.builder().setCode(0).setData(response).build();
        return ResponseEntity.ok(responseData);
    }


}

