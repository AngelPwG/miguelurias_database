package com.muteam.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {
    private final Cloudinary cloudinary;

    private final java.util.Map<String, String> dotenvMap = new java.util.HashMap<>();

    public CloudinaryService() {
        loadDotEnv();

        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", getEnv("CLOUDINARY_CLOUD_NAME"),
                "api_key", getEnv("CLOUDINARY_API_KEY"),
                "api_secret", getEnv("CLOUDINARY_API_SECRET")));
    }

    private String getEnv(String key) {
        if (System.getenv(key) != null)
            return System.getenv(key);
        if (System.getProperty(key) != null)
            return System.getProperty(key);
        return dotenvMap.get(key);
    }

    private void loadDotEnv() {
        try {
            java.nio.file.Path path = java.nio.file.Paths.get(".env");
            if (java.nio.file.Files.exists(path)) {
                java.util.List<String> lines = java.nio.file.Files.readAllLines(path);
                for (String line : lines) {
                    if (line.trim().isEmpty() || line.startsWith("#"))
                        continue;
                    String[] parts = line.split("=", 2);
                    if (parts.length == 2) {
                        dotenvMap.put(parts[0].trim(), parts[1].trim());
                    }
                }
                System.out.println("DEBUG: Loaded .env file manually.");
            } else {
                // Try looking in parent directory? Or explicit backend path?
                java.nio.file.Path parentPath = java.nio.file.Paths.get("backend", ".env");
                if (java.nio.file.Files.exists(parentPath)) {
                    java.util.List<String> lines = java.nio.file.Files.readAllLines(parentPath);
                    for (String line : lines) {
                        if (line.trim().isEmpty() || line.startsWith("#"))
                            continue;
                        String[] parts = line.split("=", 2);
                        if (parts.length == 2) {
                            dotenvMap.put(parts[0].trim(), parts[1].trim());
                        }
                    }
                    System.out.println("DEBUG: Loaded backend/.env file manually.");
                }
            }
        } catch (IOException e) {
            System.err.println("WARNING: Could not read .env file: " + e.getMessage());
        }
    }

    public String subirArchivo(MultipartFile archivo) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                    archivo.getBytes(),
                    ObjectUtils.emptyMap());

            return uploadResult.get("secure_url").toString();

        } catch (IOException e) {
            throw new RuntimeException("Error al subir el archivo a Cloudinary");
        }
    }

}
