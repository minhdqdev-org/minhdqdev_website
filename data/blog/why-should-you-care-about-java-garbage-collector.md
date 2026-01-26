---
title: Why should you care about Java Garbage Collector?
date: '2026-01-26'
tags:
- post
- research
- java
draft: false
authors:
- Dang Quang Minh
---

## TL;DR
- Với developer: clean code + xài IntelliJ Ultimate (IntelliJ Profiler + SonarLint)
- Với devops: luôn set `resources.limits.memory`
- Với tech lead: nắm được các metric quan trọng trên Grafana và cách sử dụng các công cụ hỗ trợ quá trình debug incident
- Với CTO: nắm được những điều cần cải thiện trong SDLC để xây dựng sản phẩm tốt hơn

## Disclaimed
Bài này không đi giải thích chi tiết về Java GC, nó nhan nhản trên mạng rồi.
Mình viết bài này dưới góc độ của một backend developer đang không làm việc tại big tech, nơi tốc độ release sản phẩm kinh doanh quan trọng hơn việc viết clean & optimized code.

Hiểu về Java GC để làm gì? -> writing high-performance applications and troubleshooting crashes. 

Ở công ty của mình thì biết cách troubleshooting crashes nó quan trọng vl. Mình muốn dành thời gian đi code chứ không muốn đi support L3 đâu.

Mình assume phiên bản Java 17+, một số tính năng mình đề cập trong bài có thể ko work với phiên bản cũ hơn, so double check that.

## Introduction
Java GC được xây dựng dựa trên một quan sát, gọi là Weak Generational Hypothesis, đại loại như sau:
1. **Most objects die young.** (They are created, used briefly, and then discarded).
2. **Few references exist from older objects to younger objects.**

Because of this, the Java Heap (where objects live) is divided into **distinct regions** so the GC can treat short-lived objects differently from long-lived ones.
- Young Generation: where new objects are allocated
	- Eden Space
	- Survivor Spaces (S0 and S1): objects that survive a GC cycle in Eden are moved here
- Old Generation (Tenured): E.g. long-live caches, session data, or core application beans
- Metaspace: stores class metadata and static variables. It is separate from the main Heap

GC algorithm: mark (dead/alive), sweep (reclaims memory), compact (defragmentation)

Minor GC: clean the Young Generation, frequently and fast
Major/Full GC: clean the Old Generation, slower, can freeze app for seconds
- Stop-The-World (STW): pause all threads to safely move objects around in memory

-> The goal of modern GC tuning is to minimize the duration of these STW pauses.


Các loại GC phổ biến trong Java:
- G1 GC (default in Java 9+): most apps should use this
- ZGC/Shenandoah: newest generation, design for massive heaps (terabytes) with sub-millisecond pauses


## Level 1: Làm gì để viết code tránh bị memory leak?
Phần này dành cho developer

Memory leak trong context này được hiểu là GC không thể tự động clean được, chủ yếu là do cách mình code. Mình list một số trường hợp sau:

- Adding objects to a static List and never removing them. GC can't delete these because they are still "reachable"
- Tạo biến ở scope to hơn cần thiết. VD: tạo object property, trong khi biến đó chỉ cần sử dụng trong đúng một method -> variable đi theo lifecycle của object.
- **Beware of Finalizers:** Avoid overriding the `finalize()` method. It is deprecated, unpredictable, and makes GC much slower.
- Không sử dụng StringBuilder khi concat số lượng lớn string -> tạo pressure cho Eden space
- Infinite Loop
- Tạo connection nhưng không đóng (Stream, JDBC Connection, File,...). Mình đã từng dính lỗi này với SFTP connection, khiến app lâu lâu bị crash mà không rõ nguyên nhân (ý là có log nhưng ở môi trường non-prod nên công ty clear log daily, cũng như ko cung cấp đầy đủ công cụ monitor như trên prod để tiết kiệm)
	- Đọc log thì sẽ thấy lỗi java.lang.OutOfMemoryError: Java heap space
- v.v...

Nói chung là code nhiều thì sẽ nhìn ra được những lỗi như này và developer có thể hạn chế được từ lúc viết. Và developer hiếm khi phải đi tune GC.

Ngoài ra thì cũng có nhiều công cụ static analysis giúp detect cho mình.

Với Intellij:
- Intellij Profiler (chỉ có trên bản Ultimate):
	- Có thể xem biểu đồ bộ nhớ theo thời gian thực ngay trong IDE
	- Tính năng: xem Live Memory, Memory Allocation, và phát hiện High GC usage. Có thể click chuột phải vào tên class và chọn "Show History" để xem object có được clean up không

- Inspections (phân tích tĩnh):
	- intellij tự động underline đoạn code có nguy cơ gây leak

- Plugins: SonarLint (highly recommended), SpotBugs


VSCode: (không recommend cho Enterprise)
- Plugins: SonarLint, Extension Pack for Java (Microsoft), VisualVM Launcher


## Level 2: Config JVM
Phần này dành DevOps

