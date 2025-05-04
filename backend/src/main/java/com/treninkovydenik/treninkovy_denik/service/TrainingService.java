package com.treninkovydenik.treninkovy_denik.service;

import com.treninkovydenik.treninkovy_denik.dto.TrainingDTO;
import com.treninkovydenik.treninkovy_denik.model.Training;
import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.repository.TrainingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class TrainingService {
    private final TrainingRepository trainingRepository;

    public TrainingService(TrainingRepository trainingRepository) {
        this.trainingRepository = trainingRepository;
    }

    @Transactional
    public Training createTraining(TrainingDTO trainingDTO, User user) {
        Training training = new Training();
        training.setName(trainingDTO.getName());
        training.setDate(trainingDTO.getDate());
        training.setDescription(trainingDTO.getDescription());
        training.setUser(user);
        return trainingRepository.save(training);
    }

    public List<Training> getUserTrainings(User user) {
        return trainingRepository.findByUserId(user.getId()); // Změna zde
    }

    @Transactional
    public Training updateTraining(Long id, TrainingDTO trainingDTO, User user) {
        Training training = trainingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Training not found"));
        
        if (!training.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        training.setName(trainingDTO.getName());
        training.setDate(trainingDTO.getDate());
        training.setDescription(trainingDTO.getDescription());
        return trainingRepository.save(training);
    }

    @Transactional
    public void deleteTraining(Long id, User user) {
        if (!trainingRepository.existsByIdAndUser(id, user)) {
            throw new RuntimeException("Training not found or unauthorized");
        }
        trainingRepository.deleteById(id);
    }

    public Training getTrainingById(Long id, User user) {
        return trainingRepository.findById(id)
            .filter(training -> training.getUser().getId().equals(user.getId()))
            .orElseThrow(() -> new RuntimeException("Training not found or unauthorized"));
    }
}