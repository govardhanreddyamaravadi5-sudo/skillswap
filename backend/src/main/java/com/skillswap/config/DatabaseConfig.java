package com.skillswap.config;

import com.zaxxer.hikari.HikariDataSource;
import jakarta.annotation.PostConstruct;
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

    private String getNormalizedUrl() {
        String url = rawUrl;
        if (StringUtils.hasText(url) && (url.startsWith("postgres://") || url.startsWith("postgresql://"))) {
            try {
                URI uri = new URI(url);
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
        return url;
    }

    @PostConstruct
    public void initDialect() {
        String url = getNormalizedUrl();
        if (StringUtils.hasText(url)) {
            System.setProperty("jakarta.persistence.jdbc.url", url);
            if (url.contains("postgresql") || url.contains("postgres")) {
                System.setProperty("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
            } else if (url.contains("mysql")) {
                System.setProperty("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
            }
        }
    }

    @Bean
    @Primary
    public DataSource dataSource() {
        String url = getNormalizedUrl();
        String username = rawUsername;
        String password = rawPassword;

        if (StringUtils.hasText(rawUrl) && (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://"))) {
            try {
                URI uri = new URI(rawUrl);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    password = parts[1];
                }
            } catch (Exception ignored) {}
        }

        HikariDataSource dataSource = new HikariDataSource();
        if (StringUtils.hasText(url)) {
            dataSource.setJdbcUrl(url);
            if (url.contains("postgresql") || url.contains("postgres")) {
                dataSource.setDriverClassName("org.postgresql.Driver");
            } else if (url.contains("mysql")) {
                dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
            }
        }
        if (StringUtils.hasText(username)) {
            dataSource.setUsername(username);
        }
        if (StringUtils.hasText(password)) {
            dataSource.setPassword(password);
        }

        dataSource.setConnectionTimeout(30000);
        dataSource.setValidationTimeout(5000);
        dataSource.setMaximumPoolSize(5);
        dataSource.setMinimumIdle(1);

        return dataSource;
    }
}
