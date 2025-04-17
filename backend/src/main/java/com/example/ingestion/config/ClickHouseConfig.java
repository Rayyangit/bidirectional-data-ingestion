package com.example.ingestion.config;

import java.sql.SQLException;
import java.util.Properties;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import com.clickhouse.jdbc.ClickHouseDataSource;

@Configuration
public class ClickHouseConfig {

    @Value("${clickhouse.url}")
    private String url;

    @Value("${clickhouse.username}")
    private String username;

    @Value("${clickhouse.password}")
    private String password;

    @Value("${clickhouse.jwt-token:#{null}}")
    private String jwtToken;

    @Bean
    public DataSource clickHouseDataSource() throws SQLException {
        Properties properties = new Properties();
        properties.setProperty("user", username);
        
        if (password != null && !password.isEmpty()) {
            properties.setProperty("password", password);
        }
        
        if (jwtToken != null && !jwtToken.isEmpty()) {
            properties.setProperty("access_token", jwtToken);
            properties.setProperty("auth", "access_token");
        }
        
        properties.setProperty("socket_timeout", "30000");
        properties.setProperty("connection_timeout", "5000");
        properties.setProperty("compress", "0");
        return new ClickHouseDataSource(url, properties);
    }

    @Bean
    public JdbcTemplate clickHouseJdbcTemplate(DataSource clickHouseDataSource) {
        return new JdbcTemplate(clickHouseDataSource);
    }
}