---
title: "How I made my own GitHub Profile View Counter"
date: "2025-July-07"
description: "A brief blog on how I created a GitHub Profile View Counter and deployed it on Vercel."
tags:
  [
    "GitHub",
    "Profile View Counter",
    "Vercel",
    "Serverless",
    "Edge Functions",
    "Serverless Functions",
    "Self Hosting",
  ]
---

## Introduction

In the past, I used [Anton Komarev's GitHub Profile Views Counter Service](https://github.com/antonkomarev/github-profile-views-counter). But after a while, I decided to self-host it on my own server.

The service is written in PHP and uses (as far as I know) MySQL. I didn't want to bloat my server with PHP and MySQL, so I decided to rewrite the whole thing in Node.js.

I started rewriting the project in Node.js — but wait, after 2 days of work, I had a thought: _Why am I rewriting the whole thing from scratch?_

So I pivoted to creating a serverless function that does the same thing.

I use Vercel in my day-to-day life, so naturally, I decided to use Vercel's serverless functions for the job.

---

## Understanding the Needs

I needed a URL that returns an image (SVG) which dynamically updates with the number of views. When hit by GitHub's Image Proxy, it should increment the view count. Other GET requests should return the same image _without_ increasing the count.

---

## What I Did

### Steps I took to create the GitHub Profile View Counter

1. I copied the SVG image template from [Shields.io](https://shields.io).
2. I created a Redis database using [Upstash](https://upstash.com).
3. I created a serverless function on Vercel.
4. I wrote the code to handle GET requests and update the view count.
5. I deployed the serverless function to Vercel.

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
