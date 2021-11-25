package Spring_Boot_FetchAPI.demo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final UserDetailsService userDetailsService; // сервис, с помощью которого тащим пользователя
    private final AuthenticationSuccessHandler authenticationSuccessHandler; // класс, в котором описана логика перенаправления пользователей по ролям
    private final PasswordConfig passwordConfig;

    @Autowired
    public SecurityConfig(@Qualifier("userService") UserDetailsService userDetailsService,
                          @Qualifier("successUserHandler") AuthenticationSuccessHandler authenticationSuccessHandler,
                          PasswordConfig passwordConfig) {
        this.userDetailsService = userDetailsService;
        this.authenticationSuccessHandler = authenticationSuccessHandler;
        this.passwordConfig = passwordConfig;
    }

    @Autowired
    public void configureGlobalSecurity(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService)
                .passwordEncoder(passwordConfig.getPasswordEncoder()); // конфигурация для прохождения аутентификации
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
//                .antMatchers("/", "/login", "/logout").permitAll() // доступность всем
                .antMatchers("/user/**").access("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')") // разрешаем входить на /user пользователям с ролью User, Admin
                .antMatchers("/admin/**").access("hasAnyRole('ROLE_ADMIN')") // разрешает входить на /admin пользователю с ролью Admin
                .and().formLogin()  // Spring сам подставит свою логин форму
                .loginPage("/login")
//                .usernameParameter("username")
                .successHandler(authenticationSuccessHandler) // подключаем наш SuccessHandler для перенеправления по ролям
                .permitAll()
                .and().logout()
                .logoutUrl("/logout") //URL-адрес, запускающий выход из системы (по умолчанию "/ logout").
                .logoutSuccessUrl("/login") //URL-адрес для перенаправления после выхода из системы.
                .and().csrf().disable();//- Защита CSRF включена по умолчанию в конфигурации Java.
    }
}