package cn.dubby.bullet_screen.task;

import cn.dubby.bullet_screen.config.WebSocketConfig;
import cn.dubby.bullet_screen.domain.BulletMsg;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class AutoPushMsgTask {

    private static final String DATE_FORMAT = "yyyy-MM-dd hh:mm:ss";

    @Resource
    private SimpMessagingTemplate simpMessagingTemplate;

    private static final ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(1);

    @PostConstruct
    public void init() {
        scheduledExecutorService.scheduleAtFixedRate(this::pushMsg, 0, 30, TimeUnit.SECONDS);
    }

    private void pushMsg() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(DATE_FORMAT);
        String time = simpleDateFormat.format(new Date());

        BulletMsg msg = new BulletMsg();
        msg.setAuthor(UUID.randomUUID().toString());
        msg.setTime(System.currentTimeMillis());
        msg.setContent("The current time is " + time);

        simpMessagingTemplate.convertAndSend(WebSocketConfig.TOPIC, msg);
    }

}
