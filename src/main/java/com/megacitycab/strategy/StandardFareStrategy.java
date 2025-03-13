//StandardFareStrategy
package com.megacitycab.strategy;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Qualifier("standardStrategy")
@Primary
public class StandardFareStrategy implements FareStrategy {
    @Override
    public double calculateFare(double baseFare, double distance) {
        return baseFare * distance;
    }
}
