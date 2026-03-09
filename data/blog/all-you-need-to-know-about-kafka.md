---
title: All you need to know about Apache Kafka (in my opinion)
date: '2026-03-06'
tags:
- system-design
- data-engineering
- post
- minhdqdev
draft: false
authors:
- Dang Quang Minh
---

> [!tldr]+ TL;DR
> - 

## Quickstart
Default port: 9092

CLI producer: kafka-console-producer.sh

```
bin/kafka-console-producer.sh --bootstrap-server localhost:9092 --topic phishing-sites
```


## Introduction
**Kafka** is a distributed event streaming platform.
- Is used for building real-time data processing pipelines and streaming applications.
- It is highly scalable, fault-tolerant, reliable, and can handle large volumes of data.

Fault tolerant:
- Max number of failures - 1 == replication factor
- Max replication factor == number of servers
- Copying partitions are how replication is handled

Read more about fault tolerant in the section:


![22ade5eb-1223-4cdc-a2ed-dccd1e42dc6e_1202x1066.webp](/static/images/blog/all-you-need-to-know-about-kafka/22ade5eb-1223-4cdc-a2ed-dccd1e42dc6e_1202x1066.webp)

In order to understand Kafka, we need to define two terms:
- **Events**: a log of state of something at a specific point in time
- **Event streams**: continuous and unbounded series of events

Kafka can be used as a [[Publish-and-Subscribe architecture|Publish-subscribe messaging]] model. Also, Kafka can be used as a log aggregation platform, ingesting and storing logs from multiple sources in a durable and fault-tolerant way.


## Related Topics
- [[Commit Log]]: Kafka được xây dựng dựa trên concept commit log


## Use cases of Kafka
- Originally, Kafka was developed at LinkedIn to provide a high performance messaging system to track user activity (page views, click tracking, modifications to profile, etc.) and system metrics in real-time.

- **Messaging**: Kakfa can be used in scenarios where applications need to send out notifications. For instance, various applications can write messages to Kafka and a single application can then read the messages and take appropriate action (e.g. format the message a certain way, filter a message, batching messages in a single notification).

- **Metrics and logging**: Kafka is a great tool for building metrics and logging data pipelines. Applications can publish metrics to Kafka topics which can then be consumed by monitoring and alerting systems. The pipelines can also be used for offline analysis using Hadoop. Similarly, logs can be published to Kafka topics which can then be routed to log search systems such as Elasticsearch or security analysis applications.

- **Commit log**: Kafka is based on the concept of a commit log which opens up the possibility of using it for database changes. The stream of changes can be used to replicate database updates on a remote system.

- **Stream processing**: The term “stream processing” generally refers to Hadoop’s map/reduce style of processing when applied to data in real-time. Kafka can be used by streaming frameworks to allow applications to operate on Kafka messages to perform actions such as counting metrics, partitioning messages for processing by other applications, combining messages, or applying transformations on them.

![Pasted image 20220830094301.png](/static/images/blog/all-you-need-to-know-about-kafka/Pasted%20image%2020220830094301.png)






🚀 𝐀𝐩𝐚𝐜𝐡𝐞 𝐊𝐚𝐟𝐤𝐚: 𝐓𝐡𝐞 𝐏𝐨𝐰𝐞𝐫𝐡𝐨𝐮𝐬𝐞 𝐨𝐟 𝐌𝐢𝐜𝐫𝐨𝐬𝐞𝐫𝐯𝐢𝐜𝐞𝐬 𝐚𝐧𝐝 𝐑𝐞𝐚𝐥-𝐓𝐢𝐦𝐞 𝐃𝐚𝐭𝐚 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠!

Originally developed by LinkedIn, Apache Kafka stands as a titan in the tech landscape, offering a robust, fault-tolerant, and supremely scalable messaging system. 

It's designed to facilitate applications in publishing and subscribing to real-time data feeds, ensuring that your data not only moves fast but smart. 📈

What’s Buzzing in Kafka-Land? Kafka Streaming & Zero-Copy Kafka!

🌟 Kafka Streams: This client library is not just about moving data; it's about transforming it. By converting input Kafka topics into output topics, Kafka Streams acts as a dynamic stream processing engine that empowers real-time data handling.

⚡ Zero-Copy Kafka: Take efficiency up a notch! Zero-Copy technology allows Kafka to send data directly from the file system cache to the socket buffer, minimising CPU usage and cutting down latency, ensuring your systems run smoother and faster

