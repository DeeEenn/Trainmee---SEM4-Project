package com.treninkovydenik.treninkovy_denik.service;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import com.treninkovydenik.treninkovy_denik.model.User;
import org.springframework.beans.factory.annotation.Autowired;
@Service
public class FileService {
    private static final Logger logger = LoggerFactory.getLogger(FileService.class);

    @Value("${file.upload-dir}")
    private String uploadDir;

    private final UserService userService;

    public FileService(UserService userService) {
        this.userService = userService;
    }

    public String uploadProfilePicture(MultipartFile file, String userEmail) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IOException("Invalid file type. Only images are allowed.");
        }

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
        String fileName = UUID.randomUUID().toString() + extension;

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        String fileUrl = "/uploads/" + fileName;
        User user = userService.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setProfilePictureUrl(fileUrl);
        userService.updateUserProfile(user);

        return fileUrl;   
    }
      
}
