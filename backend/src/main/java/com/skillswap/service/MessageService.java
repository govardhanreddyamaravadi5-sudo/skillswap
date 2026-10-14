package com.skillswap.service;

import com.skillswap.dto.MessageDto;
import com.skillswap.entity.Message;
import com.skillswap.entity.User;
import com.skillswap.repository.MessageRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public List<MessageDto> getChatHistory(Long user1, Long user2) {
        return messageRepository.findChatHistory(user1, user2)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public MessageDto sendMessage(MessageDto dto) {
        User sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("Sender not found with id: " + dto.getSenderId()));

        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found with id: " + dto.getReceiverId()));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(dto.getContent().trim());
        message.setCreatedAt(LocalDateTime.now());
        message.setRead(false);

        Message saved = messageRepository.save(message);
        return mapToDto(saved);
    }

    private MessageDto mapToDto(Message msg) {
        MessageDto dto = new MessageDto();
        dto.setId(msg.getId());
        dto.setSenderId(msg.getSender().getId());
        dto.setSenderName(msg.getSender().getName());
        dto.setReceiverId(msg.getReceiver().getId());
        dto.setReceiverName(msg.getReceiver().getName());
        dto.setContent(msg.getContent());
        dto.setCreatedAt(msg.getCreatedAt());
        dto.setRead(msg.isRead());

        if (msg.getCreatedAt() != null) {
            dto.setTime(msg.getCreatedAt().format(DateTimeFormatter.ofPattern("hh:mm a")));
        } else {
            dto.setTime("Now");
        }
        return dto;
    }
}
