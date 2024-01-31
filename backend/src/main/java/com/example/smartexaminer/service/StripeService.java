package com.example.smartexaminer.service;


import com.example.smartexaminer.dao.UserDao;
import com.example.smartexaminer.model.dto.ResponseData;
import com.example.smartexaminer.model.entity.SubscriptionPlans;
import com.example.smartexaminer.model.entity.SubscriptionUserData;
import com.example.smartexaminer.model.entity.User;
import com.example.smartexaminer.model.entity.stripe.ErrorMessage;
import com.example.smartexaminer.model.entity.stripe.StripeSubscriptionCreateDto;
import com.example.smartexaminer.utils.Common;
import com.example.smartexaminer.utils.Constants;
import com.example.smartexaminer.utils.StripeConstants;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.SubscriptionSearchParams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Slf4j
public class StripeService {

    @Value("${Stripe.taxId}")
    private String defaultTaxId;

    @Autowired
    private SubscriptionUserDataService usersSubscriptionService;

    @Autowired
    private SubscriptionPlansService subscriptionService;

    @Autowired
    private HttpServletRequest httpServletRequest;

    @Autowired
    private UserDao userDao;

    public Boolean verifyPaymentById(String paymentId) {
        boolean paymentSuccess;
        try {
            PaymentIntent paymentIntent =
                    PaymentIntent.retrieve(paymentId);
            log.info("payment_id: " + paymentId + "; paymentIntent : " + paymentIntent);
            paymentSuccess = paymentIntent.getStatus().equals(StripeConstants.PAYMENT_SUCCEEDED);
            return paymentSuccess;
        } catch (StripeException e) {
            this.logErrorWithMethod("verifyPaymentById", e.getMessage());
            throw new RuntimeException(e.getUserMessage());
        }

    }

    public void updatePaymentMethod(String paymentMethodId, String customerId) {
        try {
            PaymentMethod paymentMethod;
            paymentMethod = PaymentMethod.retrieve(paymentMethodId);

            Map<String, Object> params = new HashMap<>();
            params.put("customer", customerId);

            PaymentMethod paymentMethod1 = paymentMethod.attach(params);
            log.info("(updatePaymentMethod) : " + paymentMethod1);

        } catch (StripeException e) {
            this.logErrorWithMethod("updatePaymentMethod", e.getMessage());
            throw new RuntimeException(e.getUserMessage());
        }
    }

    public Customer createCustomer(String email, String fullName, String paymentMethodId) {
//        Map<String, Object> params = new HashMap<>();
//        params.put("email", email);
//        params.put("name", fullName);
        String ip = httpServletRequest.getRemoteAddr();
        System.out.println("ip = " + ip);
        CustomerCreateParams params =
                CustomerCreateParams
                        .builder()
                        .setName(fullName)
                        .setDescription("email: "+ email + ", ip: " + ip)
                        .setEmail(email)
                        .setPaymentMethod(paymentMethodId)
//                        .setTax(CustomerCreateParams.Tax.builder().setIpAddress("103.112.170.27").build())
//                        .addExpand("tax")
                        .build();
        try {
            return Customer.create(params);
        } catch (StripeException e) {
            this.logErrorWithMethod("createCustomer", e.getMessage());
            throw new RuntimeException(e.getUserMessage());
        }
    }

