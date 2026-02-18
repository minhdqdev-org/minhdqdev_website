---
title: 'AutoVid: Automating Video Production at AIV Group'
date: '2021-03-01'
tags: [python, django, celery, rabbitmq, automation]
draft: false
summary: 'How I built AutoVid — a web application that automated repetitive video production tasks, built with Django, Celery, and RabbitMQ during my time at AIV Group.'
authors:
  - default
---

## Background

Producing short-form videos at scale is tedious. At AIV Group, the team was manually assembling video segments, adding captions, and rendering outputs for a content pipeline — a process that ate hours every week and was error-prone.

AutoVid was the project I carried end-to-end during my internship to fix that.

## What it does

AutoVid is a web application that takes structured input (script, media assets, template preferences) and produces a finished video without manual intervention. Operators submit jobs through a simple web UI; the system handles the rest asynchronously.

## Architecture

The stack will feel familiar if you've read my post on [VnAlert's backend](/blog/caching):

- **Django** — web framework and job management UI.
- **RabbitMQ** — message broker. Each video job becomes a message on a queue.
- **Celery** — distributed task workers that pull jobs and run the video processing pipeline.
- **FFmpeg** (via Python subprocess) — the actual video assembly engine.

The async queue was critical because video rendering is CPU-bound and can take tens of seconds per job. Blocking HTTP requests for that would make the system unusable.

## Challenges

**Worker reliability.** A video job that fails halfway through is worse than one that never started — you've partially written files and potentially held resources. I implemented idempotent task design: each step could be retried safely, and partially completed outputs were cleaned up on failure.

**Progress visibility.** Operators wanted to know where their job was. I added a simple polling endpoint that reported queue depth and per-job status (queued → processing → done / failed), which reduced "is it stuck?" interruptions considerably.

## Takeaway

AutoVid taught me that async task systems are as much about failure handling as happy-path throughput. A queue that moves fast but loses jobs silently is worse than a slow one that guarantees delivery.
