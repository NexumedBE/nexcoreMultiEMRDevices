import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import session from "express-session";
import FileStore from "session-file-store";
import passport from "./config/passport";
import connectDB from "./config/db";
import helmet from "helmet";
import authRoutes from "./routes/auth/authRoutes";
import acceptLicRoutes from "./routes/users/acceptLic";
import fileRoutes from "./routes/fileRoutes"; // Contains /receive-file endpoint
import checkListenersRoute from "./routes/checkListeners";
import { stopWatchers as stopAllWatchers } from "./utils/watcherManager";
import checkUserSubscriptions from "./utils/subscriptionChecker"
import fs from "fs";
import { exec } from "child_process";
import "./utils/subscriptionChecker";
// import { startBaxterListener } from "./listeners/baxterListener";
// import versionRoutes from "./routes/version";


dotenv.config({ path: path.resolve(__dirname, process.env.NODE_ENV === "production" ? "../.env" : ".env") });

const app = express();

// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// }));

// app.use(express.json());

const PORT = 2756;

// 📝 Logging setup
const logFile = path.join(__dirname, "backend.log");
const logStream = fs.createWriteStream(logFile, { flags: "a" });

const log = (level: string, ...args: any[]) => {
  const timestamp = `[${new Date().toISOString()}]`;
  const message = `${timestamp} ${level} ${args.join(" ")}`;
  logStream.write(message + "\n");
  console.log(message);
};

log("INFO", "🔍 ENV CHECK - MONGO_URI:", process.env.MONGO_URI || "⚠️ NOT SET!");
log("INFO", "🚀 Starting backend...");

// 🛠 Check if the backend is already running
const checkIfPortIsInUse = (port: number) => {
  return new Promise<boolean>((resolve) => {
    exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
      resolve(stdout.includes("LISTENING"));
    });
  });
};

// ✅ CORS Configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "http://localhost:5173", "http://nexcore.nexumed.eu"],
        connectSrc: ["'self'", "http://localhost:5173", "http://nexcore.nexumed.eu"],
        imgSrc: ["'self'", "data:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

// 🛠 Middleware to log requests
app.use((req, res, next) => {
  log("INFO", "🚀 Incoming request:", req.method, req.url);
  log("INFO", "🔍 Request Headers:", JSON.stringify(req.headers, null, 2));
  next();
});

// Middleware to parse JSON requests
app.use(express.json());

// ✅ Store sessions in a file (Persists even after Electron restart)
const FileStoreSession = FileStore(session);

app.use(
  session({
    store: new FileStoreSession({ path: "./sessions", ttl: 86400 }), // Sessions persist for 1 day
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // ⚠️ Must be `true` in production (HTTPS required)
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// ✅ Debug session storage
app.use((req, res, next) => {
  log("INFO", "📝 Current Session:", JSON.stringify(req.session, null, 2));
  next();
});

// Default Route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});


// ✅ Stop watchers before login
app.post("/api/auth/login", (req, res, next) => {
  console.log("🍷🍷Stopping watchers before login...from watcherManager");
  stopAllWatchers();
  next();
});

app.post("/check-subscription", async (req, res) => {
  try {
    await checkUserSubscriptions();
    res.json({ message: "Subscription check completed." });
  } catch (error) {
    console.error("Subscription check failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Authentication Routes
app.use("/api/auth", authRoutes);

//extra routes
app.use("/api", checkListenersRoute);
app.use("/api", acceptLicRoutes);
app.use("/api", fileRoutes);



// 🌍 Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  log("WARN", `🔴 ${signal} received. Closing backend gracefully...`);
  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// 🔄 Restart logic if backend crashes
// const restartBackend = async () => {
//   if (retryCount >= MAX_RETRIES) {
//     log("ERROR", "❌ Max restart attempts reached. Backend shutting down.");
//     process.exit(1);
//   }

//   retryCount++;
//   log("WARN", `⚠️ Backend restarting... Attempt ${retryCount}/${MAX_RETRIES}`);

//   setTimeout(() => {
//     log("INFO", "🚀 Restarting backend...");
//     startBackend(DEFAULT_PORT);
//   }, 5000);
// };

// 🛠 Error Handling
process.on("uncaughtException", (err: Error & { code?: string }) => {
  if (err.code === "EPIPE") {
    log("WARN", "⚠️ EPIPE error ignored: Broken pipe when writing.");
    return;
  }
  log("ERROR", "👩‍🦽 UNCAUGHT EXCEPTION! Backend crashed:", err);
  // restartBackend();
});

process.on("unhandledRejection", (reason) => {
  log("ERROR", "🏌️‍♂️ UNHANDLED PROMISE REJECTION:", reason);
  // restartBackend();
});

// 🚀 Start Backend
// 🚀 Start Backend
const startBackend = async () => {
  const isPortInUse = await checkIfPortIsInUse(PORT);

  if (isPortInUse) {
    log("ERROR", `❌ Port ${PORT} is already in use. Backend cannot start.`);
    process.exit(1);
  }

  try {
    await connectDB();
    log("INFO", "✅ MongoDB connected! Starting backend...");
    const server = app.listen(PORT, () => {
      log("INFO", `✅ Server running at: http://nexcore.nexumed.eu:${PORT}`);
    });

    server.on("error", (err) => {
      log("ERROR", "❌ SERVER ERROR:", err);
      process.exit(1);
    });
  } catch (error) {
    log("ERROR", "❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};


app.all("*", (req, res) => {
  console.log("❌ Route Not Found:", req.method, req.url);
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});


startBackend();

