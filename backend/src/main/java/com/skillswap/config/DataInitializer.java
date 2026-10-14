package com.skillswap.config;

import com.skillswap.entity.Message;
import com.skillswap.entity.Session;
import com.skillswap.entity.Skill;
import com.skillswap.entity.SwapRequest;
import com.skillswap.entity.User;
import com.skillswap.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final SwapRequestRepository swapRequestRepository;
    private final SessionRepository sessionRepository;
    private final MessageRepository messageRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           SkillRepository skillRepository,
                           SwapRequestRepository swapRequestRepository,
                           SessionRepository sessionRepository,
                           MessageRepository messageRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.swapRequestRepository = swapRequestRepository;
        this.sessionRepository = sessionRepository;
        this.messageRepository = messageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Only seed if there are fewer than 3 community users
        if (userRepository.count() >= 3) {
            return;
        }

        // Demo User 1: Arjun Kumar
        User arjun = createUser("Arjun Kumar", "arjun@example.com", "password123",
                "I enjoy building modern web applications with React and helping beginners understand frontend development.",
                "Bengaluru, India");

        // Demo User 2: Priya Sharma
        User priya = createUser("Priya Sharma", "priya@example.com", "password123",
                "I create digital designs, posters and social media graphics and enjoy sharing my design knowledge.",
                "Mumbai, India");

        // Demo User 3: Rahul Verma
        User rahul = createUser("Rahul Verma", "rahul@example.com", "password123",
                "I work with Python and enjoy teaching programming concepts through simple practical examples.",
                "Delhi, India");

        // Demo User 4: Sneha Reddy
        User sneha = createUser("Sneha Reddy", "sneha@example.com", "password123",
                "I enjoy photography and would love to exchange photography knowledge with creative peers.",
                "Hyderabad, India");

        // Demo User 5: Kiran Patel
        User kiran = createUser("Kiran Patel", "kiran@example.com", "password123",
                "I design user-friendly interfaces, design systems, and wireframes for mobile and web.",
                "Pune, India");

        // Demo User 6: Ananya Rao
        User ananya = createUser("Ananya Rao", "ananya@example.com", "password123",
                "I am passionate about digital marketing, content strategy and online brand growth.",
                "Chennai, India");

        // Skills for Arjun
        createSkill("React Development", "Technology", "Intermediate", "TEACH", arjun);
        createSkill("JavaScript Essentials", "Technology", "Advanced", "TEACH", arjun);
        createSkill("UI/UX Design", "Design", "Beginner", "LEARN", arjun);

        // Skills for Priya
        createSkill("Graphic Design", "Design", "Advanced", "TEACH", priya);
        createSkill("Figma Prototyping", "Design", "Intermediate", "TEACH", priya);
        createSkill("Photography", "Creative", "Beginner", "LEARN", priya);

        // Skills for Rahul
        createSkill("Python Programming", "Technology", "Intermediate", "TEACH", rahul);
        createSkill("Data Analysis with Pandas", "Technology", "Intermediate", "TEACH", rahul);
        createSkill("Web Development", "Technology", "Beginner", "LEARN", rahul);

        // Skills for Sneha
        createSkill("Portrait Photography", "Creative", "Advanced", "TEACH", sneha);
        createSkill("Lightroom Editing", "Creative", "Intermediate", "TEACH", sneha);
        createSkill("Video Editing", "Creative", "Beginner", "LEARN", sneha);

        // Skills for Kiran
        createSkill("UI/UX Design", "Design", "Advanced", "TEACH", kiran);
        createSkill("Mobile App Wireframing", "Design", "Intermediate", "TEACH", kiran);
        createSkill("React Native", "Technology", "Beginner", "LEARN", kiran);

        // Skills for Ananya
        createSkill("Digital Marketing", "Business", "Intermediate", "TEACH", ananya);
        createSkill("SEO & Content Strategy", "Business", "Advanced", "TEACH", ananya);
        createSkill("Python for Marketers", "Technology", "Beginner", "LEARN", ananya);

        // Sample Swap Requests
        SwapRequest req1 = new SwapRequest(arjun, rahul, "Python Programming", "Hi Rahul! I can help you with React if you can teach me Python basics.");
        swapRequestRepository.save(req1);

        SwapRequest req2 = new SwapRequest(priya, sneha, "Portrait Photography", "Hi Sneha! Loved your photos. Would love to trade graphic design tips for camera lessons.");
        swapRequestRepository.save(req2);

        // Sample Sessions
        Session ses1 = new Session("React Basics Mentorship", arjun, "Rahul Verma", "rahul@example.com",
                "October 18, 2026", "10:00 AM", "Teaching", "https://meet.google.com/skp-tech-demo");
        sessionRepository.save(ses1);

        Session ses2 = new Session("UI/UX Design Review", priya, "Arjun Kumar", "arjun@example.com",
                "October 20, 2026", "05:30 PM", "Teaching", "https://meet.google.com/skp-design-demo");
        sessionRepository.save(ses2);

        // Sample Messages
        Message msg1 = new Message(arjun, rahul, "Hey Rahul, are you available for our React session this Saturday?");
        messageRepository.save(msg1);

        Message msg2 = new Message(rahul, arjun, "Yes, absolutely! Looking forward to it.");
        messageRepository.save(msg2);

        System.out.println(">>> SkillSwap Data Initializer: Sample community data loaded successfully!");
    }

    private User createUser(String name, String email, String password, String bio, String location) {
        if (userRepository.existsByEmail(email)) {
            return userRepository.findByEmail(email).get();
        }
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setBio(bio);
        user.setLocation(location);
        user.setCreatedAt(LocalDateTime.now().minusDays(5));
        return userRepository.save(user);
    }

    private void createSkill(String name, String category, String level, String type, User user) {
        Skill skill = new Skill(name, category, level, type, user);
        skillRepository.save(skill);
    }
}
