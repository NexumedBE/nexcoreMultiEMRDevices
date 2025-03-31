import express, { Request, Response } from "express";
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
import fileRoutes from "./routes/fileRoutes";
import checkListenersRoute from "./routes/checkListeners";
import { stopWatchers as stopAllWatchers } from "./utils/watcherManager";
import checkUserSubscriptions from "./utils/subscriptionChecker"
import fs from "fs";
import https from "https";
import { exec } from "child_process";
import "./utils/subscriptionChecker";

dotenv.config({ path: path.resolve(__dirname, process.env.NODE_ENV === "production" ? "../.env" : ".env") });

const app = express();
const PORT = 2756;
const isProduction = process.env.NODE_ENV === "production";

// 📝 Logging setup
const logFile = path.join(__dirname, "backend.log");
const logStream = fs.createWriteStream(logFile, { flags: "a" });

const log = (level: string, ...args: any[]) => {
  const timestamp = `[${new Date().toISOString()}]`;
  const message = `${timestamp} ${level} ${args.join(" ")}`;
  logStream.write(message + "\n");
  console.log(message);
};

// CORS
// app.use(cors({
//   origin: isProduction ? "https://nexcore.nexumed.eu" : "http://localhost:5173",
//   credentials: true,
// }));

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://localhost:5173",
      "https://nexcore.nexumed.eu",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Helmet CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: isProduction
          ? ["'self'", "https://nexcore.nexumed.eu"]
          : ["'self'", "http://localhost:5173", "https://nexcore.nexumed.eu"],
        connectSrc: isProduction
          ? ["'self'", "https://nexcore.nexumed.eu"]
          : ["'self'", "http://localhost:5173", "https://nexcore.nexumed.eu"],
        imgSrc: ["'self'", "data:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

// Logging requests
app.use((req, res, next) => {
  log("INFO", "🚀 Incoming request:", req.method, req.url);
  log("INFO", "🔍 Request Headers:", JSON.stringify(req.headers, null, 2));
  next();
});

app.use(express.json());

// Session
const FileStoreSession = FileStore(session);

app.use(
  session({
    store: new FileStoreSession({ path: "./sessions", ttl: 86400 }),
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  log("INFO", "📝 Current Session:", JSON.stringify(req.session, null, 2));
  next();
});

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running!");
});

app.post("/api/auth/login", (req, res, next) => {
  console.log("🍷🍷Stopping watchers before login...");
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

app.use("/api/auth", authRoutes);
app.use("/api", checkListenersRoute);
app.use("/api", acceptLicRoutes);
app.use("/api", fileRoutes);

// 404
app.all("*", (req, res) => {
  console.log("❌ Route Not Found:", req.method, req.url);
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  log("WARN", `🔴 ${signal} received. Closing backend gracefully...`);
  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Error handling
process.on("uncaughtException", (err: Error & { code?: string }) => {
  if (err.code === "EPIPE") {
    log("WARN", "⚠️ EPIPE error ignored: Broken pipe when writing.");
    return;
  }
  log("ERROR", "👩‍🦽 UNCAUGHT EXCEPTION! Backend crashed:", err);
});

process.on("unhandledRejection", (reason) => {
  log("ERROR", "🏌️‍♂️ UNHANDLED PROMISE REJECTION:", reason);
});

// Check port
const checkIfPortIsInUse = (port: number) => {
  return new Promise<boolean>((resolve) => {
    exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
      resolve(stdout.includes("LISTENING"));
    });
  });
};

// 🚀 Start backend
const startBackend = async () => {
  const isPortInUse = await checkIfPortIsInUse(PORT);
  if (isPortInUse) {
    log("ERROR", `❌ Port ${PORT} is already in use. Backend cannot start.`);
    process.exit(1);
  }

  try {
    await connectDB();
    log("INFO", "✅ MongoDB connected!");

    if (isProduction) {
      const httpsOptions = {
        key: fs.readFileSync(path.resolve(__dirname, "certs/key.pem")),
        cert: fs.readFileSync(path.resolve(__dirname, "certs/cert.pem")),
        secureProtocol: "TLSv1_2_method",
      };

      https.createServer(httpsOptions, app).listen(PORT, () => {
        const host = process.env.HOSTNAME || "localhost";
        log("INFO", `✅ TLS Server running at: https://${host}:${PORT}`);
      });
    } else {
      app.listen(PORT, () => {
        log("INFO", `✅ Dev Server running at: http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    log("ERROR", "❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

startBackend();