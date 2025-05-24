package com.treninkovydenik.treninkovy_denik.repository;

import com.treninkovydenik.treninkovy_denik.model.Message;
import com.treninkovydenik.treninkovy_denik.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderAndReceiver(User sender, User receiver);
    List<Message> findByReceiverAndReadFalse(User receiver);
    long countByReceiverAndReadFalse(User receiver);
    List<Message> findBySenderAndReceiverAndReadFalse(User sender, User receiver);
    
    @Query("SELECT DISTINCT m FROM Message m WHERE m.receiver = :trainer OR m.sender = :trainer ORDER BY m.createdAt DESC")
    List<Message> findDistinctConversationsByTrainer(User trainer);
} 