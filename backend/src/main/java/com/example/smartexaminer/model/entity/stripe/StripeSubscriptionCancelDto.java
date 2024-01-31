package com.example.smartexaminer.model.entity.stripe;

import com.example.smartexaminer.utils.StripeConstants;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder(setterPrefix = "set")
public class StripeSubscriptionCancelDto {
    @NotBlank(message = StripeConstants.PAYMENT_GATEWAY_REF_INVALID_MESSAGE)
    private String paymentgatewayref;
}