    public ResponseData createSubscription(StripeSubscriptionCreateDto stripeSubscriptionCreateDto) {
        try {
            System.out.printf("\n%s\n", "hit");
            System.out.printf("\n%s\n", "hit");

            // 1. collect userId and email from authorization
            String userEmail = Common.getCurrentEmail();
            User user = userDao.findByEmail(userEmail).orElseThrow(()->
                    new RuntimeException("Not found user|User not found by email = "+ userEmail));
            Integer userId = user.getId();
            String fullName = user.getFirstName() + " " + user.getLastName();
            boolean isToCreateUsersSubscription = true;
            System.out.printf("\nuser=%s\n", user);
            // 2. get nettverk subscription plan by priceId
            SubscriptionPlans subscriptionPlan =
                    subscriptionService.fetchSubscriptionByPlanId(stripeSubscriptionCreateDto.getPriceId());
            System.out.printf("\nsubscriptionPlan=%s\n", subscriptionPlan);

            // 3. return if no tblsubscription exists against the priceId(subplanid)
            if (subscriptionPlan == null) {
                return ResponseData.builder()
                        .setCode(1)
                        .setData(null)
                        .setMessage(ErrorMessage.SUBSCRIPTION_PLAN_NOT_FOUND)
                        .build();
            }

            // 4. check latest UsersSubscription against userId(1)
            SubscriptionUserData latestUsersSubscription = usersSubscriptionService.findLatestActiveUsersSubscriptionByUserId(userId);
            System.out.printf("\nlatest=%s\n", subscriptionPlan);

            // 5. delete stripe subscription by paymentgatewayref(4)
            // 6. Inactivate the recent active subscription against the userId(1,4)
            Subscription deletedSubscription = null;
            String customerId = null;
            if (latestUsersSubscription == null) { // create new record
                // 7. create customer(1)
                Customer customer = this.createCustomer(userEmail, fullName, stripeSubscriptionCreateDto.getPaymentMethodId());
                System.out.println("customer = " + customer);
                customerId = customer.getId();
                System.out.printf("\ncustomerId=%s\n", customerId);

                // 8. update paymentMethod with customer for future transaction(0,7)
                this.updatePaymentMethod(
                        stripeSubscriptionCreateDto.getPaymentMethodId(),
                        customer.getId()
                );

            } else{ // has previous stripe subscription

                if (latestUsersSubscription.getPaymentgatewayref() == null) { // custom plan
                    // 7. create customer(1)
                    Customer customer = this.createCustomer(userEmail, fullName, stripeSubscriptionCreateDto.getPaymentMethodId());
                    customerId = customer.getId();

                    // 8. update paymentMethod with customer for future transaction(0,7)
                    this.updatePaymentMethod(
                            stripeSubscriptionCreateDto.getPaymentMethodId(),
                            customer.getId()
                    );
                    // will update the same usersSubscription instance in future
                    isToCreateUsersSubscription = false;

                } else { // trial + active plans + had usersSubscription in past
                    if(latestUsersSubscription.getActive().equals(Constants.USERS_SUBSCRIPTION_ACTIVE_CODE)){ // upgrading plan
                        deletedSubscription = this.cancelStripeSubscriptionByUserIdAndPaymentgatewayref(userId, latestUsersSubscription.getPaymentgatewayref());
                    } else{ // once canceled and start fresh subscription
                        deletedSubscription = this.activateCanceledUsersSubscription(Integer.valueOf(userId), latestUsersSubscription.getPaymentgatewayref());
                    }

                    if (deletedSubscription != null) { // stripe subscription deleted and usersSubscription table updated and made inactive
                        customerId = deletedSubscription.getCustomer();
                        this.updatePaymentMethod(
                                stripeSubscriptionCreateDto.getPaymentMethodId(),
                                customerId
                        );
                    }else{
                        return ResponseData.builder().setCode(1).setData(null).setMessage(StripeConstants.SUBSCRIPTION_CANCELED_FAILED_MESSAGE).build();
                    }
                }
            }


            // 9. process subscription parameters(0,7)
            Map<String, Object> item1 = new HashMap<>();
            item1.put("price", stripeSubscriptionCreateDto.getPriceId());

//            Map<String, Boolean> taxMap = new HashMap<>();
//            taxMap.put("enabled", true);

            List<Object> items = new ArrayList<>();
            items.add(item1);

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("userId", userId);
            metadata.put("cardName", stripeSubscriptionCreateDto.getCardName());
            metadata.put("cardEmail", stripeSubscriptionCreateDto.getCardEmail());

//            List<String> deafultTaxRates = new ArrayList<>(List.of(this.defaultTaxId));

            Map<String, Object> params = new HashMap<>();
            params.put("customer", customerId);
            params.put("items", items);
            params.put("metadata", metadata);
            params.put("default_payment_method", stripeSubscriptionCreateDto.getPaymentMethodId());
            params.put("trial_from_plan", true);
//            params.put("default_tax_rates", deafultTaxRates);
            System.out.println("params = " + params);

            log.info("(createSubscription) SUBSCRIPTION PARAMS >>> " + params);

            // 10. create subscription in stripe(9)
            Subscription stripeSubscription =
                    Subscription.create(params);

            System.out.println("stripeSubscription = " + stripeSubscription);

            // 11. stripe subscription active or not(10)
            boolean stripeSubscriptionStatusActive = false;
            if (stripeSubscription.getStatus().equals(StripeConstants.SUBSCRIPTION_ACTIVE_STATUS) || stripeSubscription.getStatus().equals(StripeConstants.SUBSCRIPTION_TRIAL_STATUS)) {
                stripeSubscriptionStatusActive = true;
            }

            // 12. create a UsersSubscription record against the userId, subscriptionId and stripeSubscriptionId(1,4,10)
            SubscriptionUserData newUsersSubscription = null;
            Date newDate = new Date();
            Date nextMonth = new Date();
            nextMonth.setMonth(newDate.getMonth()+1);
            if(isToCreateUsersSubscription){
                newUsersSubscription =
                        usersSubscriptionService.createUsersSubscription(
                                subscriptionPlan.getId(),
                                stripeSubscription.getId(),
                                newDate,
                                nextMonth,
                                stripeSubscriptionStatusActive
                        );
            }else{
                newUsersSubscription = usersSubscriptionService.activateByPaymentgatewayref(
                        latestUsersSubscription,
                        stripeSubscription.getId(),
                        newDate
                );
            }

            return ResponseData.builder().setData(newUsersSubscription).setCode(0).build();
        } catch (StripeException e) {
            this.logErrorWithMethod("createSubscription", e.getMessage());
            throw new RuntimeException(e.getUserMessage());
        }
    }

