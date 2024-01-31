package com.example.smartexaminer.model.entity;

import com.example.smartexaminer.model.entity.stripe.StripeMetadata;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
@JsonInclude(JsonInclude.Include.NON_NULL)
@Table(name = "tblsubscriptions")
@Entity
public class SubscriptionUserData {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id")
    private Integer id;

    @Column(name = "userid")
    private Integer userId;

    @Column(name = "subscription_plan_id")
    private Integer subscriptionPlanId;

    @Column(name = "paymentgatewayref")
    private String paymentgatewayref = "stripe";

    @Column(name = "active")
    private Boolean active = false;

    @Column(name = "subscription_start_date")
    private Date subscriptionStartDate;

    @Column(name = "subscription_end_date")
    private Date subscriptionEndDate;

    @Column(name = "created_date")
    private Date createdDate;

    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb", name = "metadata")
    private List<StripeMetadata> metadata;


}