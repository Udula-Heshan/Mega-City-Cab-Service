//MegacitycabApplication
package com.megacitycab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class MegacitycabApplication {

	public static void main(String[] args) {
		SpringApplication.run(MegacitycabApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				// Replace with:
				registry.addMapping("/**")
						.allowedOrigins("http://localhost:8080") // Explicit origin
						.allowedMethods("*")
						.allowedHeaders("*");
			}
		};
	}
}
