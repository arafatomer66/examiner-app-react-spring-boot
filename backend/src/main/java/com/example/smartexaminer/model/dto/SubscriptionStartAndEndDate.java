package com.example.smartexaminer.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubscriptionStartAndEndDate {
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
