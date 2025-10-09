// Simple monitoring and logging utilities
// For production, integrate with Sentry, DataDog, or similar

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  [key: string]: unknown;
}

export interface PerformanceMetric {
  name: string;
  duration: number;
  success: boolean;
  metadata?: Record<string, unknown> | undefined;
}

class Monitor {
  private isDevelopment = process.env.NODE_ENV === "development";

  /**
   * Log a message with context
   */
  log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...context,
    };

    // In development, use console for pretty printing
    if (this.isDevelopment) {
      const emoji = {
        debug: "🔍",
        info: "ℹ️",
        warn: "⚠️",
        error: "🚨",
      }[level];

      console.log(`${emoji} [${level.toUpperCase()}] ${message}`, context || "");
    } else {
      // In production, output structured JSON for log aggregation
      console.log(JSON.stringify(logData));
    }
  }

  debug(message: string, context?: LogContext) {
    this.log("debug", message, context);
  }

  info(message: string, context?: LogContext) {
    this.log("info", message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log("warn", message, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorData =
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : { error: String(error) };

    this.log("error", message, { ...errorData, ...context });
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metric: PerformanceMetric) {
    this.info("Performance metric", {
      metric_name: metric.name,
      duration_ms: metric.duration,
      success: metric.success,
      ...metric.metadata,
    });

    // Warn on slow operations
    if (metric.duration > 5000) {
      this.warn(`Slow operation detected: ${metric.name}`, {
        duration_ms: metric.duration,
      });
    }
  }

  /**
   * Helper to time async operations
   */
  async timeAsync<T>(
    name: string,
    operation: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    const startTime = Date.now();
    let success = false;

    try {
      const result = await operation();
      success = true;
      return result;
    } catch (error) {
      this.error(`Operation failed: ${name}`, error, metadata);
      throw error;
    } finally {
      const duration = Date.now() - startTime;
      this.trackPerformance({ name, duration, success, metadata });
    }
  }

  /**
   * Track API request metrics
   */
  trackAPIRequest(endpoint: string, statusCode: number, duration: number) {
    this.info("API request", {
      endpoint,
      status_code: statusCode,
      duration_ms: duration,
      success: statusCode >= 200 && statusCode < 300,
    });
  }

  /**
   * Track content sync metrics
   */
  trackContentSync(metrics: {
    sourceName: string;
    itemsFetched: number;
    itemsProcessed: number;
    duration: number;
    success: boolean;
    error?: string;
  }) {
    if (metrics.success) {
      this.info("Content sync completed", {
        source: metrics.sourceName,
        items_fetched: metrics.itemsFetched,
        items_processed: metrics.itemsProcessed,
        duration_ms: metrics.duration,
      });
    } else {
      this.error("Content sync failed", new Error(metrics.error || "Unknown error"), {
        source: metrics.sourceName,
        duration_ms: metrics.duration,
      });
    }
  }

  /**
   * Track cache performance
   */
  trackCacheHit(key: string, hit: boolean) {
    this.debug("Cache access", {
      cache_key: key,
      cache_hit: hit,
    });
  }

  /**
   * Track rate limit events
   */
  trackRateLimit(identifier: string, endpoint: string, blocked: boolean) {
    if (blocked) {
      this.warn("Rate limit exceeded", {
        identifier,
        endpoint,
      });
    }
  }

  /**
   * Critical error that needs immediate attention
   */
  critical(message: string, error?: Error | unknown, context?: LogContext) {
    this.error(`[CRITICAL] ${message}`, error, { ...context, critical: true });

    // In production, this could trigger alerts via webhooks
    if (!this.isDevelopment && process.env.ALERT_WEBHOOK_URL) {
      this.sendAlert(message, error, context).catch(console.error);
    }
  }

  /**
   * Send alert to external service (webhook, Slack, etc.)
   */
  private async sendAlert(message: string, error?: Error | unknown, context?: LogContext) {
    try {
      const webhookUrl = process.env.ALERT_WEBHOOK_URL;
      if (!webhookUrl) return;

      const payload = {
        text: `🚨 Critical Error: ${message}`,
        error: error instanceof Error ? error.message : String(error),
        context,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      };

      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (alertError) {
      console.error("Failed to send alert:", alertError);
    }
  }
}

// Export singleton instance
export const monitor = new Monitor();

/**
 * Decorator to automatically track function performance
 */
export function tracked(name?: string) {
  return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value as (...fnArgs: unknown[]) => unknown;
    const metricName = name || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: unknown[]) {
      return monitor.timeAsync(metricName, async () => originalMethod.apply(this, args));
    };

    return descriptor;
  };
}
