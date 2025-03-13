//CustomerController
package com.megacitycab.controller;

import com.megacitycab.model.Customer;
import com.megacitycab.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerService.createCustomer(customer);
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{nic}")
    public Customer getCustomerByNic(@PathVariable String nic) {
        return customerService.getCustomerByNic(nic);
    }

    @DeleteMapping("/{nic}")
    public void deleteCustomerByNic(@PathVariable String nic) {
        customerService.deleteCustomerByNic(nic);
    }
}