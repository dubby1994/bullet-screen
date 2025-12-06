// 获取当前页面的协议、域名和端口
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const domain = window.location.hostname;
const port = window.location.port ? `:${window.location.port}` : '';

// 构建 WebSocket URL
const wsUrl = `${protocol}//${domain}${port}/ws/all`;

const maxTracks = 100; // 弹幕轨道数量
const containerHeight = window.innerHeight;
const trackHeight = containerHeight / maxTracks;

const stompClient = new StompJs.Client({
    brokerURL: wsUrl,

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
        showBullet(JSON.parse(msg.body).content);
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

function showBullet(text) {
    const container = document.getElementById('barrage-container');

    const div = document.createElement('div');
    div.className = 'barrage';
    div.textContent = text;

    // 随机轨道
    const track = Math.floor(Math.random() * maxTracks);
    div.style.top = `${track * trackHeight + 5}px`;

    // 随机速度
    // const duration = Math.random() * 5 + 5; // 5~10秒
    // 10秒
    const duration = 20;
    div.style.animationDuration = `${duration}s`;

    // 随机颜色
    div.style.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    // 白色
    // div.style.color = `#ffffff`;

    container.appendChild(div);

    // 动画结束后移除
    div.addEventListener('animationend', () => {
        container.removeChild(div);
    });
}

$(function () {
    stompClient.activate();

    const container = document.getElementById('barrage-container');
    const input = document.getElementById('bulletInput');
    const sendBtn = document.getElementById('sendBtn');

    sendBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (text) {
            sendBullet();
            input.value = '';
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const text = input.value.trim();
            if (text) {
                sendBullet();
                input.value = '';
            }
        }
    });

});