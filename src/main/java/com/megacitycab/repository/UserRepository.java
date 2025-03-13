
//UserRepository
package com.megacitycab.repository;

import com.megacitycab.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    /**
     * Find a user by their username
     * @param username The unique username to search for
     * @return Optional containing the user if found
     */
    Optional<User> findByUsername(String username);
}
