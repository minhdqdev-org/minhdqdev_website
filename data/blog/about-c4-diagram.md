---
title: About C4 diagram
date: '2026-01-25'
tags:
- research
draft: true
authors:
- Dang Quang Minh
---

## Introduction
Before we draw, you must understand the hierarchy. Think of C4 like zooming into a digital map:
1. **Level 1 (Context):** The View of the **Continent**. You see countries and borders. You don't see roads.
2. **Level 2 (Containers):** The View of the **City**. You see districts and major rail lines.
3. **Level 3 (Components):** The View of the **Street**. You see individual buildings.
4. **Level 4 (Code):** The View of the **House Blueprints**. You see the furniture and wiring.
	- Rarely use this. Prefer UML diagrams.

Như nào là container?
- We should question that does that thing run as a separate process (or on a separate server) that your code talks to over the network? If yes -> it is a container
- E.g. Redis, Postgres, RabbitMQ, Kafka, Django API service


Pro Tip: we sometimes treat specific Queues or Topics as Containers. As drawing one big box called RabbitMQ can sometimes be bad architecure practice if you have 50 different microservices using it.


Như nào components?
- E.g. library like Log4j, Java Class, Function




Thường thì sẽ dùng C4 để vẽ high-level architecture (level 1 & level 2)

Level 1: System Context Diagram (the Big Picture)
Target audience: non-technical stakeholders, PM, new joiners

Use: User(s), Your systems, External systems

Rule: no technical jargon here (no mention of SQL, Java, React). Just boxes and lines showing relationships




Xài draw.io



## Q & A
#flashcards/swe/system-design 

**Question:** Mobile app scan a fixed QR code at store. Then that QR code is a component or a container?
?
Short answer, a fixed QR code is neither a component nor a container. Since the QR code is just passive data (like a piece of paper), it belongs in the relationship, not as a box.
<!--SR:!2026-01-18,3,250-->

```
Customer --(Scans store QR code using)--> Mobile App
```

If that QR code is pasted on a specific "Smart Kiosk" or a "POS Terminal" that your app interacts with digitally _after_ scanning, then you might draw the machine.
- `[Container] Mobile App` --(Sends Store ID from QR)--> `[External System] Store POS System`


**Question:** Suppose we have a Django API server, it has an integrated admin console. Should we draw a single container or two separate containers?
?
The recommendation is to draw one container.
<!--SR:!2026-01-18,3,250-->

Since it is a standard Django app, the API and the Admin Console are likely part of the **same codebase** and run in the **same process** (e.g., one Gunicorn/uWSGI instance).

If you deploy them together, they are **ONE** container.


**How to draw it properly (The "Interface" Technique)**
So, how do we show that there are two different "doors" into this house? You do it with the **Arrows (Relationships)**.

You should have **Two Actors** pointing to the **One Container**.
- **Box:** `[Container] Django Backend Application`
    - _Description:_ "Provides JSON API for mobile app and serves static Admin Console."
- **Arrow 1:** `[Person] Admin Staff` --(Manages users via /admin)--> `Django Backend`
- **Arrow 2:** `[Container] Mobile App` --(Makes JSON/HTTPS calls to)--> `Django Backend`


Don't confuse "URL Routes" (Admin vs API) with "Architecture"


















