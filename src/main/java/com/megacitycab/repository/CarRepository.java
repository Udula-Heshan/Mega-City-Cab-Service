//CarRepository
package com.megacitycab.repository;

import com.megacitycab.model.Car;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CarRepository extends MongoRepository<Car, String> {
    Optional<Car> findByLicensePlate(String licensePlate); // Add this
    boolean existsByLicensePlate(String licensePlate);
    void deleteByLicensePlate(String licensePlate);
}

