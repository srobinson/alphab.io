---
title: "Your agent starts every session stupid"
description: "The ephemeral agent problem. Context windows fill and die. The next agent starts empty. What carries forward is what you feed it, and most systems feed garbage."
date: 2026-03-19
tags: ["agents", "memory", "helioy"]
draft: false
---

Every time you start a new conversation with an AI agent, it knows nothing about you. Nothing about your codebase. Nothing about the decisions made yesterday, the bugs fixed last week, or the architectural constraints that took months to establish.

It starts stupid. Every single time.

This is the defining problem of agent systems today. We pour resources into bigger models, longer context windows, more sophisticated tool use. We celebrate when an agent can browse the web, write code, manage files. But the moment that conversation ends, everything it learned evaporates.

## The context window is a beautiful lie

A 200K token context window feels enormous. You can feed it an entire codebase, a full specification document, months of conversation history. For one session, the agent seems brilliant. It understands your naming conventions. It knows why you chose PostgreSQL over DynamoDB. It remembers that the billing module has a race condition you have been working around for three months.

Then the session ends. The context window closes. The next session opens with a blank slate.

You can stuff the new context window with summaries. You can paste in your README, your architecture docs, your coding guidelines. But summaries are lossy by definition. They capture what someone thought was important at the time of writing, which is rarely what turns out to be important at the time of reading.

The real knowledge, the kind that makes a senior engineer productive on a team, lives in the accumulated texture of hundreds of small decisions. Why this abstraction exists. What was tried before and failed. Which parts of the system are fragile in ways that tests do not catch. That knowledge does not fit in a summary. It fits in memory.

## What actually carries forward

In most agent setups today, what carries forward between sessions falls into a few categories. There are system prompts: static instructions that define the agent's role and constraints. There are documents: README files, architecture docs, coding standards that someone wrote once and may or may not have updated. And there are conversation logs: raw transcripts that grow too large to be useful and too noisy to be informative.

None of these are memory. They are reference material.

Memory requires curation. It requires the system to distinguish between signal and noise, to know that a particular debugging insight matters while the seventeen attempts that preceded it do not. Memory requires scope: some things matter globally, some matter only within a specific project, some matter only within a specific directory. Memory requires confidence levels: some knowledge is established fact, some is a working hypothesis, some is speculation that might turn out to be wrong.

When I started building Helioy, the first component I wrote was context-matters. A structured context store where agents deposit facts, decisions, lessons, and preferences. Each entry has a kind (fact, decision, lesson, preference, pattern). Each entry has a scope (global, project, directory). Each entry has confidence and tags. When an agent starts a session, it queries for relevant context. When it finishes, it deposits what it learned.

## The compounding effect

The interesting thing about structured memory is how it compounds. An agent that remembers "this project uses the repository pattern for data access" does not just save one lookup. It shapes every subsequent decision about where to put code, how to structure tests, when to inject dependencies. A single well-curated memory entry can influence dozens of downstream choices, each one slightly better than it would have been without that context.

This is how senior engineers work on a team. They do not re-derive every architectural decision from first principles each morning. They carry forward a mental model built from thousands of small interactions. They know that the auth module is touchy because Sarah refactored it last quarter and there are still edge cases. They know that the CI pipeline breaks if you add a dependency with native bindings. They know that the product team cares more about latency than throughput for this particular feature.

An agent without memory has to rediscover all of this. Every session. From scratch.

## What garbage in looks like

Most systems that attempt to bridge sessions do it by feeding the agent its previous conversation transcript. This is the "garbage in" problem. A typical agent conversation contains:

Exploratory dead ends where the agent tried three approaches before finding one that worked. Verbose explanations the agent generated for the user that are irrelevant to future sessions. Debugging output, stack traces, and error messages from problems that have already been solved. Back-and-forth clarification dialogue that established requirements already captured elsewhere.

Feeding all of this back into the next session does not make the agent smarter. It makes it slower. It fills the context window with noise that crowds out signal. The agent spends tokens processing information that has no bearing on the current task.

The alternative is structured memory. Instead of replaying what happened, you record what matters. The decision, not the deliberation. The lesson, not the mistake. The preference, not the negotiation that established it.

## The signal-per-token metric

This is where signal-per-token becomes the fundamental unit of AI system quality. Every token the model processes costs compute, time, and money. More importantly, it costs attention. Language models have finite capacity to attend to relevant information within their context. Fill that context with noise and even the most capable model degrades.

Signal-per-token measures the ratio of useful information to total tokens processed. A system that feeds 100K tokens of raw conversation logs to achieve the same outcome that 2K tokens of curated context could provide is operating at roughly 2% signal efficiency. That is wasteful. And it degrades model performance because the model has to separate signal from noise rather than working directly with signal.

Helioy is built around maximizing this ratio. Every component exists to increase the density of useful signal in the tokens that reach the model. frontmatter-matters provides structural perception so the agent does not need to read entire files to understand code organization. context-matters provides curated memory so the agent does not need to replay entire conversations. attention-matters provides reflective organizational memory on a geometric hypersphere, giving agents a persistent sense of identity and purpose that shapes every interaction without consuming tokens.

## Day one

This is where the 30-day writing series starts. With the fundamental problem: agents are ephemeral, and ephemeral agents are stupid.

The question is what to do about it. Over the next 29 days I will write about the components we are building to address it, the theoretical foundations they rest on, and the practical results we are seeing.

Tomorrow: what happens when memory has structure.
