package cn.dubby.bullet_screen.config;

import cn.dubby.bullet_screen.task.AutoPushMsgTask;
import jakarta.annotation.Resource;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

@Component
public class WebSocketEventListener {

    @Resource
    private AutoPushMsgTask autoPushMsgTask;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        autoPushMsgTask.pushMsg("Welcome");
    }

}