Sau khi bạn tự tin là code tối ưu rồi thì có thể tính đến chuyện config JVM initial heap size và max heap size ở startup command.

VD:
```
java -Xms2G -Xmx4G -jar my-spring-app.jar
```

Nếu không set các giá trị này thì sao? nếu không nhầm thì default là 1/4 giá trị RAM vật lý của máy.


Cơ mà hầu hết hết các doanh nghiệp hiện nay sẽ chạy ứng dụng trong k8s pod.

Nên ta có thể giới hạn ở tầng k8s (trong deployment definition) như sau:
```yaml
resources:
  requests:
    memory: "512Mi"
  limits:
    memory: "1Gi"  # <--- Đây là giới hạn cứng của Container
```

Vấn đề "2 ông gác cổng":
Nếu set k8s limit mà không set cấu hình JVM limit thì JVM có thể hiểu nhầm là nó đang chạy trên máy chủ vật lý (vd: 32GB RAM) và cố gắng chiếm nhiều hơn 1Gi

- Kịch bản 1: JVM limit <= k8s limit -> java.lang.OutOfMemoryError, có log lỗi Java rõ ràng, dễ trace
- Kịch bản 2: JVM limit > k8s limit -> lỗi k8s OOMKilled, k8s sẽ kill -9 pod, và ko có dòng log lỗi nào.

Best practice: Thay vì hardcode cấu hình JVM limit thì set heap size bằng 75% k8s limit. (áp dụng cho Java 10+)
- 25% còn lại dành cho các phần khác (metaspace, thread stack, overhead...)
```
env:
  - name: JAVA_TOOL_OPTIONS
    value: "-XX:MaxRAMPercentage=75.0"
```



## Level 3: Monitor trên production
Phần này dành cho dev lead. Khi service golive sẽ cần monitor day one, kiểm tra xem service có gặp vấn đề gì về JVM không. 

Có rất nhiều công cụ hỗ trợ, mình list ở đây 3 công cụ mà công ty mình đang sử dụng (thực ra cũng khá là standard trong ngành)

### Grafana
Xem trên Grafana, thường thì sẽ là Dashboard 4701 (JVM(Micrometer)) - community standard rồi.

Cần quan tâm các chỉ số nào?
- jvm_memory_used_bytes: Heap usage over time
- jvm_gc_pause_seconds_max: The longest stop-the-world pause
- jvm_gc_memory_promoted_bytes_total: How much data is moving from Young to Old Gen (high rate = potential issue)



### Dynatrace
Dynatrace is an APM (Application Performance Monitoring) tool. Unlike Grafana (which requires configuration), Dynatrace usually works via Auto-Instrumentation.

Prerequisite: You install the Dynatrace Operator on your K8s cluster. It automatically injects the OneAgent into your pods when they start.

What you get automatically:
- **Automatic Root Cause Analysis:** If GC spikes, Dynatrace will alert you _and_ tell you which specific API endpoint caused the memory pressure.
- **Memory Profiling:** It can take memory snapshots automatically when `OutOfMemory` is imminent.


### OpenSearch
While Grafana show "GC is slow", OpenSearch shows you "Why". You can use OpenSearch to analyze the raw GC logs for deep-dive root cause analysis.

Query ở OpenSearch:
```
gc_type: "Full GC" AND duration > 1s
```





## Level 4: Manage JVM at organization level

Làm thế nào để giảm thiểu lỗi memory leak ở góc độ doanh nghiệp? Đơn giản là xây dựng SDLC hoàn chỉnh hơn (tốn nhiều tiền hơn)

- Tích hợp SonarQube hoặc các dịch vụ tương tự làm quality gate cho CI/CD pipeline (static analysis). Đảm bảo code "sạch đẹp" trước khi lên môi trường SIT
- SDLC có quy trình PT. Kể cả pass static analysis thì vẫn có nguy cơ chết ở runtime. Chạy PT từ sớm có thể phát hiện được những lỗi phải có request nhiều mới bị, hoặc để service chạy thời gian dài mới bị crash.
- If you have budget, use Dynatrace


Lỗi OOM này chiếm bao nhiêu % lỗi xảy ra trên production?



Nếu anh/chị cần tư vấn cho doanh nghiệp, hãy liên hệ ngay với tôi qua email này để được nhận tự vấn chính xác với mức giá phải chăng.


## Further questions

### C++ không có thì phải handle kiểu gì?
Triết lý của C++ là "Zero Overhead" (không tốn tài nguyên cho những thứ bạn không dùng)
- Cách cổ điển (C-style / Legacy C++): xin bộ nhớ (`new`) thì phải tự trả (`delete`)
	- Lưu ý là xin gì, trả nấy, và trả đúng. Không thì rất dễ xảy ra memory leak hoặc crash.
- Cách hiện đại (Modern C++): Resource Acquisition Is Initialization & Smart Pointers (sử dụng cơ chế Reference Counting)

