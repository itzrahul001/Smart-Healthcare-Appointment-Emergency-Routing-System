package com.smarthealthcare.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HospitalDto {
    private Long id;
    private String name;
    private String location;
    private Double latitude;
    private Double longitude;
    private int totalBeds;
    private int availableBeds;
}
