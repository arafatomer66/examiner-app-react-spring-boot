package com.example.smartexaminer.config;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.sendgrid.SendGrid;
import com.stripe.Stripe;
import com.stripe.net.RequestOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
public class BeanConfig {

    @Value( "${Stripe.apiKey}" )
    private String stripeApiKey;

//    @Value("${sendgrid.key}")
//    private String SG_API_KEY;

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
                .setConnectTimeout(Duration.ofSeconds(15))
                .setReadTimeout(Duration.ofSeconds(15))
                .build();
    }
//    public RestTemplate restTemplate() {
////        RestTemplate restTemplate = new RestTemplate();
////        restTemplate.he
////        RestTemplateBuilder builder = new RestTemplateBuilder();
////        return builder.setConnectTimeout(Duration.ofSeconds(15))
////                .setReadTimeout(Duration.ofSeconds(15))
////                .build();
//        return new RestTemplate();
//    }


    @Bean
    public ExecutorService executorService(){
        return  Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());
    }

//    @Bean
//    public JdbcTemplate jdbcTemplate() {
//        return new JdbcTemplate();
//    }


//    @Bean
//    public SendGrid sendGrid() {
//        return new SendGrid(SG_API_KEY);
//    }

    @Bean
    public ObjectMapper objectMapper(){
        return new ObjectMapper();
    }


    @Bean
    public RequestOptions requestOptions(){
        Stripe.apiKey = stripeApiKey;
        return RequestOptions.builder()
                .setApiKey(stripeApiKey)
                .build();
    }


}
