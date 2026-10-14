package com.skillswap.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url:}")
    private String rawUrl;

    @Value("${spring.datasource.username:}")
    private String rawUsername;

    @Value("${spring.datasource.password:}")
    private String rawPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String url = rawUrl;
        String username = rawUsername;
        String password = rawPassword;

        // Auto-convert Render / Heroku postgres:// or postgresql:// URLs to valid JDBC format
        if (StringUtils.hasText(url) && (url.startsWith("postgres://") || url.startsWith("postgresql://"))) {
            try {
                URI uri = new URI(url);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    if (!StringUtils.hasText(username)) {
                        username = parts[0];
                    }
                    if (!StringUtils.hasText(password)) {
                        password = parts[1];
                    }
                }
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();
                url = "jdbc:postgresql://" + host + ":" + port + path;
            } catch (Exception e) {
                if (url.startsWith("postgres://")) {
                    url = "jdbc:postgresql://" + url.substring("postgres://".length());
                } else if (url.startsWith("postgresql://")) {
                    url = "jdbc:postgresql://" + url.substring("postgresql://".length());
                }
            }
        }

        HikariDataSource dataSource = new HikariDataSource();
        if (StringUtils.hasText(url)) {
            dataSource.setJdbcUrl(url);
        }
        if (StringUtils.hasText(username)) {
            dataSource.setUsername(username);
        }
        if (StringUtils.hasText(password)) {
            dataSource.setPassword(password);
        }

        return dataSource;
    }
}
