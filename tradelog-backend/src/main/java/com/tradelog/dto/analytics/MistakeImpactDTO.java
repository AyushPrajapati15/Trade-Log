package com.tradelog.dto.analytics;
import lombok.*;
@Data @NoArgsConstructor @AllArgsConstructor
public class MistakeImpactDTO {
    private String mistake;
    private Integer count;
    private Double totalImpact;
}
