//CustomerService
package com.megacitycab.service;

import com.megacitycab.model.Customer;
import com.megacitycab.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    // Constructor injection instead of field injection
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerByNic(String nic) {
        return customerRepository.findByNic(nic)
                .orElseThrow(() -> new RuntimeException("Customer not found with NIC: " + nic));
    }

    public void deleteCustomerByNic(String nic) {
        if (!customerRepository.existsByNic(nic)) {
            throw new RuntimeException("Customer not found with NIC: " + nic);
        }
        customerRepository.deleteByNic(nic);
    }
}