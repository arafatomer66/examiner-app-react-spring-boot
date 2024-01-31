package com.example.smartexaminer.controller;

import com.example.smartexaminer.model.dto.ResponseData;
import com.example.smartexaminer.model.entity.stripe.StripePaymentMethodUpdateDto;
import com.example.smartexaminer.model.entity.stripe.StripeSubscriptionCancelDto;
import com.example.smartexaminer.model.entity.stripe.StripeSubscriptionCreateDto;
import com.example.smartexaminer.service.StripeService;
import com.example.smartexaminer.utils.Common;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(value = "/api/v1/stripe")
@EnableMethodSecurity
@CrossOrigin(origins = "*")
public class StripeController {

    @Autowired
    private StripeService stripeService;

//    @GetMapping("/payment/{paymentId}")
//    public ResponseEntity<Boolean> getPaymentById(@PathVariable String paymentId) {
//        Boolean paymentIntent = stripeService.verifyPaymentById(paymentId);
//        return ResponseEntity.ok(paymentIntent);
//    }

    @PreAuthorize("hasAuthority('STUDENT') or hasAuthority('TEACHER') or hasAuthority('PARENT') or hasAuthority('ADMIN')")
    @PostMapping("/create-subscription")
    public ResponseEntity<ResponseData> createSubscription(@Valid @RequestBody StripeSubscriptionCreateDto stripeSubscriptionCreateDto) {
        ResponseData responseData = stripeService.createSubscription(stripeSubscriptionCreateDto);
        return ResponseEntity.ok(responseData);
    }

    @PreAuthorize("hasAuthority('STUDENT') or hasAuthority('TEACHER') or hasAuthority('PARENT') or hasAuthority('ADMIN')")
    @PostMapping("/cancel-subscription")
    public ResponseEntity<ResponseData> cancelSubscription(@Valid @RequestBody StripeSubscriptionCancelDto stripeSubscriptionCancelDto) {
        ResponseData responseData = stripeService.cancelSubscriptionByUserIdAndPaymentgatewayref(Common.getCurrentId(), stripeSubscriptionCancelDto.getPaymentgatewayref());
        return ResponseEntity.ok(responseData);
    }

    @PostMapping("/update-payment-method")
    public ResponseEntity<ResponseData> updatePaymentMethod(@Valid @RequestBody StripePaymentMethodUpdateDto stripePaymentMethodUpdateDto) {
        ResponseData responseData = stripeService.changeSubscriptionPaymentMethod(
                Common.getCurrentId(),
                stripePaymentMethodUpdateDto.getPaymentMethodId(),
                stripePaymentMethodUpdateDto.getCardName(),
                stripePaymentMethodUpdateDto.getCardEmail()
        );
        return ResponseEntity.ok(responseData);
    }


    @GetMapping("/invoices")
    public ResponseEntity<ResponseData> getInvoices(){
        System.out.println("into stripe controller");
        ResponseData responseData = stripeService.getStripeInvoices(Common.getCurrentId());
        return ResponseEntity.ok(responseData);
    }
}
