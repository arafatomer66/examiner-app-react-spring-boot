package com.example.smartexaminer.controller;

import com.example.smartexaminer.model.dto.ResponseData;
import com.example.smartexaminer.service.SubscriptionPlansService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/v1/subscriptions")
@CrossOrigin(origins = "*")
public class SubscriptionPlansController {
    @Autowired
    private SubscriptionPlansService subscriptionService;

    @GetMapping("/active")
    public ResponseEntity<ResponseData> getActiveSubscriptions(){
        Map<String, Object> res = new HashMap<>();
        res.put("subscription", this.subscriptionService.getActiveSubscriptionPlans());
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{planId}/exam/{examId}")
    public ResponseEntity<ResponseData> addExamByPLanIdAndExamId(
            @PathVariable Integer planId,
            @PathVariable Integer examId
    ){
        Map<String, Object> res = new HashMap<>();
        res.put("subscription", this.subscriptionService.addExamByPLanIdAndExamId(
                planId,
                examId
        ));
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{planId}/exam/{examId}")
    public ResponseEntity<ResponseData> deleteExamByPLanIdAndExamId(
            @PathVariable Integer planId,
            @PathVariable Integer examId
    ){
        Map<String, Object> res = new HashMap<>();
        res.put("deleted", this.subscriptionService.deleteExamByPLanIdAndExamId(
                planId,
                examId
        ));
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }
}
