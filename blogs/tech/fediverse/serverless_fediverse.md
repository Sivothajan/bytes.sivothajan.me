---
title: "Serverless Fediverse: Setting up a Minimal Fediverse Server with Vercel Edge Functions"
date: "2025-Auguest-16"
description: "A guide on creating a minimal Fediverse server using Vercel Edge Functions, addressing challenges like cold starts, caching, and rate limiting."
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

### Finally, I deployed the Edge Function to Vercel and tested it with a Fediverse client

You can find the fediverse account I created for testing here: [@hi@Sivothajan.me](https://sivothajan.me) or [@hi@Sivothajan.dev](https://sivothajan.dev).

---
