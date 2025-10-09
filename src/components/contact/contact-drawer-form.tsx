"use client";

import { Bell, CheckCircle, Mail, MessageSquare, User } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ContactDrawerMode } from "@/contexts/contact-drawer-context";

// Reusable FormField component
interface FormFieldProps {
  mode: ContactDrawerMode;
  icon?: React.ReactNode;
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}

function FormField({
  icon,
  label,
  htmlFor,
  children,
  className = "",
}: Omit<FormFieldProps, "mode">) {
  const getFieldStyles = () => {
    const baseStyles = "space-y-2";
    return `${baseStyles} ${className}`;
  };

  return (
    <div className={getFieldStyles()}>
      <Label htmlFor={htmlFor} className="text-white block m-2 text-sm font-medium">
        {icon && <span className="inline-block h-4 w-4 mr-4">{icon}</span>}
        {label}
      </Label>
      {children}
    </div>
  );
}

// Simple, clean form field styling
const getFormFieldStyles = (mode: ContactDrawerMode) => {
  const baseStyles =
    "w-full p-4 rounded-lg border-2 bg-black/80 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors";

  if (mode === "contact") {
    return `${baseStyles} border-neon-blue/50 focus:border-neon-blue focus:ring-neon-blue/30`;
  } else {
    return `${baseStyles} border-neon-yellow/50 focus:border-neon-yellow focus:ring-neon-yellow/30`;
  }
};

interface ContactDrawerFormProps {
  mode: ContactDrawerMode;
  onSuccess?: () => void;
  source: string;
}

export function ContactDrawerForm({ mode, onSuccess, source }: ContactDrawerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    // Honeypot spam trap
    const company = (formData.get("company") as string) || "";
    if (company.trim().length > 0) {
      // silently succeed to bots
      setIsSubmitting(false);
      return;
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    try {
      if (mode === "contact") {
        // Store contact submission via secure API (bypasses RLS server-side)
        const contactResp = await fetch("/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            message,
            source,
            subscribed_to_newsletter: subscribeToNewsletter,
          }),
        });
        if (!contactResp.ok) {
          const data = await contactResp.json().catch(() => ({}));
          throw new Error(
            data.error || "Failed to store contact submission. Please try again later."
          );
        }
        const { id: contactId } = await contactResp.json();
        console.log("Contact stored successfully with ID:", contactId);

        // If user wants newsletter subscription, add them via unified API (sends welcome email)
        if (subscribeToNewsletter) {
          try {
            const resp = await fetch("/api/subscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email,
                publication: "general",
                source: `${source}_signup`,
                first_name: name.split(" ")[0] || null,
                last_name: name.split(" ").slice(1).join(" ") || null,
              }),
            });
            if (!resp.ok) {
              const data = await resp.json().catch(() => ({}));
              console.warn("Newsletter subscription failed:", data.error || resp.statusText);
            }
          } catch (subscriptionError: unknown) {
            console.warn("Newsletter subscription failed:", subscriptionError);
          }
        }
      } else if (mode === "newsletter") {
        // Newsletter-only submission
        const resp = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            publication: "general",
            source,
            first_name: firstName || null,
            last_name: lastName || null,
          }),
        });
        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}));
          throw new Error(
            data.error || "Failed to subscribe to newsletter. Please try again later."
          );
        }
      }

      // No client notification needed; /api/contacts triggers /api/notify-contact server-side

      setIsSubmitted(true);

      // Reset form
      formRef.current?.reset();
      setSubscribeToNewsletter(false);

      // Call success callback after a short delay
      timeoutRef.current = setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err: unknown) {
      console.error("Form submission error:", err);
      const message =
        err instanceof Error ? err.message : "Failed to send message. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto sm:p-8">
      {/* Success Message - Show above form */}
      {isSubmitted && (
        <div className="mb-8 p-8 bg-green-900/60 border border-green-500/50 rounded-lg animate-in fade-in-0 slide-in-from-top-4 duration-500">
          <CheckCircle className="mx-auto h-16 w-16 text-green-400 mb-4 animate-in zoom-in-50 duration-300 delay-200" />
          <h3 className="text-xl font-bold text-green-400 mb-2 animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-300 text-center">
            {mode === "contact" ? "Message Sent!" : "Subscribed!"}
          </h3>
          <p className="text-green-300 animate-in fade-in-0 slide-in-from-top-2 duration-300 delay-500 text-center">
            {mode === "contact"
              ? "Thank you for reaching out. I'll get back to you soon."
              : "Thank you for subscribing!"}
          </p>
        </div>
      )}

      {/* Form - Hide when submitted */}
      {!isSubmitted && (
        <form
          ref={formRef}
          className="space-y-6 bg-black/60 p-4 sm:p-8 rounded-sm sm:border border-gray-700 animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
          onSubmit={handleSubmit}
        >
          {/* Honeypot field */}
          <input
            type="text"
            name="company"
            autoComplete="off"
            tabIndex={-1}
            className="hidden"
            aria-hidden="true"
          />

          {mode === "contact" && (
            <>
              <FormField icon={<User />} label="Full Name" htmlFor="name">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  disabled={isSubmitting}
                  className={getFormFieldStyles(mode)}
                  placeholder="Enter your full name..."
                />
              </FormField>

              <FormField icon={<Mail />} label="Email Address" htmlFor="email">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={isSubmitting}
                  className={getFormFieldStyles(mode)}
                  placeholder="your.email@example.com"
                />
              </FormField>

              <FormField icon={<MessageSquare />} label="Your Message" htmlFor="message">
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  disabled={isSubmitting}
                  className={`${getFormFieldStyles(mode)} min-h-[140px] resize-none`}
                  placeholder="Share your vision, ideas, or questions..."
                />
              </FormField>

              {/* Newsletter subscription option */}
              <div className="flex items-center space-x-3 p-4 bg-neon-yellow/10 rounded-lg border border-neon-yellow/20">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={subscribeToNewsletter}
                  onChange={(e) => setSubscribeToNewsletter(e.target.checked)}
                  disabled={isSubmitting}
                  className="h-5 w-5 text-neon-yellow focus:ring-neon-yellow/40 border-neon-yellow/50 rounded"
                />
                <Label htmlFor="newsletter" className="text-white cursor-pointer">
                  <Bell className="inline-block h-4 w-4 mr-2 text-neon-yellow" />
                  Subscribe to newsletter for AI insights
                </Label>
              </div>
            </>
          )}

          {mode === "newsletter" && (
            <>
              <FormField icon={<Mail />} label="Email Address" htmlFor="email">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={isSubmitting}
                  className={getFormFieldStyles(mode)}
                  placeholder="your.email@example.com"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField icon={<User />} label="First Name" htmlFor="firstName">
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    disabled={isSubmitting}
                    className={getFormFieldStyles(mode)}
                    placeholder="First Name (Optional)"
                  />
                </FormField>

                <FormField icon={<User />} label="Last Name" htmlFor="lastName">
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    disabled={isSubmitting}
                    className={getFormFieldStyles(mode)}
                    placeholder="Last Name (Optional)"
                  />
                </FormField>
              </div>
            </>
          )}

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <GradientButton
            type="submit"
            disabled={isSubmitting}
            variant="yellow-red"
            size="lg"
            className="w-full"
          >
            {isSubmitting
              ? mode === "contact"
                ? "Sending..."
                : "Subscribing..."
              : mode === "contact"
                ? "Send Message"
                : "Subscribe"}
          </GradientButton>
        </form>
      )}
    </div>
  );
}
