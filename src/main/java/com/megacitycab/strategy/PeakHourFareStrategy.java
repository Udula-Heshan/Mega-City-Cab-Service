//PeakHourFareStrategy
package com.megacitycab.strategy;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
@Qualifier("peakHourStrategy")
public class PeakHourFareStrategy implements FareStrategy {
    @Override
    public double calculateFare(double baseFare, double distance) {
        return (baseFare * 1.25) * distance; // 25% surge
    }
}