Top 5 Kafka Use Cases That Are Changing the Game:

1. Data Streaming 🌊: Build applications that not only monitor but also act on real-time data across your organisation.

2. Log Aggregation 📚: Master the art of managing vast volumes of log data with ease and efficiency.

3. Message Queue 📨: Enhance microservices communications with scalability, fault tolerance, and impeccable durability.

4. Web Activity Tracker 🕵️‍♂️: Keep an eye on user behaviour and tailor the user experience with real-time insights.

5. Data Replication 🔁: Sync and transfer data seamlessly across different systems without a hitch.

Dive deeper into how Apache Kafka can revolutionise your data operations. Let's harness the power of real-time data processing together!

![IMG_20240912_155827.jpg](/static/images/blog/all-you-need-to-know-about-kafka/IMG_20240912_155827.jpg)

## Components of Kafka
Kafka cluster has multiple key components to provide the distributed infrastructure and reliably capture, store, order and provide event streams to client applications

### Message/Event
**Message** is the unit of data in Kafka ecosystem.
- Send in batch to reduce overhead (tradeoff between latency and throughput).
- Batched messages can be compressed for high efficiency.
- Content of a message: message key - message value
- Metadata: message offset

- Messages/events stored in a given partition based on an event id. 
- Order: FIFO


**Message key**:
Có thể điều khiển message rơi vào partition nào dựa trên message key.

**Message offset**:
Là một metadata gắn với message. Bản chất thì nó là một số tăng dần, quyết định thứ tự của message trong partition. Bằng cách ghi nhớ offset thì consumer có thể tiếp tục làm việc từ chỗ nó kết thúc.

**Schemas**:
Kafka ko yêu cầu message phải có schema. Tuy nhiên các message nên tuân theo schema JSON, XML... để giảm thiểu vấn đề xảy ra khi thay đổi schema.


### Topic
**Topics** are logical groupings of events
- Similar to a table in a relational database
- Sometimes refered as an event log

- Messages are immutable, messages in a topic can be RW, but not modified
- Messages are R/W from topic (specifically, from partition).
- Topic is the subject name of where the events are published by producers.

### Partition
A topic can be divided into multiple partitions
- ==Messages are ordered by time only within a partition and not across the entire topic==.
- Messages are read from beginning to end in a partition.
- Message can only be appended to the end of a partition. (Notice the similarity to a commit log)
- Partitions allow Kafka to scale horizontally and also provide redundancy. Each partition can be hosted on a different server, which allows new partitions to be added to a topic as the load on the system increases.

![Pasted image 20220830095853.png](/static/images/blog/all-you-need-to-know-about-kafka/Pasted%20image%2020220830095853.png)

- Having more than one partition in a topic enables parallelism as more consumers can read from the topic.

- Partitions belonging to a topic can be distributed across separate brokers in the cluster, which brings HA and scalability. If one broker fails, the partitions on the remaining brokers can continue to serve data, ensuring fault tolerance.



#### Partitioner

Việc route đến partition nào do **partitioner** đảm nhiệm
- Messages cùng key thì rơi vào cùng partition
- Nếu ko specify key thì message sẽ đc route theo round-robin fashion
- Thường thì ko nên add new partitions vào topic khi mà partitioning by keys khá quann trọng vì nó có thể ko đảm bảo new message rơi vào partition cũ nữa.


Có thể implement custom partitioner nếu cần custom logic phức tạp hơn cơ chế message key.


### Brokers
Brokers are physical servers that handle event streams.

After events are published by producers, the broker makes the events available to consumers. Brokers bring scalability to Kafka as Kafka clusters can span multiple brokers across a variety of infrastructure setup to handle large volumes of events. They also bring fault tolerance since events can be stored and replicated across multiple brokers.

- 1 cluster contains n brokers
- Usually, 1 broker is elected as the controller


Partition có thể đc gán cho nhiều broker (replication) -> redundancy.
Tuy nhiên, trong một cluster thì chỉ partition đc sở hữu bởi 1 broker duy nhất, đc gọi là leader. Các broker chứa replicated partition khác gọi là followers.

Messages in Kafka are stored durably for a configurable retention period. Messages can be stored for a certain number of days or up until the topic reaches a specific size in bytes, when the messages are expired and deleted.

A broker is responsible for receiving messages from producers and committing them to disk. Similarly, brokers also receive requests from readers and respond with messages fetched from partitions.

