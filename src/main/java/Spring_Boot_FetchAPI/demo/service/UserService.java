package Spring_Boot_FetchAPI.demo.service;

import Spring_Boot_FetchAPI.demo.model.Role;
import Spring_Boot_FetchAPI.demo.model.User;
import Spring_Boot_FetchAPI.demo.repository.RoleRepository;
import Spring_Boot_FetchAPI.demo.repository.UserRepository;
import Spring_Boot_FetchAPI.demo.security.PasswordConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordConfig passwordConfig;

    @Autowired
    public UserService(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordConfig passwordConfig) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordConfig = passwordConfig;
    }

    public void saveUser(User user) {
        Set<Role> roleSet = new HashSet<>();
        for (Role role : user.getRoles()) {
            roleSet.add(roleRepository.getRoleByRoleName(role.getRoleName()));
        }
        user.setRoles(roleSet);

        if (userRepository.getUserByUsername(user.getUsername()) == null) {
            user.setPassword(passwordConfig.getPasswordEncoder().encode(user.getPassword()));
            userRepository.save(user);
        }
    }

    public void updateUser(Long id, User user) {
        Set<Role> roleSet = new HashSet<>();
        if (user.getRoles() != null) {
            for (Role role : user.getRoles()) {
                roleSet.add(roleRepository.getRoleByRoleName(role.getRoleName()));
            }
        } else {
            for (Role existingRole : userRepository.getById(id).getRoles()) {
                roleSet.add(existingRole);
            }
        }
        user.setRoles(roleSet);

        String oldPassword = user.getPassword();
        try {
            if (user.getPassword().equals(oldPassword)) {
                user.setPassword(oldPassword);
            } else {
                passwordConfig.getPasswordEncoder().encode(user.getPassword());
            }
            userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            user.setPassword(oldPassword);
        }
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    public User findById(Long id) {
        return userRepository.getById(id);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.getUserByUsername(username);
    }
}