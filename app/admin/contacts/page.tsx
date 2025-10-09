"use client";

import { motion } from "framer-motion";
import {
  Archive,
  Bell,
  Calendar,
  CheckCircle,
  Mail,
  MessageSquare,
  Search,
  User,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase";

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  source: string;
  subscribed_to_newsletter: boolean;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
  updated_at: string;
}

interface ContactStats {
  total: number;
  new: number;
  read: number;
  replied: number;
  archived: number;
  newsletter_signups: number;
}

type ContactStatus = Contact["status"];

export default function ContactsAdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<ContactStats>({
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
    newsletter_signups: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "all">("all");
  const [error, setError] = useState("");
  const supabase = useMemo(() => createClient(), []);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);

      const { data: contactsData, error: contactsError } = await supabase
        .from<Contact>("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (contactsError) throw contactsError;

      const safeContacts = contactsData ?? [];

      setContacts(safeContacts);

      // Calculate stats
      const total = safeContacts.length;
      const newCount = safeContacts.filter((c) => c.status === "new").length;
      const readCount = safeContacts.filter((c) => c.status === "read").length;
      const repliedCount = safeContacts.filter((c) => c.status === "replied").length;
      const archivedCount = safeContacts.filter((c) => c.status === "archived").length;
      const newsletterSignups = safeContacts.filter((c) => c.subscribed_to_newsletter).length;

      setStats({
        total,
        new: newCount,
        read: readCount,
        replied: repliedCount,
        archived: archivedCount,
        newsletter_signups: newsletterSignups,
      });
    } catch (err: unknown) {
      console.error("Error fetching contacts:", err);
      const message = err instanceof Error ? err.message : "Failed to load contacts";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void fetchContacts();
  }, [fetchContacts]);

  const updateContactStatus = async (contactId: string, newStatus: ContactStatus) => {
    try {
      if (!supabase) return;

      const { error } = await supabase
        .from("contacts")
        .update({
          status: newStatus,
          ...(newStatus === "replied" ? { replied_at: new Date().toISOString() } : {}),
        })
        .eq("id", contactId);

      if (error) throw error;

      // Update local state
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === contactId ? { ...contact, status: newStatus } : contact
        )
      );

      // Refresh stats
      await fetchContacts();
    } catch (err: unknown) {
      console.error("Error updating contact status:", err);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: ContactStatus) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "read":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "replied":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Contact Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage contact form submissions and newsletter signups
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-2xl font-bold">{stats.new}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">New</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-2xl font-bold">{stats.read}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Read</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.replied}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Replied</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Archive className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.archived}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Archived</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.newsletter_signups}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Newsletter</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ContactStatus | "all")}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Contacts List */}
        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">{contact.name}</h3>
                    <Badge className={getStatusColor(contact.status)}>{contact.status}</Badge>
                    {contact.subscribed_to_newsletter && (
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        <Bell className="h-3 w-3 mr-1" />
                        Newsletter
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <Mail className="h-4 w-4" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {contact.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <Calendar className="h-4 w-4" />
                    {new Date(contact.created_at).toLocaleDateString()} at{" "}
                    {new Date(contact.created_at).toLocaleTimeString()}
                    <span className="text-gray-400">•</span>
                    <span>Source: {contact.source}</span>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {contact.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col gap-2">
                  <Button
                    size="sm"
                    variant={contact.status === "read" ? "default" : "outline"}
                    onClick={() => updateContactStatus(contact.id, "read")}
                    disabled={contact.status === "read"}
                  >
                    Mark Read
                  </Button>
                  <Button
                    size="sm"
                    variant={contact.status === "replied" ? "default" : "outline"}
                    onClick={() => updateContactStatus(contact.id, "replied")}
                    disabled={contact.status === "replied"}
                  >
                    Mark Replied
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateContactStatus(contact.id, "archived")}
                    disabled={contact.status === "archived"}
                  >
                    Archive
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No contacts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Contact form submissions will appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