![Pasted image 20220830101420.png](/static/images/blog/all-you-need-to-know-about-kafka/Pasted%20image%2020220830101420.png)

### Producers
**Producers** (writers or publishers) are client applications that write events to Kafka topics as a stream of events.

Producers can direct messages to specific partitions using the message key and implement complex rules for partition assignment using a custom partitioner.



![Pasted image 20220830103600.png](/static/images/blog/all-you-need-to-know-about-kafka/Pasted%20image%2020220830103600.png)

Có 3 cách message có thể đc gửi đi:
- Fire and forget: message đc gửi lên Kafka, ko quan tâm có thành công hay không. Trong đa số trường hợp thì cách này vẫn ổn, vì producer có cơ chế retry for failures. Cơ mà nếu retry timeout thì vẫn bị mất message
- Synchronous: message đc gửi và đc đợi để kiểm tra
- Asyncronous: message đc gửi kèm theo callback. Kafka broker sẽ thông báo thông qua callback này. (cách này khá scalable)

#### Producer serialization
Có thể dùng Apache Avro để serialize

### Consumers
**Consumers** (subscribers or readers) are the client applications that subscribe to topics to read messages
- Consumers read events in the order they were received within each partition.

**Consumer group**: It consists of 1+ consumers working together to read a topic.

Each partition is read by a single member of the group, though a single consumer can read multiple partitions. The mapping of a consumer to a partition is called the ownership of the partition by the consumer. If a consumer fails, the remaining consumers in the group will rebalance the partitions amongst themselves to make up for the failed member.

![Pasted image 20220830101530.png](/static/images/blog/all-you-need-to-know-about-kafka/Pasted%20image%2020220830101530.png)


Consumer group is used to organize consumers that are reading a stream of events from one or more topics. Consumer groups enable parallel processing of events and each consumer in the consumer group can read from one partition to enable load balancing on the client application. This functionality not only brings the parallel processing but also brings fault tolerance since if a consumer fails in a consumer group, Partition can be reassigned to another group member.



## Consumer and Consumer Groups
Với data streaming thì consumer thường xử lý chậm hơn producer, thế nên cần sử dụng consumer groups. Có một số cách config cho consumer và partitions trong cùng một topic như sau:
- n_consumers = n_partitions
	- Map 1-1
- n_consumers &lt; n_partitions (n_consumers &gt; 1)
- n_consumers = 1 (n_partitions &gt; 1)
- n_consumers &gt; n_partitions
	- Some consumers will be idle

Tăng số consumer trong group là cách chính để scale Kafka khi số lượng message trong topic gia tăng. Thế nên, số partitions trong một topic cũng nên có nhiều để chuẩn bị trước khi scale.

Consumer có thể đc tạo mà ko cần consumer group, tuy nhiên trường hợp này không phổ biến đối với Kafka.
Consumer có thể sử dụng regex để subscribe đến nhiều topic.

Poll loop: consumers poll broker để lấy message.

### Commits and Offsets
The **offset** identifies the position in a partition up to which a consumer has read. The act of durably storing or updating that position is called the **commit**. Unlike some other messaging systems, Kafka doesn’t track acknowledgments from the consumers of read records. Instead, the onus of tracking a consumer’s position within a partition is on the consumer itself. Each consumer commits its offset for every partition it is reading by writing a message to a special Kafka topic called **__consumer_offsets**.

Khi rebalance xảy ra thì consumer sẽ dựa vào committed offset để tiếp tục. Cách commit khác nhau sẽ dựa vào yêu cầu của hệ thống.

### Handling Rebalances
Trong class Consumer (của Java) có một số hàm để handle các event liên quan đến rebalance

### Stopping a consumer
### Deserialization

## Replication
Trong Kafka có 2 loại replica: leader và follower



## Why is Kafka fast

There are many design decisions that contributed to Kafka’s performance. In this post, we’ll focus on two. We think these two carried the most weight.

![why_is_kafka_fast.jpeg](/static/images/blog/all-you-need-to-know-about-kafka/why_is_kafka_fast.jpeg)

1. The first one is Kafka’s reliance on Sequential I/O.
2. The second design choice that gives Kafka its performance advantage is its focus on efficiency: zero copy principle.
 
The diagram illustrates how the data is transmitted between producer and consumer, and what zero-copy means.
 
- Step 1.1 - 1.3: Producer writes data to the disk 
- Step 2: Consumer reads data without zero-copy

2.1 The data is loaded from disk to OS cache

2.2 The data is copied from OS cache to Kafka application

