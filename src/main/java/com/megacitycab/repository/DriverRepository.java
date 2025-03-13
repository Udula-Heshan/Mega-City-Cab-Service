//DriverRepository
package com.megacitycab.repository;

import com.megacitycab.model.Driver;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface DriverRepository extends MongoRepository<Driver, String> {
    void deleteByLicenseNumber(String licenseNumber);
    boolean existsByLicenseNumber(String licenseNumber);
    Optional<Driver> findByLicenseNumber(String licenseNumber);
}