    public Subscription activateCanceledUsersSubscription(Integer userId, String paymentgatewayref){
        SubscriptionSearchParams params =
                SubscriptionSearchParams
                        .builder()
                        .setQuery("status:'canceled' AND metadata['userId']:'"+userId.toString()+"'")
                        .setLimit(100L)
                        .build();

        SubscriptionSearchResult result = null;
        try {
            result = Subscription.search(params);
        } catch (StripeException e) {
            throw new RuntimeException(e);
        }

        return result.getData().stream().filter(r -> r.getId().equals(paymentgatewayref)).findFirst().orElse(null);
    }

    public Subscription cancelStripeSubscriptionByUserIdAndPaymentgatewayref(Integer userId, String paymentgatewayref) {
        try {
            // 1. retrieve subscription by stripe subscriptionId=paymentgatewayref(0)
            Subscription subscription = Subscription.retrieve(
                    paymentgatewayref
            );

            // 2. cancel the stripe subscription(1)
            Subscription deletedSubscription =
                    subscription.cancel();

            // 3. inactivate the usersSubscription by paymentgatewayref if deleted Subscription status is canceled(2)
            if (deletedSubscription.getStatus().equals(StripeConstants.SUBSCRIPTION_CANCELED_STATUS)) {
                SubscriptionUserData usersSubscription = usersSubscriptionService.disableSubscriptionByUserIdAndPaymentgatewayref(
                        userId,
                        subscription.getId()
                );
                return deletedSubscription;
            } else {
                return null;
            }
        } catch (StripeException e) {
            this.logErrorWithMethod("cancelSubscriptionByUserIdAndPaymentgatewayref", e.getMessage());
            throw new RuntimeException(StripeConstants.SUBSCRIPTION_CANCELED_FAILED_MESSAGE);
        } catch (Exception e) {
            this.logErrorWithMethod("cancelSubscriptionByUserIdAndPaymentgatewayref", "(Exception): " + e.getMessage());
            throw new RuntimeException(StripeConstants.SUBSCRIPTION_CANCELED_FAILED_MESSAGE);
        }
    }
    public ResponseData cancelSubscriptionByUserIdAndPaymentgatewayref(Integer userId, String paymentgatewayref) {
        try {
            // 1. retrieve subscription by stripe subscriptionId=paymentgatewayref(0)
            Subscription subscription = Subscription.retrieve(
                    paymentgatewayref
            );

            // 2. cancel the stripe subscription(1)
            Subscription deletedSubscription = subscription.cancel();
            System.out.println("Deleted");

            System.out.println(deletedSubscription);
            // 3. inactivate the usersSubscription by paymentgatewayref if deleted Subscription status is canceled(2)
            if (deletedSubscription.getStatus().equals(StripeConstants.SUBSCRIPTION_CANCELED_STATUS)) {
                SubscriptionUserData usersSubscription = usersSubscriptionService.disableSubscriptionByUserIdAndPaymentgatewayref(
                        userId,
                        subscription.getId()
                );
                return ResponseData.builder().setCode(0).setData(usersSubscription).setMessage(StripeConstants.SUBSCRIPTION_CANCELED_MESSAGE).build();
            } else {
                return ResponseData.builder().setCode(1).setData(null).setMessage(StripeConstants.SUBSCRIPTION_CANCELED_FAILED_MESSAGE).build();
            }
        } catch (StripeException e) {
            this.logErrorWithMethod("cancelSubscriptionByUserIdAndPaymentgatewayref", e.getMessage());
            throw new RuntimeException(StripeConstants.SUBSCRIPTION_CANCELED_FAILED_MESSAGE);
        } catch (Exception e) {
            this.logErrorWithMethod("cancelSubscriptionByUserIdAndPaymentgatewayref", "(Exception): " + e.getMessage());
            throw new RuntimeException(StripeConstants.SUBSCRIPTION_CANCELED_FAILED_MESSAGE);
        }
    }

    public SubscriptionItem deleteSubscriptionItem(String subscriptionItemId) {
        SubscriptionItem subscriptionItem;
        try {
            subscriptionItem =
                    SubscriptionItem.retrieve(subscriptionItemId);

            SubscriptionItem deletedSubscriptionItem =
                    subscriptionItem.delete();

            return deletedSubscriptionItem;
        } catch (StripeException e) {
            String method = getClass().getEnclosingMethod().getName();
            this.logErrorWithMethod("deleteSubscriptionItem", e.getMessage());
            throw new RuntimeException(e.getUserMessage());
        }
    }

