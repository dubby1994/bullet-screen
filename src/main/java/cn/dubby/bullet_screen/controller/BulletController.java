package cn.dubby.bullet_screen.controller;

import cn.dubby.bullet_screen.config.WebSocketConfig;
import cn.dubby.bullet_screen.domain.BulletMsg;
import cn.dubby.bullet_screen.request.SendBulletRequest;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import java.util.UUID;

@Controller
public class BulletController {

    @MessageMapping("/sendBullet")
    @SendTo(value = WebSocketConfig.TOPIC)
    public BulletMsg sendBullet(SendBulletRequest request) {
        String content = HtmlUtils.htmlEscape(request.getContent());

        BulletMsg msg = new BulletMsg();
        msg.setAuthor(UUID.randomUUID().toString());
        msg.setTime(System.currentTimeMillis());
        msg.setContent(content);
        return msg;
    }

}
