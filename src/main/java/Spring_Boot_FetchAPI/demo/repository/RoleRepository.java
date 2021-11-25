package Spring_Boot_FetchAPI.demo.repository;

import Spring_Boot_FetchAPI.demo.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Role getRoleByRoleName(String roleName);
}