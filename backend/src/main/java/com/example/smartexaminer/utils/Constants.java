package com.example.smartexaminer.utils;

import com.google.common.collect.ImmutableList;
import io.swagger.models.auth.In;

import java.util.ArrayList;
import java.util.List;


public class Constants {
    public static final ImmutableList<String> MCQ_KEY_OPTIONS =
            ImmutableList.of("A", "B", "C", "D", "E");
    public static final String INSTANCE_URL = "{instance_url}";
    public static final String PREV_START_TIME = "{prev_start_time}";
    public static final String START_TIME = "{start_time}";
    public static final String OBJECT_ID = "{id}";
    public static final String XERO_ID_CUSTOM = "Xero_Id__c";
    public static final String MODIFIED_SINCE_HEADER = "If-Modified-Since";


    //SFDC Events
    public static final String NEW_SFDC_RECORD_EVT = "NREC";
    public static final String NEW_SFDC_PRODUCT_EVT = "NSPE";



    //SFDC Actions
    public static final String UPDATE_RECORD_SFDC = "UREC";
    public static final String CREATE_RECORD_SFDC = "SFCSIN";
    public static final String CREATE_INVOICE_RECORD_SFDC = "SFINV";


    //Xero Events
    public static final String UPDATE_XERO_PAYMENT_STATUS_EVT = "UPST";
    public static final String NEW_XERO_RECORD_EVT = "XNREC";
    public static final String NEW_XERO_ITEM_EVT = "FITM";

    public static final String NEW_XERO_INVOICE_EVT = "XNINV";


    //Xero Actions
    public static final String CREATE_INVOICE_XERO = "CSIN";
    public static final String CREATE_CONTACT_XERO = "CCON";
    public static final String CREATE_ITEM_XERO = "CITM";
    public static final String CREATE_CREDITNOTES_XERO = "CCRNT";
    public static final Integer SUBSCRIPTION_PLAN_ACTIVE_CODE = 1;
    public static final Integer SUBSCRIPTION_PLAN_INACTIVE_CODE = 0;

    public static final boolean USERS_SUBSCRIPTION_ACTIVE_CODE = true;
    public static final boolean USERS_SUBSCRIPTION_INACTIVE_CODE = false;
    public static final String WORKFLOW_INACTIVE_CODE = "01";
}
