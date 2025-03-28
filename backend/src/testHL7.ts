import net from "net";

const PORT = 281;
const HOST = "0.0.0.0"; // Forces IPv4

const server = net.createServer((socket) => {
  console.log("✅ Client connected");
  socket.on("data", (data) => {
    console.log("📨 Received data:", data.toString());
  });
});

server.on("error", (err) => {
  console.error("❌ Server error:", err.message);
});

server.listen(PORT, HOST, () => {
  const address = server.address();
  console.log(`🚀 Server bound to:`, address);
});
