package com.example.smartexaminer.model.entity.stripe;

import lombok.Data;

public class ErrorMessage {
    public static final String SUBSCRIPTION_PLAN_NOT_FOUND = "Can't find any active subscription plan";
    public static String CREATE_USERS_SUBSCRIPTION = "Can't create the subscription in Nettverk, please contact support";
    public static String NOT_FOUND_USERS_SUBSCRIPTION = "No Subscriptions found";
}
