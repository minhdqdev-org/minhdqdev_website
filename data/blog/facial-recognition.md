---
title: 'Building a Facial Recognition System for CCTV Cameras'
date: '2019-07-01'
tags: [python, deep-learning, computer-vision, machine-learning]
draft: false
summary: 'A look at the facial recognition system I helped develop at InfoRe Technology — designed to identify individuals across a network of CCTV cameras in near-real-time.'
authors:
  - default
---

## Context

During my internship at InfoRe Technology (2018–2019), my main project was collaborating on a facial recognition system intended for CCTV camera networks. The goal: given a live video feed from one or more cameras, identify known individuals from a registered database and flag unknown faces.

This was also where I delivered weekly technical seminars and taught Python to the business team — so it doubled as both an engineering and a communication challenge.

## System overview

The pipeline had three stages:

1. **Detection** — locate all faces in each video frame. We used a pre-trained detector (MTCNN) for its balance of accuracy and speed on moderate hardware.
2. **Embedding** — convert each detected face crop into a compact vector representation using a deep learning model (FaceNet). Two photos of the same person produce vectors that are close together in embedding space; different people are far apart.
3. **Matching** — compare the embedding against the registered database using cosine similarity. If the closest match exceeds a threshold, the person is identified; otherwise, the face is marked unknown.

## Challenges

**Latency vs. accuracy trade-off.** Running the full pipeline on every frame of a 30fps stream isn't feasible on commodity hardware. We sampled frames and ran detection/embedding at a reduced rate, interpolating identity between keyframes. This cut CPU load significantly at the cost of a small identification delay.

**Lighting and angle variation.** Indoor CCTV footage has harsh overhead lighting, low resolution, and steep top-down angles — very different from the frontal, well-lit faces most pre-trained models excel on. We supplemented the registered database with augmented crops (rotated, brightness-shifted) to improve recall.

**False positive cost.** Incorrectly identifying someone is worse than not identifying them. We kept the matching threshold conservative and added a confidence score to every match so operators could review borderline cases.

## Takeaway

This project gave me a solid grounding in production computer vision: it's rarely about the model's benchmark accuracy, but about the unglamorous work of handling real-world data variation, latency constraints, and the operational cost of errors.
