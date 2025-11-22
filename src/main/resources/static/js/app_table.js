const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:9090/gs-guide-websocket',

    // 关键的重连配置
    // 设置重连延迟（单位：毫秒），0 表示不自动重连
    reconnectDelay: 1000,

    // 心跳设置，用于更快地检测到连接丢失
    // 客户端每 4000ms (4秒) 发送一次心跳
    heartbeatIncoming: 1000,
    // 服务器每 4000ms (4秒) 发送一次心跳
    heartbeatOutgoing: 1000
});

stompClient.onConnect = (frame) => {
    console.log('stompClient.onConnect: ' + frame);
    stompClient.subscribe('/topic/allBullet', (msg) => {
        showBullet(JSON.parse(msg.body).time, JSON.parse(msg.body).content);
    });
};

stompClient.onWebSocketError = (error) => {
    console.error('stompClient.onWebSocketError', error);
};

stompClient.onStompError = (frame) => {
    console.error('stompClient.onStompError: ' + frame.headers['message']);
    console.error('stompClient.onStompError: ' + frame.body);
};

function sendBullet() {
    stompClient.publish({
        destination: "/app/sendBullet",
        body: JSON.stringify({'content': $("#bulletInput").val()})
    });
}

function showBullet(time, message) {
    $("#bulletList").append("<tr><td>" + time + "</td><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    $("#send").click(() => sendBullet());

    //激活客户端
    stompClient.activate();

    const floatingBtn = document.getElementById('floating-btn');
    const chatModal = new bootstrap.Modal(document.getElementById('chatModal'));

    floatingBtn.addEventListener('click', () => {
        chatModal.show();
    });
});