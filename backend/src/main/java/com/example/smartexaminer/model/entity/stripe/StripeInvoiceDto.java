package org.nettverk.backend.stripe.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder(setterPrefix = "set")
public class StripeInvoiceDto {
    private String id;
    private String customerName;
    private String customerEmail;
    private Long amountPaid;
    private Long amountRemaining;
    private String hostedInvoiceUrl;
    private String invoicePdf;
    private String status;
    private Long created;
    private Long dueDate;
}