    public SubscriptionItem createSubscriptionItem(String subscriptionId, String priceId, Integer quantity) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put(
                    "subscription",
                    subscriptionId
            );
            params.put(
                    "price",
                    priceId
            );
            params.put("quantity", quantity);

            SubscriptionItem subscriptionItem =
                    SubscriptionItem.create(params);

            return subscriptionItem;
        } catch (StripeException e) {
            this.logErrorWithMethod("createSubscriptionItem", e.getMessage());
            throw new RuntimeException(e.getUserMessage());
        }
    }

    public ResponseData changeSubscriptionPaymentMethod(Integer userId, String paymentMethodId, String cardName, String cardEmail) {
        try{
            // 1. get active subscription from usersSubscription by userId
            SubscriptionUserData usersSubscription = usersSubscriptionService.getActiveUsersSubscriptionByUserId(userId);

            // 2. get paymentgatewayref(stripe subscription id)
            String stripeSubscriptionId = usersSubscription.getPaymentgatewayref();

            // 3. fetch stripe subscription by paymentgatewayref
            Subscription subscription = Subscription.retrieve(
                    stripeSubscriptionId
            );

            // 4. get customerId from 3
            String customerId = subscription.getCustomer();

            // 5. attach paymentMethod to the customer
            this.updatePaymentMethod(paymentMethodId, customerId);

            // 6. update default_payment_method of subscription 3
            Map<String, Object> metadata = new HashMap<>();
            if(!cardName.isBlank()){
                metadata.put("cardName", cardName);
            }
            if(!cardEmail.isBlank()){
                metadata.put("cardEmail", cardEmail);
            }

            Map<String, Object> params = new HashMap<>();
            params.put("default_payment_method", paymentMethodId);
            if(!cardName.isBlank() || !cardEmail.isBlank()){
                params.put("metadata", metadata);
            }

            Subscription updatedSubscription =
                    subscription.update(params);

            System.out.println("updatedSubscription = " + updatedSubscription);

            return ResponseData.builder()
                    .setCode(0)
                    .setData(usersSubscription)
                    .setMessage("Payment method updated successfully").build();

        } catch (StripeException e) {
            this.logErrorWithMethod("changeSubscriptionPaymentMethod", e.getMessage());
            throw new RuntimeException(e);
        } catch (Exception e){
            this.logErrorWithMethod("changeSubscriptionPaymentMethod ", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public void logErrorWithMethod(String method, String message) {
        log.error("(" + method + ") " + message);
    }

    public String formatDate(Integer IntegerDate) {
        Date date = new Date(IntegerDate);
        Format format = new SimpleDateFormat(Common.DATEFORMAT2);
        System.out.println("format.format(date).toString() = " + format.format(date).toString());
        return format.format(date).toString();
    }

    public ResponseData getStripeInvoices(Integer userId) {
        try {
            SubscriptionUserData usersSubscription = usersSubscriptionService.findLatestActiveUsersSubscriptionByUserId(userId);

            if(usersSubscription == null ){
                return ResponseData.builder().setCode(1).setData(null).setMessage("No subscriptions found").build();
            }

            Subscription subscription = Subscription.retrieve(usersSubscription.getPaymentgatewayref());

            Map<String, Object> params = new HashMap<>();
            params.put("customer", subscription.getCustomer());

            InvoiceCollection invoices = Invoice.list(params);
            System.out.println("invoices = " + invoices);

            List<org.nettverk.backend.stripe.dto.StripeInvoiceDto> stripeInvoiceDtos = new ArrayList<>();
            invoices.getData().forEach((invoice)->{
                org.nettverk.backend.stripe.dto.StripeInvoiceDto invoiceDto
                        = org.nettverk.backend.stripe.dto.StripeInvoiceDto.builder()
                        .setId(invoice.getId())
                        .setCustomerName(invoice.getCustomerName())
                        .setCustomerEmail(invoice.getCustomerEmail())
                        .setAmountPaid(invoice.getAmountPaid()/100)
                        .setStatus(invoice.getStatus())
                        .setAmountRemaining(invoice.getAmountRemaining()/100)
                        .setHostedInvoiceUrl(invoice.getHostedInvoiceUrl())
                        .setInvoicePdf(invoice.getInvoicePdf())
                        .setCreated(invoice.getCreated())
                        .setDueDate(invoice.getDueDate()).build();
                stripeInvoiceDtos.add(invoiceDto);
            });

            return ResponseData.builder().setCode(0).setData(stripeInvoiceDtos).build();
        } catch (StripeException e) {
            throw new RuntimeException(e.getUserMessage());
        }
        catch (Exception e){
            System.out.println("Stripe service error for invoice = " + e);
            throw new RuntimeException(e.getMessage());
        }
    }
}
