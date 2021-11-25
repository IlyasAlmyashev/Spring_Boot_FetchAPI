package Spring_Boot_FetchAPI.demo;

import Spring_Boot_FetchAPI.demo.model.Role;
import Spring_Boot_FetchAPI.demo.model.User;
import Spring_Boot_FetchAPI.demo.service.RoleService;
import Spring_Boot_FetchAPI.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Set;

@Component
public class TestUsers {
    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public TestUsers(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostConstruct
    public void init() {
        Role role_admin = new Role("ROLE_ADMIN");
        Role role_user = new Role("ROLE_USER");
        roleService.saveRole(role_admin);
        roleService.saveRole(role_user);

        Set<Role> adminRolesSet = new HashSet<>();
        adminRolesSet.add(role_admin);
        adminRolesSet.add(role_user);
        User admin = new User("admin", "admin", adminRolesSet);
        userService.saveUser(admin);

        Set<Role> userRolesSet = new HashSet<>();
        userRolesSet.add(role_user);
        User user = new User("user", "user", userRolesSet);
        userService.saveUser(user);
    }
}