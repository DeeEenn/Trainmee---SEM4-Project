package com.treninkovydenik.treninkovy_denik;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TreninkovyDenikApplication {

	public static void main(String[] args) {
		SpringApplication.run(TreninkovyDenikApplication.class, args);
	}

}
