package Spring_Boot_FetchAPI.demo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordConfig {
    private final PasswordEncoder passwordEncoder
            = new BCryptPasswordEncoder(10);

    @Autowired
    public PasswordEncoder getPasswordEncoder() {
        return passwordEncoder;
    }
}