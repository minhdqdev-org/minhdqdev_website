---
title: 'AI4VN National Hackathon: Virtual Try-On Clothes with VITON — Top 5'
date: '2021-10-01'
tags: [python, deep-learning, computer-vision, viton, hackathon]
draft: false
summary: 'How we built a web application that lets users virtually try on clothes using the VITON model — and finished in the Top 5 at the AI4VN National Hackathon.'
authors:
  - default
---

## The challenge

The AI4VN National Hackathon brought together teams to solve applied AI problems in the Vietnamese context. Our team chose the fashion domain: build a system where users can upload a photo of themselves and a garment, and see what they'd look like wearing it — without physically trying it on.

We finished in the **Top 5**.

## The VITON model

VITON (Virtual Try-ON) is a deep learning model designed specifically for this problem. Given a person image and a garment image, it:

1. Segments the person's body and clothing region.
2. Warps the target garment to fit the person's pose and body shape.
3. Blends the warped garment back onto the person in a photorealistic way.

The model had been published in research form, but adapting it to a usable web application — with real user photos, variable lighting, and diverse body shapes — required significant practical engineering beyond running the reference implementation.

## What we built

The system consisted of:

- A **web frontend** where users uploaded their photo and selected a garment from a catalogue (or uploaded their own).
- A **Flask API** that accepted uploads, queued inference jobs, and returned the composited result image.
- The **VITON inference pipeline** running on GPU, wrapped to handle preprocessing (pose estimation, body segmentation) and postprocessing (image blending, artefact cleanup).

## Key difficulties

**Inference latency.** VITON is not fast — a single inference pass took several seconds even on GPU. We pre-warmed the model, batched requests where possible, and showed a progress indicator so the wait felt intentional rather than broken.

**Pose estimation quality.** VITON depends on accurate pose keypoints. Photos taken in unusual angles or with occlusion (arms crossed, partially cropped) produced poor results. We added basic input validation with clear error messages rather than silently returning a bad composite.

**Artefact handling.** The model occasionally produced visible blending artefacts around sleeve edges and collars. We applied a guided filter in postprocessing to smooth boundaries, which improved perceived quality noticeably.

## Takeaway

This project reinforced that deploying research models is a different job from training them. The paper benchmarks rarely reflect real-world input diversity, latency constraints, or user expectations — closing that gap is where most of the real engineering work lives.
