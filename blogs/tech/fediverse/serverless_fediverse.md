---
title: "Basic Serverless Fediverse Setup with Vercel Edge Functions"
date: "2025-Auguest-16"
description: "A brief blog on how I set up a basic Fediverse server using Vercel Edge Functions."
tags: ["Fediverse", "Vercel", "Edge Functions", "Serverless", "Self Hosting"]
---

## Introduction

Fediverse is a decentralized social network that allows users to interact across different platforms. Fediverse servers use protocols like ActivityPub to communicate with each other.

In the recent years, I used many fediverse servers as my fediverse instances, but I always wanted to set up my own minimal server. Last year, I tested snac2, a minimal ActivityPub server, but it was too complex for my needs. I wanted something simpler than that.

---

## Understanding the Needs

I wanted a minimal server that could:

- Handle basic ActivityPub interactions.
- Be easy to set up and maintain.
- Run on a serverless platform for cost-effectiveness.
- Be fast and responsive.
- Allow me to experiment with different features without worrying about server management.
- Be able to handle a small number of users (just me, for now).

---

## What I Did

### Steps I took to create the serverless Fediverse server

1. I chose **Vercel Edge Functions** for their simplicity and performance.
2. I set up a basic Edge Function that responds to ActivityPub requests.
3. I implemented a simple ActivityPub endpoint that can handle basic interactions like profile, followers, following and posts.

---

## The Problems I Faced

### 1. **Serverless Function Cold Starts**

Serverless functions can have cold starts — the first request after a period of inactivity takes longer to respond. Not ideal for something that needs to return an image quickly.

To solve this, I switched from a regular serverless function to a **Vercel Edge Function**. Edge functions are still serverless but run closer to the user, making them much faster.

---

### 2. **Image Caching Issues**

GitHub caches images aggressively using its Image Proxy. So even if the view count is updated, the cached image might not reflect it immediately.

This issue is caused by GitHub’s proxy + Vercel’s global CDN caching.

To fix this, I added a `Cache-Control: no-store` header in the response to prevent caching. This makes GitHub request a fresh image every time, keeping the counter accurate.

---

### 3. **Rate Limiting**

To avoid abuse, I implemented basic rate limiting. I used Vercel’s Custom Firewall Rules to limit requests to the Edge Function.

I also excluded GitHub's Image Proxy IPs from rate limiting, so views are counted only when requested by GitHub’s proxy, not by random bots or refresh spam.

---

## Conclusion

Boom — now I have a minimal Edge Function that does exactly what I need.

You can view it live at: [Sivothajan's GitHub Profile View Counter](https://count.sivothajan.me)

---

### Sample View

![Sivothajan's GitHub Profile View Counter Image](https://count.sivothajan.me)
