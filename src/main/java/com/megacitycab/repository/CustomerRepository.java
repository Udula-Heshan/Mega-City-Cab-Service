//CustomerRepository
package com.megacitycab.repository;

import com.megacitycab.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface CustomerRepository extends MongoRepository<Customer, String> {
    Optional<Customer> findByNic(String nic);
    boolean existsByNic(String nic);
    void deleteByNic(String nic);
}