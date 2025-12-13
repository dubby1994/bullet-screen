package cn.dubby.bullet_screen.controller;

import cn.dubby.bullet_screen.domain.BulletMsg;
import cn.dubby.bullet_screen.request.SendBulletRequest;
import cn.dubby.bullet_screen.task.AutoPushMsgTask;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

import java.util.UUID;

@RestController
@RequestMapping("/restful")
public class RestfulBulletController {

    @Resource
    private AutoPushMsgTask autoPushMsgTask;

    @RequestMapping("/sendBullet")
    public BulletMsg sendBullet(@RequestBody SendBulletRequest request) {
        String content = HtmlUtils.htmlEscape(request.getContent());

        autoPushMsgTask.pushMsg(content);

        BulletMsg msg = new BulletMsg();
        msg.setAuthor(UUID.randomUUID().toString());
        msg.setTime(System.currentTimeMillis());
        msg.setContent(content);
        return msg;
    }

}
