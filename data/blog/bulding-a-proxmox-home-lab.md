---
title: Building a Proxmox Home Lab
date: '2025-11-29'
tags:
  - proxmox
  - homelab
  - kubernetes
  - infrastructure
draft: false
authors:
  - Dang Quang Minh
---

## Why I built this?

Tearing, exploring, running experiments, messing around with their own stuff (and their own mind too) are what keep an engineer being an engineer. I always want a powerful machine so I can test out all the emerging technologies in recent years or ship some ideas and potential projects I got in my mind to the world. Doing everything on the cloud seems like an unsuitable option for me because it's just way too expensive. On the other hand, it's way better to have a system that is fully controlled by you, for you, on your own.

![tenor.gif](/static/images/blog/building-a-proxmox-home-lab/tenor.gif)

As a backend engineer, I spend my days designing APIs, optimizing database queries, and relying on cloud infrastructure to keep things running. But there is a distinct difference between deploying code to a managed cloud service and actually building the cloud yourself.

## The Bare-Metal Foundation

![proxmox.png](/static/images/blog/building-a-proxmox-home-lab/proxmox.png)

The entire primary infrastructure runs on a single repurposed enterprise workstation, `ws01`:

| **Component**  | **Specification**                                     |
| -------------- | ----------------------------------------------------- |
| CPU            | 2× Intel Xeon Gold 6138 (40 cores / 80 threads total) |
| RAM            | 128 GB                                                |
| Storage (Fast) | 250 GB ZFS SSD (OS) + 1 TB NVMe ZFS pool              |
| Storage (Cold) | 4 TB HDD (Backup archive)                             |
| Hypervisor     | Proxmox VE 9.0.3                                      |

### Why Proxmox over VirtualBox or VMware Workstation?

The core distinction comes down to architecture: VirtualBox and VMware Workstation are Type 2 (hosted) hypervisors. They run as applications on top of a desktop OS, meaning your "server" competes with your desktop environment for resources.

Proxmox VE is a Type 1 (bare-metal) hypervisor. It _is_ the operating system. Every ounce of compute on `ws01` is dedicated to running workloads 24/7. Beyond the lack of licensing fees, Proxmox gives me features that desktop hypervisors simply don't have:

- **First-class ZFS Integration:** My 1 TB NVMe pool gets built-in checksumming, snapshotting, and compression directly at the hypervisor level.
- **LXC Container Support:** I can run lightweight services sharing the host kernel with near-zero overhead.
- **PCIe Passthrough:** Essential for passing physical GPUs into virtual machines without hardware emulation getting in the way.

## Networking: Seamless Global Access

The first challenge of self-hosting is routing. I needed to access the same services from my home LAN and from a coffee shop, using the exact same hostnames, without exposing my internal network to the public internet.

I solved the "remote access" problem using a **dual-network design** and **split-view DNS** via Tailscale.

- **LAN Bridge:** `192.168.1.0/24` for home access.
- **Tailscale Bridge:** `10.100.1.0/24` for remote access.
- **Split-View BIND9:** `*.minhdq.dev` resolves to the local IP when I'm home and the Tailscale IP when I'm away.

This setup allows me to access services like `n8n.minhdq.dev` from anywhere without exposing a single port to the public internet.

## The Enterprise Kubernetes Stack

I run a K8s v1.32.2 cluster (40 cores / 40GB RAM) using the same patterns I use at work:

- **ArgoCD:** Pure GitOps. No `kubectl apply` in production; everything is reconciled from Git.
- **Keycloak:** Central OIDC identity provider for the entire lab (K8s API, Harbor, Grafana).
- **HashiCorp Vault:** Secrets are injected directly into pods via the Vault Agent—no plaintext secrets in Git.
- **Harbor:** Private registry with Trivy vulnerability scanning and Docker Hub caching.
- **Observability:** Prometheus for metrics, Loki for logs, and Grafana for the "single pane of glass."

More and more services are running in my homelab to flesh out the platform:

- **MinIO:** A self-hosted, S3-compatible object storage server. It stores the binary blobs for my Harbor image registry and serves static files for Backstage TechDocs.
- **Kafka + AKHQ:** Running in KRaft mode (no ZooKeeper), Kafka handles event streaming. I use AKHQ as a web UI (think pgAdmin, but for Kafka) to browse topics and debug messages visually.
- **RabbitMQ:** For reliable async task processing. It handles background jobs for applications where exactly-once processing is required.
- **RedisInsight:** Running as a pod in Kubernetes, this provides a visual interface to query my Redis instances, analyze memory, and monitor slow queries.
- **Grafana:** The observability dashboard. It pulls metrics from Prometheus (CPU, pod health) and aggregates logs via Loki/Promtail, routing critical alerts straight to my Telegram.

## AI-Driven Infrastructure: The Agent-Human Partnership

Maintaining an enterprise-grade stack as a solo engineer is a massive undertaking. To keep up with the complexity without burning out, I’ve adopted an **AI-First development workflow**.

I use **GitHub Copilot** with [custom skill](https://github.com/minhdqdev-org/agent-skills/tree/main/skills/homelab-operator) to handle the heavy lifting of building and troubleshooting the homelab. Instead of manually writing every line of Ansible, YAML, or Bash, I leverage AI agents to:

- **Scaffold Infrastructure:** Generate complex Kubernetes manifests and Ansible playbooks based on my architectural requirements.
- **Root Cause Analysis:** When the logs show a cryptic error, I feed the context to the agent to quickly identify potential misconfigurations.

My role has shifted from a manual "builder" to a **Senior Reviewer**. I define the constraints, the agent proposes the implementation, and I perform the final validation to ensure it meets my standards. This **Human-in-the-loop** approach has massively boosted my productivity—allowing me to architect and deploy complex platform features in a fraction of the time it would take manually.

## Architectural Optimizations & Cool Hacks

- **GPU/Disk Passthrough:** My GTX 1660 is passed to `vm101` for Jellyfin hardware transcoding and Ollama (AI models). My 4TB HDD is passed directly to the media server to bypass NFS overhead.
- **LXC Efficiency:** Core networking (Nginx, DNS, Tailscale) runs in LXC containers, consuming only **1.28 GB RAM** total—a 5x saving over full VMs.
- **Uptime Kuma:** A lightweight monitoring layer outside of Kubernetes that alerts me via Telegram if the cluster goes down.

## Monitoring the Void: Catching Silent VM Deaths

When the host runs out of RAM and kills a VM, K8s only reports "node unreachable." To find the _why_, I built a bridge:

1. A Bash script scans `systemd` journals every 60s for `Out of memory` or `segfault`.
2. It sends the kernel-level reason to my **Telegram bot** and triggers a `qm start` to self-heal.
3. If Uptime Kuma detects a service down, it triggers a journal dump so I see the symptom and root cause in one notification.

![telegram.png](/static/images/blog/building-a-proxmox-home-lab/telegram.png)

## Roadmap & Final Thoughts

Future goals include **HA Storage with Ceph** and **Energy Optimization** to scale down nodes at night.

Building this lab is a "forcing function for depth." When you are the Developer, DevOps, and On-call responder for your own cloud, you stop cargo-culting and start understanding. It bridges the gap between writing code and truly owning the platform.

What does your lab look like? If you see any anti-patterns or have tool recommendations, let’s chat in the comments.
