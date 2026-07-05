package com.tradelog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TradelogApplication {
    public static void main(String[] args) {
        SpringApplication.run(TradelogApplication.class, args);
    }
}
