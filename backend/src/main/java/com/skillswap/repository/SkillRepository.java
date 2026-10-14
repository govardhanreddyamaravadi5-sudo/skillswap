package com.skillswap.repository;

import com.skillswap.entity.Skill;
import com.skillswap.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByUser(User user);
    List<Skill> findByUserId(Long userId);
    List<Skill> findByUserIdAndSkillType(Long userId, String skillType);
    List<Skill> findBySkillType(String skillType);

    @Query("SELECT s FROM Skill s WHERE s.skillType = 'TEACH' AND (:excludeUserId IS NULL OR s.user.id <> :excludeUserId)")
    List<Skill> findExploreSkills(@Param("excludeUserId") Long excludeUserId);
}
