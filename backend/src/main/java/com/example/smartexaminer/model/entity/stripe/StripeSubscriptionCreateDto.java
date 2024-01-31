package com.example.smartexaminer.model.entity.stripe;

import com.example.smartexaminer.utils.StripeConstants;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import javax.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder(setterPrefix = "set")

public class StripeSubscriptionCreateDto {

    @NotBlank(message = StripeConstants.PAYMENT_METHOD_ID_INVALID_MESSAGE)
    private String paymentMethodId;
    @NotBlank(message = StripeConstants.PRICE_ID_INVALID_MESSAGE)
    private String priceId;
    private String cardName;
    private String cardEmail;
}
