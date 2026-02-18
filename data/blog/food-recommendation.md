---
title: 'Developer Circles Vietnam Innovation Challenge: Food Recommendation in the Top 12'
date: '2020-09-01'
tags: [python, deep-learning, recommendation-systems, hackathon]
draft: false
summary: 'How a team of five built a food recommendation application for the Developer Circles Vietnam Innovation Challenge — and landed in the Top 12.'
authors:
  - default
---

## The competition

The Developer Circles Vietnam Innovation Challenge, run by Facebook Developer Circles, invited teams to build technology solutions with real-world impact. Our team of five entered with a food recommendation application — a tool that suggests dishes based on a user's preferences, dietary constraints, and eating history.

We placed in the **Top 12** out of all submissions.

## What we built

The application combined two recommendation approaches:

- **Content-based filtering** — recommend dishes similar to ones the user has rated highly, using ingredient and nutritional features.
- **Collaborative filtering** — find users with similar taste profiles and recommend what they liked.

A simple ensemble of the two methods improved recommendation quality over either approach alone.

The frontend was intentionally minimal — the challenge required demonstrating the recommendation engine, not building a polished product in a weekend.

## What I worked on

My focus was on the deep learning component: a model that embedded dishes and user profiles into a shared latent space, allowing the system to predict how much a given user would enjoy a dish they'd never encountered before. Training used implicit feedback (order history) rather than explicit star ratings, which meant handling sparse, noisy data carefully.

## Lessons

**Sparse data is the real challenge.** Most users had tried only a handful of dishes, making their profiles thin. Cold-start handling — how you recommend to new users — mattered as much as the core model.

**Evaluation is subtle.** Standard accuracy metrics (precision, recall) don't fully capture whether recommendations feel surprising and useful. We added a diversity metric to discourage the system from recommending the same five dishes to everyone.

**Competition code is not production code.** Speed of iteration wins hackathons. I've since learned to separate "demo-ready" from "production-ready" in how I scope work under time pressure.