2.3 Kafka application copies the data into the socket buffer 

2.4 The data is copied from socket buffer to network card

2.5 The network card sends data out to the consumer

 
- Step 3: Consumer reads data with zero-copy

3.1: The data is loaded from disk to OS cache
3.2 OS cache directly copies the data to the network card via sendfile() command
3.3 The network card sends data out to the consumer
 
Zero copy is a shortcut to save the multiple data copies between application context and kernel context.


## Popular problems need to solve when using Kafka

### Partition rebalancing
**Partition rebalancing (or consumer rebalancing)**: assigns the partitions that the dead consumer was reading from to the remaining healthy consumers in a consumer group.
- This can happen due to the changing number of consumer instances within a consumer group.

![Pasted image 20220830103134.png](/static/images/blog/all-you-need-to-know-about-kafka/Pasted%20image%2020220830103134.png)

Broker còn đóng vói trò làm group coordinator cho consumer group. Nó check health của consumer thông qua heartbeat. Nếu consumer down thì chạy partition rebalance.

Consumer rebalancing is needed to ensure partitions are evenly distributed. However, rebalancing can cause disruption and increased latency, particularly due to the near real-time nature of the e-commerce landscape.

### Poison pill messages
TLDR:
- How to solve? -> [[Dead-Letter Queue]]

A “poison pill” message in Kafka is a message that consistently causes a consumer to fail when attempting to process it.

This can happen due to various reasons such as:
- **Malformed Data:** The message payload may not be in an expected format.
- **Unexpected Data:** The message content might be syntactically valid but semantically incorrect. In other words, it might violate some business constraints.
- **Bugs in the Consumer Code:** If there’s a bug (like a null pointer exception) in the code that handles the message, the processing will fail.

When the consumer encounters such a message, it will fail to process it and throw an exception. By default, the consumer will return to the broker to fetch the same batch of messages again. Since the poison pill message is still present in that batch, the consumer will again fail to process it, and this loop continues indefinitely.

As a result, the consumer gets stuck on this one bad message and is unable to make progress on other messages in the partition. This is similar to the “head-of-line blocking” problem in networking.



### Cost concern
TLDR:
- Problem in large-scale Kafka cluster


There is a strong coupling between the number of partitions in a Kafka topic and the maximum number of consumers that can read from that topic in parallel. This coupling can lead to increased costs when trying to scale consumer applications to handle higher throughput.

For example, consider that you have a Kafka topic with 10 partitions and 10 consumer instances reading from this topic. Now, if the rate of incoming messages increases and the consumers are unable to keep up (i.e. consumer lag starts to increase), you might want to scale up your consumer application by adding more instances.

However, once you have 10 consumers (one for each partition) in a single group, adding more consumers to that group won’t help because Kafka will not assign more than one consumer from the same group to a partition. The only way to allow more consumers in a group is to increase the number of partitions in the topic.

However, increasing the number of partitions comes with its challenges and costs.

-   Kafka has a recommended limit on the number of partitions per broker (for example, 4000 partitions per broker). If you keep increasing partitions, you may hit this limit and need to scale the Kafka brokers to larger instances, even if the brokers have sufficient resources to handle the current load. Scaling to larger broker instances is expensive.
    
-   Increasing partitions requires coordination among the Kafka team, the producer, and the consumer teams. In a large organization with thousands of Kafka pipelines, this coordination overhead is significant.
    
-   More partitions also mean more open file handles, increased memory usage, and more threads on the Kafka brokers. This can lead to higher resource utilization and costs.


## Fault tolerant

Example: a Kafka cluster with 3 brokers, 3 topics defined, 2x replication -> can loose 1 system before data failure.

Each topic is shared across 2 brokers within the cluster.


## Managing Kafka Cluster using Apache ZooKeeper

ZooKeeper is a framework to manage information & provide services necessary for running distributed systems.




## Resources
- [https://www.youtube.com/watch?v=UNUz1-msbOM](https://www.youtube.com/watch?v=UNUz1-msbOM)
- Course: Building Scalable Data Pipelines with Kafka - educative.io
- [Kafka vs RabbitMQ - StackOverflow](https://stackoverflow.com/questions/42151544/when-to-use-rabbitmq-over-kafka)


Posts:
- [[The Trillion Message Kafka Setup at Walmart]]: Kafka Connect, DLQ,...


Paper: [[Kafka.pdf]]

## Questions
#flashcards/swe/system-design 

