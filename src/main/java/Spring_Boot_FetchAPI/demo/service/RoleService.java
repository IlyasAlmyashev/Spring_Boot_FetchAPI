package Spring_Boot_FetchAPI.demo.service;

import Spring_Boot_FetchAPI.demo.model.Role;
import Spring_Boot_FetchAPI.demo.repository.RoleRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public void saveRole(Role role) {
        if (roleRepository.getRoleByRoleName(role.getRoleName()) == null) {
            roleRepository.save(role);
        }
    }

    public void updateRole(Role role) {
        roleRepository.save(role);
    }

    public void deleteById(Long id) {
        roleRepository.deleteById(id);
    }

    public Role findById(Long id) {
        return roleRepository.getById(id);
    }

    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    public Role getRoleByName(String roleName) {
        return roleRepository.getRoleByRoleName(roleName);
    }
}