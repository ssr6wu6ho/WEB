# 物联网多用途小摆件X安卓APP

## 🤖硬件部分

### 天气时钟

#### 一切都是动画显示

- **获取当前天气时间**  
  通过心知天气API获取实时天气数据（温度/湿度/天气类型），天气图标动态化呈现（晴/雨/雪/雾等8种状态）
- **天气预报**
  就是获取后三天的天气
- **低功耗待机模式**  
  就是一个循环播放的小动画

---

### 网络中枢

- **手机web配网**  
  Web无感配网（192.168.4.1可视化界面）
  EEPROM加密记忆（可存储3组历史网络）
- **多协议通信中枢**  
  同时承载MQTT/HTTP/NTP协议。

---

### 阿里云物联网(打比赛加的)

- **mqtt发/收数据**  
```cpp
// Mqtt.hpp
void MQTT_connect() {
  mqttClient.connect(broker, port); // 连接阿里云IoT
  mqttClient.subscribe(inTopic); // 订阅控制指令
}

void onMqttMessage(int messageSize) {
  bool led = doc["params"]["RGB_isopen"]; // 解析RGB控制指令
  bool fan = doc["params"]["fan_isopen"]; // 解析风扇控制指令
}
```

---

### RGB的控制

- **多维光效控制**  
  4种基础模式：
  常亮模式（1670万色可选）
  呼吸模式（速度/亮度10级可调）
  彩虹渐变（HSV色彩空间算法）
  危险预警（红蓝警灯动态闪烁）
 ```cpp
 // RGB_.hpp
void RGB_conduct() {
  switch(rgb_type) {
    case 1: // 常亮模式
      _RGB_.setPixelColor(i, rgb_R, rgb_G, rgb_B);
    case 2: // 呼吸灯模式
      rgb_lumin += (breathe_speed * 5); // 亮度渐变算法
    case 3: // 彩虹模式
      _RGB_.setPixelColor(i, Wheel((i + j) & 255)); // 色轮算法
      ........
  }
}
```

---

### 环境监测矩阵

- **可视化数据看板**  
  OLED实时显示温湿度折线图
- **配合mqtt上传数据**  
```cpp
// main.ino
void loop() {
  renew_T_H_data(); // 读取DHT11传感器
  if(mqttClient.connected()){
    send_MqttMessage(); // 上传阿里云
  }
}

// Mqtt.hpp
void send_MqttMessage() {
  json_data["Temperature"] = DHT11.temperature;
  json_data["Humidity"] = DHT11.humidity;
  mqttClient.print(payload); // JSON格式上传
}
```

---

## A📱PP部分

### mqtt通信

- **通信管理**  
```java
// MqttFragment.java
binding.house1.setOnClickListener(v -> {
  startActivity(new Intent(getActivity(), Monitor.class)); // 跳转监控页
});

// Monitor.java
private void connectMQTT() {
  MqttClient client = new MqttClient(broker, clientId, persistence);
  client.connect(options); // 连接阿里云
  client.subscribe("home/livingroom/temperature"); // 订阅温湿度主题
```

---

### 通义千问AI管家

- **情境化智能分析**  
  深度整合环境数据与大语言模型，提供：
  - 健康建议（如"当前湿度较低，建议开启加湿器"）
  - 节能方案（如"检测到客厅无人，已关闭空调"）
  - 设备诊断（如"传感器读数异常，建议清洁探头"）
-  **聊天界面**
   - 采用RecyclerView实现类似微信的聊天效果

---

# 获得2024辽宁省移动应用开发大赛省一