Nếu được handle đúng cách thì C++ tối ưu memory hơn Java nhiều do clean up luôn sau khi dùng xong, chứ không đợi GC quét.

### Python có cơ chế tương tự không?
Python sử dụng cơ chế lai, Reference Counting (chính) và Generational GC (phụ).

Vì Python giải phóng bộ nhớ ngay khi ref count = 0, nên bộ nhớ của Python ít khi bị "phình to rồi sụt giảm đột ngột" (sawtooth pattern) như Java, trừ khi có circular reference.

VD: JVM
![Pasted image 20251217115944.png](/static/images/blog/why-should-you-care-about-java-garbage-collector/Pasted%20image%2020251217115944.png)

### JavaScript thì sao?
JavaScript cụ thể là V8 engine trong Chrome và Node.js có cơ chế GC khá giống Java.

Vì JavaScript là single threaded language nên nếu GC chạy quá lâu, nó sẽ chặn đứng main execution thread. JavaScript thường dùng cho frontend nên nó có thể khiến bị đơ, scroll bị khựng, UX sẽ khá là tệ. Vậy nên, V8 hiện đại sử dụng Incremental Marking (dọn từng chút một) và Concurrent Marking (dọn trên luồng phụ) để giảm thiểu vấn đề này.

### AI ngày nay giúp ích được gì về vấn đề này, đối với developer, devops engineer, CTO?

Với developers:
*Mục tiêu: Viết code sạch, ít leak và phát hiện lỗi sớm (Shift Left).*
- Sử dụng AI Code Assistant giúp phát hiện anti-pattern, giải thích nguy cơ memory leak, xây dựng các unit test liên quan đến GC giúp phát hiện từ sớm
- Sử dụng Intelligent Profiling tool như IntelliJ AI Assistant

Với DevOps:
*Mục tiêu: Hệ thống ổn định, tự động phục hồi và cấu hình chuẩn xác.*
- **AIOps (Dynatrace Davis, Datadog Watchdog, New Relic AI):**
	- **Predictive Analysis:** Thay vì đợi sập mới báo, AI học biểu đồ sử dụng RAM của app trong 30 ngày qua. Nó sẽ cảnh báo: _"Dựa trên xu hướng hiện tại, Pod Payment-Service sẽ bị OOMKilled trong 4 tiếng nữa. Hãy tăng limit hoặc restart."_
	- **Tự động tìm nguyên nhân (Root Cause Analysis):** Khi sự cố xảy ra, AI sẽ tự động liên kết các dữ kiện: _"CPU tăng cao lúc 10:00 do Full GC chạy liên tục, nguyên nhân là do bản deploy lúc 09:50 có thay đổi class `OrderService`."_

- **Kubernetes Autoscaling thông minh (Goldilocks, Cast AI, StormForge):**
	- **Rightsizing (Cấu hình vừa khít):** Kỹ sư DevOps rất sợ set limit thấp gây crash, nên hay set thừa (over-provisioning). AI sẽ phân tích hành vi thực tế và đề xuất: _"Bạn đang set 4GB nhưng app chỉ dùng tối đa 1.2GB. Hãy giảm xuống 2GB để tiết kiệm 50% chi phí."_
	- **Tự động tune tham số JVM:** Có những công cụ AI (như Akamas) chạy thử nghiệm hàng trăm tổ hợp flag GC (`-XX:NewRatio`, `-XX:SurvivorRatio`) để tìm ra bộ cấu hình tối ưu nhất cho throughput của app bạn.

Với CTO / Engineering Manager
*Mục tiêu: Tối ưu chi phí (FinOps) và giảm nợ kỹ thuật.*
- **Tối ưu hóa chi phí Cloud (FinOps):**
    - Bộ nhớ là tiền bạc (RAM trên AWS/GCP rất đắt). AI giúp CTO nhìn thấy bức tranh tổng thể: _"Hệ thống đang lãng phí 30% ngân sách vào các Pods không dùng hết RAM. Nếu áp dụng AI Autoscaling, công ty tiết kiệm được $5000/tháng."_

- **Đánh giá rủi ro & Nợ kỹ thuật:**
    - Các công cụ phân tích code tĩnh tích hợp AI (như SonarQube AI) có thể báo cáo cho CTO biết chất lượng code của team đang đi xuống, cụ thể là ngày càng nhiều đoạn code có nguy cơ gây leak, từ đó đưa ra quyết định refactor hệ thống kịp thời trước khi nó trở thành "quả bom nổ chậm".


## Final words
Dù bài viết này chỉ bàn luận một vấn đề duy nhất là Java Garbage Collector nhưng mình chắc chắn là nó sẽ gợi mở cho bạn nhiều chủ đề thú vị xoay quanh software engineering. Hy vọng bài viết này sẽ giúp ích được cho bạn trong quá trình xây dựng sản phẩm phần mềm vừa nhanh chóng và hiệu quả. 

Nếu có gì chưa đúng hoặc cần bổ sung, hãy comment bên dưới nhé :D
